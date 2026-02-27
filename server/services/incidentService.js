/**
 * Incident Service – S3 CSV fetch, parse, and score computation
 * ──────────────────────────────────────────────────────────────
 * Data pipeline:
 *   Jetson device  →  appends rows to S3 CSV  →  this service fetches + parses  →  Express routes
 *
 * Local development fallback:
 *   If S3_BUCKET_NAME is not set, the service looks for local files under
 *   server/data/incidents/YYYY-MM-DD.csv so you can test without S3 access.
 *   Place a sample CSV there to see live scoring locally.
 *
 * Required env vars (server/.env):
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 *   S3_BUCKET_NAME, S3_INCIDENTS_PREFIX, S3_CLIPS_PRESIGN_EXPIRES
 */

const path = require('path');
const fs   = require('fs');

// AWS SDK loaded lazily so the app still starts if the package isn't installed yet
let S3Client, GetObjectCommand, getSignedUrl;
try {
  ({ S3Client, GetObjectCommand } = require('@aws-sdk/client-s3'));
  ({ getSignedUrl }               = require('@aws-sdk/s3-request-presigner'));
} catch {
  // SDK not installed – S3 features disabled, local file fallback still works
}

const { SCORING_RULES, computeScore } = require('../config/scoring');

// ─── Config ───────────────────────────────────────────────────────────────────
const BUCKET           = process.env.S3_BUCKET_NAME;
const INCIDENTS_PREFIX = process.env.S3_INCIDENTS_PREFIX || 'incidents/';
const PRESIGN_EXPIRES  = parseInt(process.env.S3_CLIPS_PRESIGN_EXPIRES || '3600', 10);
const LOCAL_DATA_DIR   = path.join(__dirname, '..', 'data', 'incidents');

const s3 = (S3Client && BUCKET)
  ? new S3Client({ region: process.env.AWS_REGION || 'eu-west-2' })
  : null;

// ─── In-memory cache (5-minute TTL) ──────────────────────────────────────────
const _cache    = {};
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
  const e = _cache[key];
  if (!e) return null;
  if (Date.now() - e.at > CACHE_TTL) { delete _cache[key]; return null; }
  return e.v;
}
function setCached(key, v) { _cache[key] = { v, at: Date.now() }; }

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toDateStr(d)   { return d.toISOString().slice(0, 10); }
function startOfDay(d)  { const r = new Date(d); r.setHours(0,0,0,0); return r; }
function startOfWeek(d) {
  const r = new Date(d); r.setHours(0,0,0,0);
  const day = r.getDay();
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1)); // roll back to Monday
  return r;
}
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }

function dateRange(start, end) {
  const dates = [];
  const cur   = new Date(startOfDay(start));
  const last  = new Date(startOfDay(end));
  while (cur <= last) { dates.push(toDateStr(cur)); cur.setDate(cur.getDate() + 1); }
  return dates;
}

function getShift(timestamp) {
  const h = new Date(timestamp).getUTCHours();
  if (h >= 6  && h < 14) return 'morning';
  if (h >= 14 && h < 22) return 'afternoon';
  return 'night';
}

// ─── CSV fetch ────────────────────────────────────────────────────────────────
async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

async function fetchCSVForDate(dateStr) {
  const cacheKey = `csv:${dateStr}`;
  const hit = getCached(cacheKey);
  if (hit !== null) return hit;

  // 1. Local file (development / testing)
  const localFile = path.join(LOCAL_DATA_DIR, `${dateStr}.csv`);
  if (fs.existsSync(localFile)) {
    const incidents = parseCSV(fs.readFileSync(localFile, 'utf-8'));
    setCached(cacheKey, incidents);
    return incidents;
  }

  // 2. S3
  if (!s3 || !BUCKET) {
    setCached(cacheKey, []);
    return [];
  }

  try {
    const resp      = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key:    `${INCIDENTS_PREFIX}${dateStr}.csv`,
    }));
    const text      = await streamToString(resp.Body);
    const incidents = parseCSV(text);
    setCached(cacheKey, incidents);
    return incidents;
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      setCached(cacheKey, []); // cache the miss to avoid repeat 404s
      return [];
    }
    console.error(`[incidents] S3 error for ${dateStr}:`, err.message);
    return [];
  }
}

// ─── CSV parsing ──────────────────────────────────────────────────────────────
/**
 * Parse a CSV string into enriched incident objects.
 * Expected header row:
 *   timestamp,incident_type,camera_id,building_name,floor_num,location,clip_s3_key,duration_seconds
 */
function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers   = lines[0].split(',').map(h => h.trim().toLowerCase());
  const incidents = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = splitCSVRow(lines[i]);
    if (vals.length < headers.length) continue;

    const row = {};
    headers.forEach((h, idx) => { row[h] = vals[idx]; });

    const rule = SCORING_RULES[row.incident_type];
    if (!rule) {
      console.warn(`[incidents] Unknown incident_type "${row.incident_type}" on row ${i + 1} – skipping`);
      continue;
    }

    incidents.push({
      id:                `${row.timestamp}-${row.camera_id}`,
      timestamp:         row.timestamp,
      date:              row.timestamp.slice(0, 10),
      time:              row.timestamp.slice(11, 19),
      incident_type:     row.incident_type,
      safety_event_type: row.incident_type,          // frontend compatibility alias
      camera_id:         row.camera_id,
      building_name:     row.building_name,
      floor_num:         parseInt(row.floor_num, 10) || 1,
      location:          row.location,
      clip_s3_key:       row.clip_s3_key || null,
      video_url:         null,                        // populated by addPresignedUrls()
      duration:          row.duration_seconds ? `${parseFloat(row.duration_seconds).toFixed(1)}s` : null,
      duration_seconds:  parseFloat(row.duration_seconds) || 0,
      risk_score:        rule.risk_score,
      severity:          rule.severity,
      label:             rule.label,
      description:       rule.description,
      emoji:             rule.emoji,
      group:             rule.group,
      deduction:         rule.deduction,
      shift:             getShift(row.timestamp),
    });
  }

  return incidents;
}

