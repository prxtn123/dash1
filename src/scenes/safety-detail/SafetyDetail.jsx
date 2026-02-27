import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NodeLogo from '../../components/NodeLogo';
import { fetchSafetyScores } from '../../services/dashboardApi';
import { fetchIncidents } from '../../services/mockData';
import './SafetyDetail.css';

const PERIODS = [
  { label: 'Today',      key: 'today',  deltaKey: 'today_delta',  prevLabel: 'yesterday'  },
  { label: 'This Week',  key: 'week',   deltaKey: 'week_delta',   prevLabel: 'last week'  },
  { label: 'This Month', key: 'month',  deltaKey: 'month_delta',  prevLabel: 'last month' },
];

const TYPE_CONFIG = {
  'no-high-vis':    { label: 'No High-Vis',     color: '#a78bfa', emoji: '🦺' },
  'mhe-close':      { label: 'MHE Too Close',   color: '#f87171', emoji: '🚜' },
  'walkway-zoning': { label: 'Walkway Zoning',  color: '#fbbf24', emoji: '🚧' },
};

const getScoreColor = (s) => {
  if (s >= 85) return '#22d3ee';
  if (s >= 70) return '#10b981';
  if (s >= 55) return '#f59e0b';
  return '#f43f5e';
};

const getRiskLevel = (score) => {
  if (score >= 75) return { label: 'HIGH', color: '#ef4444' };
  if (score >= 50) return { label: 'MED',  color: '#f59e0b' };
  return                  { label: 'LOW',  color: '#10b981' };
};

