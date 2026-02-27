import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import SafetyScorePanel from '../../components/SafetyScorePanel';
import NodeLogo from '../../components/NodeLogo';
import { fetchIncidents } from '../../services/dashboardApi';
import './IncidentDashboard.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function currentWeekDates() {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
  weekStart.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

/**
 * IncidentDashboard - Main page for node Safety Dashboard
 * Displays safety incidents with filtering by type
 */
const IncidentDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      sessionStorage.removeItem('demo_mode');
      await Auth.signOut().catch(() => {}); // no-op if in demo mode
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const [incidents,     setIncidents]     = useState([]);
  const [weekIncidents, setWeekIncidents] = useState([]);
  const [countdown,     setCountdown]     = useState(30);

  useEffect(() => {
    loadIncidents();
    loadWeekIncidents();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { loadIncidents(); loadWeekIncidents(); return 30; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kpis = {
    total:     incidents.length,
    highRisk:  incidents.filter(i => (i.risk_score || 0) >= 75).length,
    noHighVis: incidents.filter(i => i.safety_event_type === 'no-high-vis').length,
    mhe:       incidents.filter(i =>
      i.group === 'mhe' ||
      i.safety_event_type === 'mhe-close-2.5m' ||
      i.safety_event_type === 'mhe-close-1m'
    ).length,
    walkway:   incidents.filter(i =>
      i.group === 'walkway' ||
      i.safety_event_type === 'walkway-exit' ||
      i.safety_event_type === 'walkway-congregation-2' ||
      i.safety_event_type === 'walkway-congregation-3'
    ).length,
    dock:      incidents.filter(i => i.safety_event_type === 'dock-door-open').length,
    compliance: incidents.length > 0
      ? Math.round(((incidents.length - incidents.filter(i => (i.risk_score || 0) >= 75).length) / incidents.length) * 100)
      : 100,
  };
  const typeMax = Math.max(kpis.noHighVis, kpis.mhe, kpis.walkway, kpis.dock, 1);

  const exportCSV = () => {
    const headers = ['ID','Date','Time','Location','Type','Duration','Risk Score'];
    const rows = incidents.map(i => [
      i.id, i.date, i.time, `"${i.location}"`, i.safety_event_type,
      i.duration, i.risk_score ?? 'N/A'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadIncidents = async () => {
    try {
      const data = await fetchIncidents();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWeekIncidents = async () => {
    try {
      const dates   = currentWeekDates();
      const results = await Promise.all(dates.map(date => fetchIncidents({ date })));
      setWeekIncidents(results.flat());
    } catch (err) {
      console.error('Failed to load week incidents:', err);
    }
  };

  // Heatmap: computed from real incidents across this week
  const weekDates   = currentWeekDates();
  const heatmapRows = [
    { shift: 'morning',   label: 'Morning',   emoji: '🌅' },
    { shift: 'afternoon', label: 'Afternoon', emoji: '☀️'  },
    { shift: 'night',     label: 'Night',     emoji: '🌙' },
  ].map(({ shift, label, emoji }) => ({
    shift, label, emoji,
    counts: weekDates.map(d =>
      weekIncidents.filter(i => i.date === d && i.shift === shift).length
    ),
  }));
  const heatmapMax = Math.max(...heatmapRows.flatMap(r => r.counts), 1);

  return (
    <div className="incident-dashboard">

      {/* ── Background orbs (purely decorative) ── */}
      <div className="bg-orb bg-orb--cyan"  aria-hidden="true" />
      <div className="bg-orb bg-orb--violet" aria-hidden="true" />
      <div className="bg-orb bg-orb--green"  aria-hidden="true" />

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <NodeLogo size="sm" />
            <h1 className="dashboard-title">Safety Incident Monitor</h1>
            <p className="dashboard-subtitle">Real-time warehouse safety monitoring</p>
          </div>
          <div className="dashboard-header-right">
            <div className="dashboard-status">
              <span className="status-dot"></span>
              <span className="status-text">Live</span>
            </div>
            <button className="nav-btn" onClick={() => navigate('/map')} title="Camera Map">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Map
            </button>
            <button className="nav-btn" onClick={() => navigate('/team')} title="Team & Roles">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Team
            </button>
            <div className="refresh-countdown" title="Auto-refresh countdown">↻ {countdown}s</div>
            <button className="export-btn" onClick={exportCSV} title="Export as CSV">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
            <button className="signout-btn" onClick={handleSignOut} title="Sign out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* ── Safety Score Panel ── */}
      <SafetyScorePanel onScoreClick={() => navigate('/safety-detail')} />

      {/* ── KPI Tiles ── */}
      <div className="stats-grid">
        {[
          { label: 'Total Incidents', value: kpis.total,            color: '#60a5fa' },
          { label: 'High Risk',       value: kpis.highRisk,         color: '#f87171' },
          { label: 'No High-Vis',     value: kpis.noHighVis,        color: '#a78bfa' },
          { label: 'Compliance Rate', value: `${kpis.compliance}%`,
            color: kpis.compliance >= 80 ? '#34d399' : kpis.compliance >= 60 ? '#fbbf24' : '#f87171' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-number" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Incident Type Chart ── */}
      <div className="type-chart-section">
        <div className="type-chart-header">
          <h3 className="type-chart-title">Incidents by Type</h3>
          <button className="type-chart-link" onClick={() => navigate('/incidents')}>
            View all clips →
          </button>
        </div>
        {[
          { key: 'no-high-vis',    label: '🦺 No High-Vis',      count: kpis.noHighVis, color: '#a78bfa' },
          { key: 'mhe',            label: '🚜 MHE Proximity',    count: kpis.mhe,       color: '#f87171' },
          { key: 'walkway',        label: '🚧 Walkway Safety',   count: kpis.walkway,   color: '#fbbf24' },
          { key: 'dock-door-open', label: '🚪 Dock Door Open',   count: kpis.dock,      color: '#fb923c' },
        ].map(({ key, label, count, color }) => (
          <div
            key={key}
            className="type-bar-row"
            onClick={() => navigate(`/incidents?type=${key}`)}
            title={`View ${label} clips`}
          >
            <div className="type-bar-meta">
              <span className="type-bar-label">{label}</span>
              <span className="type-bar-count" style={{ color }}>{count}</span>
            </div>
            <div className="type-bar-track">
              <div
                className="type-bar-fill"
                style={{ width: `${Math.round((count / typeMax) * 100)}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Shift Heatmap ── */}
      <div className="heatmap-section">
        <h2 className="heatmap-title">📊 Incident Heatmap — This Week by Shift</h2>
        <div className="heatmap-grid">
          <div className="heatmap-header-row">
            <div className="heatmap-shift-cell" />
            {DAYS.map(d => (
              <div key={d} className="heatmap-day-label">{d}</div>
            ))}
          </div>
          {heatmapRows.map(({ shift, label, emoji, counts }) => (
            <div key={shift} className="heatmap-row">
              <div className="heatmap-shift-cell heatmap-shift-label">{emoji} {label}</div>
              {counts.map((count, i) => {
                const intensity = count === 0 ? 0.06 : 0.12 + (count / heatmapMax) * 0.88;
                return (
                  <div
                    key={i}
                    className={`heatmap-cell${count > 0 ? ' heatmap-cell--clickable' : ''}`}
                    style={{ background: `rgba(239,68,68,${intensity.toFixed(2)})` }}
                    title={count > 0
                      ? `${label} · ${DAYS[i]}: ${count} incident${count !== 1 ? 's' : ''} — click to view clips`
                      : `${label} · ${DAYS[i]}: none`}
                    onClick={() => count > 0 && navigate(`/incidents?shift=${shift}&day=${DAYS[i]}`)}
                  >
                    {count > 0 && <span className="heatmap-count">{count}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">None</span>
          <div className="heatmap-legend-bar" />
          <span className="heatmap-legend-label">High</span>
        </div>
        <div className="heatmap-footer">
          <span className="heatmap-footer-hint">💡 Click any cell to view incident clips for that shift</span>
          <button className="heatmap-view-all" onClick={() => navigate('/incidents')}>
            View all clips →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentDashboard;