function splitCSVRow(line) {
  const result = [];
  let cur = '', inQ = false;
  for (const ch of line) {
    if      (ch === '"')            { inQ = !inQ; }
    else if (ch === ',' && !inQ)   { result.push(cur.trim()); cur = ''; }
    else                            { cur += ch; }
  }
  result.push(cur.trim());
  return result;
}

// ─── Range query ──────────────────────────────────────────────────────────────
async function getIncidentsForRange(startDate, endDate) {
  const dates  = dateRange(startDate, endDate);
  const arrays = await Promise.all(dates.map(fetchCSVForDate));
  return arrays.flat().filter(inc => {
    const ts = new Date(inc.timestamp);
    return ts >= startDate && ts <= endDate;
  });
}

// ─── Presigned URL generation ─────────────────────────────────────────────────
async function addPresignedUrls(incidents) {
  if (!s3 || !BUCKET || !getSignedUrl) return incidents; // no S3 config

  return Promise.all(incidents.map(async (inc) => {
    if (!inc.clip_s3_key)                   return inc;
    if (inc.clip_s3_key.startsWith('http')) return { ...inc, video_url: inc.clip_s3_key };

    try {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: inc.clip_s3_key }),
        { expiresIn: PRESIGN_EXPIRES }
      );
      return { ...inc, video_url: url };
    } catch (err) {
      console.warn(`[incidents] Presign failed for ${inc.clip_s3_key}:`, err.message);
      return inc;
    }
  }));
}

// ─── Safety score computation ─────────────────────────────────────────────────
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Compute all safety score periods + 7-day history for the dashboard panel.
 * Returns the same shape as MOCK.safetyScores in dashboardApi.js.
 */
async function getSafetyScores() {
  const cacheKey = 'scores';
  const hit = getCached(cacheKey);
  if (hit) return hit;

  const now        = new Date();
  const todayStart = startOfDay(now);
  const weekStart  = startOfWeek(now);
  const monthStart = startOfMonth(now);

  // Comparison periods for deltas
  const yStart  = new Date(todayStart.getTime() - 86400000); // yesterday same time window
  const yEnd    = new Date(now.getTime()         - 86400000);
  const lwStart = new Date(weekStart.getTime()  -  7 * 86400000);
  const lwEnd   = new Date(weekStart.getTime()  -  1);
  const lmStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);
  const lmEnd   = new Date(monthStart.getTime() - 1);

  const [todayIncs, yIncs, weekIncs, lwIncs, monthIncs, lmIncs] = await Promise.all([
    getIncidentsForRange(todayStart, now),
    getIncidentsForRange(yStart,     yEnd),
    getIncidentsForRange(weekStart,  now),
    getIncidentsForRange(lwStart,    lwEnd),
    getIncidentsForRange(monthStart, now),
    getIncidentsForRange(lmStart,    lmEnd),
  ]);

  const todayScore = computeScore(todayIncs);
  const weekScore  = computeScore(weekIncs);
  const monthScore = computeScore(monthIncs);

  // 7-day daily score history (oldest → newest)
  const historyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const historyScores = await Promise.all(historyDates.map(async (d) => {
    const ds = startOfDay(d);
    const de = new Date(ds.getTime() + 86400000 - 1);
    return computeScore(await getIncidentsForRange(ds, de));
  }));
  const history = historyDates.map((d, i) => ({
    label: DAY_NAMES[d.getDay()],
    score: historyScores[i],
  }));

  const avgHistory = Math.round(historyScores.reduce((a, b) => a + b, 0) / historyScores.length);
  const UK_AVG     = 74; // TODO: replace with real market data feed

  const result = {
    today:        todayScore,
    week:         weekScore,
    month:        monthScore,
    today_delta:  Math.round((todayScore - computeScore(yIncs))  * 10) / 10,
    week_delta:   Math.round((weekScore  - computeScore(lwIncs)) * 10) / 10,
    month_delta:  Math.round((monthScore - computeScore(lmIncs)) * 10) / 10,
    history,
    uk_market_avg: UK_AVG,
    uk_percentile: Math.min(99, Math.max(1,
      todayScore >= UK_AVG
        ? Math.round(50 + ((todayScore - UK_AVG) / (100 - UK_AVG)) * 49)
        : Math.round((todayScore / UK_AVG) * 50)
    )),
    internal_avg: avgHistory,
    site_rank:    3,   // TODO: replace with real multi-site ranking
    total_sites:  12,
  };

  setCached(cacheKey, result);
  return result;
}

module.exports = { getSafetyScores, getIncidentsForRange, addPresignedUrls, toDateStr };
