/**
 * Safety Incident Scoring Rules
 * ─────────────────────────────
 * Each Jetson device appends one CSV row per detected event to S3.
 * The safety score for any period starts at 100 and each incident
 * deducts the points defined below.  Score is clamped at 0.
 *
 * The `incident_type` string in the CSV must exactly match a key here.
 *
 * ─── Expected CSV format ────────────────────────────────────────────────────
 *   timestamp,incident_type,camera_id,building_name,floor_num,location,clip_s3_key,duration_seconds
 *   2026-02-27T14:32:45.000Z,no-high-vis,cam-01,Clark Building,1,Main Entrance,clips/2026-02-27/001.mp4,3.2
 *
 * ─── S3 key pattern ──────────────────────────────────────────────────────────
 *   s3://<S3_BUCKET_NAME>/<S3_INCIDENTS_PREFIX><YYYY-MM-DD>.csv
 *   e.g. s3://node-safety-data/incidents/2026-02-27.csv
 * ────────────────────────────────────────────────────────────────────────────
 */

const SCORING_RULES = {

  // ── PPE ──────────────────────────────────────────────────────────────────
  'no-high-vis': {
    label:       'No High-Vis Vest',
    description: 'Person detected not wearing a high-visibility vest',
    deduction:   10,
    risk_score:  80,
    severity:    'high',
    emoji:       '🦺',
    group:       'ppe',
  },

  // ── MHE Proximity ────────────────────────────────────────────────────────
  'mhe-close-2.5m': {
    label:       'MHE Proximity (2.5m)',
    description: 'Person walking within 2.5m of moving MHE',
    deduction:   5,
    risk_score:  60,
    severity:    'medium',
    emoji:       '🚜',
    group:       'mhe',
  },
  'mhe-close-1m': {
    label:       'MHE Proximity (1m)',
    description: 'Person walking within 1m of moving MHE',
    deduction:   10,
    risk_score:  90,
    severity:    'high',
    emoji:       '🚜',
    group:       'mhe',
  },

  // ── Walkway ───────────────────────────────────────────────────────────────
  'walkway-exit': {
    label:       'Walkway Exit (>3s)',
    description: 'Person enters walkway then steps off for more than 3 seconds',
    deduction:   1,
    risk_score:  25,
    severity:    'low',
    emoji:       '🚧',
    group:       'walkway',
  },
  'walkway-congregation-2': {
    label:       'Walkway Congregation (2)',
    description: 'Two people congregating on a walkway',
    deduction:   0.5,
    risk_score:  20,
    severity:    'low',
    emoji:       '🚧',
    group:       'walkway',
  },
  'walkway-congregation-3': {
    label:       'Walkway Congregation (3+)',
    description: 'Three or more people congregating on a walkway',
    deduction:   1,
    risk_score:  30,
    severity:    'low',
    emoji:       '🚧',
    group:       'walkway',
  },

  // ── Dock ─────────────────────────────────────────────────────────────────
  'dock-door-open': {
    label:       'Unattended Dock Door',
    description: 'Dock door open with no vehicle present on bay',
    deduction:   5,
    risk_score:  55,
    severity:    'medium',
    emoji:       '🚪',
    group:       'dock',
  },

};

/**
 * Compute a safety score from an array of incidents.
 * @param {Array<{incident_type: string}>} incidents
 * @returns {number} 0–100 (rounded to 1 decimal place)
 */
function computeScore(incidents) {
  const totalDeduction = incidents.reduce((sum, inc) => {
    const rule = SCORING_RULES[inc.incident_type];
    return sum + (rule ? rule.deduction : 0);
  }, 0);
  return Math.max(0, Math.round((100 - totalDeduction) * 10) / 10);
}

module.exports = { SCORING_RULES, computeScore };