const SafetyDetail = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [periodIdx, setPeriodIdx] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [acknowledged, setAcknowledged] = useState(new Set());

  useEffect(() => {
    fetchSafetyScores().then(setScores);
    fetchIncidents().then(setIncidents);
  }, []);

  const period     = PERIODS[periodIdx];
  const score      = scores ? scores[period.key]      : 0;
  const delta      = scores ? scores[period.deltaKey] : 0;
  const scoreColor = getScoreColor(score);

  const typeCounts = incidents.reduce((acc, i) => {
    acc[i.safety_event_type] = (acc[i.safety_event_type] || 0) + 1;
    return acc;
  }, {});
  const maxCount = Math.max(...Object.values(typeCounts), 1);

  const timeline = [...incidents].sort((a, b) => b.time.localeCompare(a.time));

  const handleAcknowledge = (id) => setAcknowledged(prev => new Set([...prev, id]));

  return (
    <div className="sd-page">
      <div className="bg-orb bg-orb--cyan"   aria-hidden="true" />
      <div className="bg-orb bg-orb--violet" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="sd-header">
        <button className="sd-back-btn" onClick={() => navigate('/')}>← Dashboard</button>
        <div>
          <NodeLogo size="sm" />
          <h1 className="sd-title">Safety Score Breakdown</h1>
          <p className="sd-subtitle">In-depth analysis of your site safety performance</p>
        </div>
      </div>

      {/* ── Period Tabs ── */}
      <div className="sd-period-tabs">
        {PERIODS.map((p, i) => (
          <button
            key={p.key}
            className={`sd-period-tab${periodIdx === i ? ' sd-period-tab--active' : ''}`}
            onClick={() => setPeriodIdx(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Top Row: Score card + Type breakdown ── */}
      <div className="sd-top-row">

        {/* Score card */}
        <div className="sd-score-card" style={{ '--accent': scoreColor }}>
          <div className="sd-score-eyebrow">Safety Score — {period.label}</div>
          <div className="sd-score-number" style={{ color: scoreColor }}>
            {score}<span className="sd-score-denom">/100</span>
          </div>
          <div className={`sd-score-delta ${delta >= 0 ? 'sd-delta--pos' : 'sd-delta--neg'}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} pts vs {period.prevLabel}
          </div>

          {/* 7-day mini bar chart */}
          {scores && (
            <>
              <div className="sd-score-history">
                {scores.history.map(h => (
                  <div key={h.label} className="sd-hist-col">
                    <div
                      className="sd-hist-bar"
                      style={{ height: `${h.score}%`, background: getScoreColor(h.score) }}
                      title={`${h.label}: ${h.score}`}
                    />
                    <span className="sd-hist-label">{h.label}</span>
                  </div>
                ))}
              </div>
              <div className="sd-score-row">
                <div className="sd-bench-item">
                  <span className="sd-bench-label">UK Avg</span>
                  <span className="sd-bench-val">{scores.uk_market_avg}</span>
                </div>
                <div className="sd-bench-item">
                  <span className="sd-bench-label">Company Avg</span>
                  <span className="sd-bench-val">{scores.internal_avg}</span>
                </div>
                <div className="sd-bench-item">
                  <span className="sd-bench-label">Site Rank</span>
                  <span className="sd-bench-val">{scores.site_rank} / {scores.total_sites}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Incident type breakdown */}
        <div className="sd-type-card">
          <h3 className="sd-section-title">Incidents by Type</h3>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
            const count = typeCounts[key] || 0;
            const pct   = Math.round((count / maxCount) * 100);
            return (
              <div key={key} className="sd-type-row">
                <div className="sd-type-info">
                  <span className="sd-type-emoji">{cfg.emoji}</span>
                  <span className="sd-type-label">{cfg.label}</span>
                  <span className="sd-type-count" style={{ color: cfg.color }}>{count}</span>
                </div>
                <div className="sd-type-track">
                  <div
                    className="sd-type-fill"
                    style={{ width: `${pct}%`, background: cfg.color }}
                  />
                </div>
                <button
                  className="sd-clips-btn"
                  onClick={() => navigate(`/incidents?type=${key}`)}
                >
                  View clips →
                </button>
              </div>
            );
          })}
          <div className="sd-type-total">
            <span>Total incidents</span>
            <span className="sd-type-total-num">{incidents.length}</span>
          </div>
          <button
            className="sd-view-all-btn"
            onClick={() => navigate('/incidents')}
          >
            View all clips →
          </button>
        </div>
      </div>

      {/* ── Incident Timeline ── */}
      <div className="sd-timeline-section">
        <h3 className="sd-section-title">Incident Timeline</h3>
        {timeline.length === 0 ? (
          <div className="sd-empty">No incidents recorded</div>
        ) : (
          <div className="sd-timeline">
            {timeline.map(inc => {
              const cfg  = TYPE_CONFIG[inc.safety_event_type] || {};
              const risk = inc.risk_score != null ? getRiskLevel(inc.risk_score) : null;
              return (
                <div
                  key={inc.id}
                  className="sd-tl-item"
                  style={{ '--type-color': cfg.color || '#94a3b8' }}
                >
                  <div className="sd-tl-dot" style={{ background: cfg.color || '#94a3b8' }} />

                  <div className="sd-tl-card">
                    <div className="sd-tl-header">
                      <span className="sd-tl-type" style={{ color: cfg.color }}>
                        {cfg.emoji} {cfg.label}
                      </span>
                      <span className="sd-tl-time">{inc.time}</span>
                      <span className="sd-tl-date">{inc.date}</span>
                      {risk && (
                        <span className="sd-tl-risk" style={{ color: risk.color }}>
                          {risk.label} · {inc.risk_score}
                        </span>
                      )}
                    </div>

                    <div className="sd-tl-location">📍 {inc.location}</div>
                    {inc.description && (
                      <p className="sd-tl-desc">{inc.description}</p>
                    )}

                    <div className="sd-tl-actions">
                      <button
                        className="sd-clip-btn"
                        onClick={() => setSelectedIncident(inc)}
                      >
                        ▶ View Clip
                      </button>
                      <button
                        className={`sd-ack-btn${acknowledged.has(inc.id) ? ' sd-ack-btn--done' : ''}`}
                        onClick={() => handleAcknowledge(inc.id)}
                        disabled={acknowledged.has(inc.id)}
                      >
                        {acknowledged.has(inc.id) ? '✓ Acknowledged' : 'Acknowledge'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Clip Modal ── */}
      {selectedIncident && (
        <div className="sd-modal" onClick={() => setSelectedIncident(null)}>
          <div className="sd-modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="sd-modal-close"
              onClick={() => setSelectedIncident(null)}
            >✕</button>
            <div className="sd-modal-meta">
              <span
                className="sd-modal-type"
                style={{ color: TYPE_CONFIG[selectedIncident.safety_event_type]?.color }}
              >
                {TYPE_CONFIG[selectedIncident.safety_event_type]?.emoji}{' '}
                {TYPE_CONFIG[selectedIncident.safety_event_type]?.label}
              </span>
              <span>{selectedIncident.date} · {selectedIncident.time}</span>
              <span>📍 {selectedIncident.location}</span>
              {selectedIncident.duration && <span>Duration: {selectedIncident.duration}</span>}
            </div>
            <img
              src={selectedIncident.video_url}
              alt="Incident clip"
              className="sd-modal-img"
            />
            {selectedIncident.description && (
              <p className="sd-modal-desc">{selectedIncident.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyDetail;
