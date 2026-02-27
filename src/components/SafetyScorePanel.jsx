import React, { useState, useEffect, useCallback } from 'react';
import { fetchSafetyScores, MOCK } from '../services/dashboardApi';
import './SafetyScorePanel.css';

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#22d3ee' }) => {
  if (!data || data.length < 2) return null;
  const scores = data.map(d => d.score);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;
  const W = 170; const H = 44; const P = 4;

  const pts = scores.map((s, i) => {
    const x = P + (i / (scores.length - 1)) * (W - 2 * P);
    const y = H - P - ((s - min) / range) * (H - 2 * P);
    return [x, y];
  });

  const lineStr  = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const fillStr  = `${pts[0][0]},${H} ${lineStr} ${pts[pts.length - 1][0]},${H}`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="sparkline-svg" aria-hidden="true">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillStr} fill="url(#spark-grad)" />
      <polyline points={lineStr} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3.5" fill={color}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
    </svg>
  );
};

// ─── Comparison Bars ──────────────────────────────────────────────────────────
const CompareBar = ({ yourScore, benchmarkScore, accentColor }) => (
  <div className="compare-bars">
    <div className="compare-bar-row">
      <span className="compare-bar-label">You</span>
      <div className="compare-bar-track">
        <div className="compare-bar-fill compare-bar-fill--you"
          style={{ width: `${yourScore}%`, '--bar-color': accentColor }} />
      </div>
      <span className="compare-bar-value">{yourScore}</span>
    </div>
    <div className="compare-bar-row">
      <span className="compare-bar-label">Avg</span>
      <div className="compare-bar-track">
        <div className="compare-bar-fill compare-bar-fill--avg"
          style={{ width: `${benchmarkScore}%` }} />
      </div>
      <span className="compare-bar-value">{benchmarkScore}</span>
    </div>
  </div>
);

// ─── Rank Track ───────────────────────────────────────────────────────────────
const RankTrack = ({ rank, total }) => (
  <div className="rank-track" aria-label={`Ranked ${rank} out of ${total}`}>
    {Array.from({ length: Math.min(total, 12) }).map((_, i) => {
      const pos = i + 1;
      const cls = pos === rank ? 'rank-pip--current'
                : pos < rank  ? 'rank-pip--above'
                : 'rank-pip--below';
      return <div key={i} className={`rank-pip ${cls}`} title={pos === rank ? 'Your site' : undefined} />;
    })}
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const getScoreColor = (score) => {
  if (score >= 85) return '#22d3ee';   // cyan  – excellent
  if (score >= 70) return '#10b981';   // green – good
  if (score >= 55) return '#f59e0b';   // amber – caution
  return '#f43f5e';                     // rose  – poor
};

const PERIODS = [
  { label: 'Today',      key: 'today',  deltaKey: 'today_delta',  prevLabel: 'yesterday'  },
  { label: 'This Week',  key: 'week',   deltaKey: 'week_delta',   prevLabel: 'last week'  },
  { label: 'This Month', key: 'month',  deltaKey: 'month_delta',  prevLabel: 'last month' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const SafetyScorePanel = ({ onScoreClick }) => {
  const [scores,    setScores]    = useState(null);
  const [periodIdx, setPeriodIdx] = useState(0);
  const [animVal,   setAnimVal]   = useState(0);

  useEffect(() => {
    fetchSafetyScores()
      .then(setScores)
      .catch(() => setScores(MOCK.safetyScores));
  }, []);

  const period       = PERIODS[periodIdx];
  const currentScore = scores ? scores[period.key]      : 0;
  const currentDelta = scores ? scores[period.deltaKey] : 0;
  const scoreColor   = getScoreColor(currentScore);

  // Smooth count-up on score/period change
  const animate = useCallback((target) => {
    let frame;
    const start = performance.now();
    const duration = 700;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimVal(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => { if (currentScore) return animate(currentScore); }, [currentScore, animate]);

  if (!scores) {
    return (
      <div className="score-panel score-panel--loading">
        <div className="score-loading-dots"><span /><span /><span /></div>
      </div>
    );
  }

  const diffUK       = scores[period.key] - scores.uk_market_avg;
  const diffInternal = scores[period.key] - scores.internal_avg;
  const isTopQ       = scores.site_rank <= Math.ceil(scores.total_sites * 0.25);
  const isAboveMed   = scores.site_rank <= Math.ceil(scores.total_sites * 0.5);

  return (
    <div className="score-panel">

      {/* ── Card 1: Safety Score ── */}
      <div
        className="score-card score-card--primary"
        style={{ '--accent': scoreColor, cursor: onScoreClick ? 'pointer' : 'default' }}
        onClick={onScoreClick}
        title={onScoreClick ? 'Click for full breakdown' : undefined}
      >
        <div className="score-card__eyebrow">Safety Score</div>

        <div className="score-period-tabs">
          {PERIODS.map((p, i) => (
            <button key={p.key}
              className={`score-tab ${periodIdx === i ? 'score-tab--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setPeriodIdx(i); }}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="score-number" style={{ color: scoreColor }}>
          {animVal}<span className="score-number__denom">/100</span>
        </div>

        <div className={`score-delta ${currentDelta >= 0 ? 'score-delta--pos' : 'score-delta--neg'}`}>
          {currentDelta >= 0 ? '▲' : '▼'} {Math.abs(currentDelta)} pts vs {period.prevLabel}
        </div>

        <Sparkline data={scores.history} color={scoreColor} />
        <div className="score-card__micro">7-day trend</div>
      </div>

      {/* ── Card 2: UK Market ── */}
      <div className="score-card score-card--uk">
        <div className="score-card__eyebrow">UK Market Benchmark</div>

        <div className="uk-percentile-row">
          <span className="uk-pct-label">Top</span>
          <span className="uk-pct-value">{100 - scores.uk_percentile}%</span>
        </div>
        <div className="uk-pct-sub">
          of UK warehouses this {period.label.replace('This ', '').toLowerCase()}
        </div>

        <CompareBar yourScore={scores[period.key]} benchmarkScore={scores.uk_market_avg} accentColor="#22d3ee" />

        <div className="benchmark-footer">
          <span className={diffUK >= 0 ? 'diff--pos' : 'diff--neg'}>
            {diffUK >= 0 ? '+' : ''}{diffUK} pts
          </span>
          {' '}vs UK average ({scores.uk_market_avg})
        </div>
      </div>

      {/* ── Card 3: Internal Ranking ── */}
      <div className="score-card score-card--rank">
        <div className="score-card__eyebrow">Internal Ranking</div>

        <div className="rank-headline">
          <span className="rank-ordinal">{ordinal(scores.site_rank)}</span>
          <span className="rank-of-total">/ {scores.total_sites} sites</span>
        </div>

        <RankTrack rank={scores.site_rank} total={scores.total_sites} />

        <div className="rank-badge">
          {isTopQ ? '🏆 Top quartile' : isAboveMed ? '📈 Above median' : '📉 Below median'}
        </div>

        <CompareBar yourScore={scores[period.key]} benchmarkScore={scores.internal_avg} accentColor="#a78bfa" />

        <div className="benchmark-footer">
          <span className={diffInternal >= 0 ? 'diff--pos' : 'diff--neg'}>
            {diffInternal >= 0 ? '+' : ''}{diffInternal} pts
          </span>
          {' '}vs company average ({scores.internal_avg})
        </div>
      </div>

    </div>
  );
};

export default SafetyScorePanel;
