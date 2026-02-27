import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IncidentCard from '../../components/IncidentCard';
import NodeLogo from '../../components/NodeLogo';
import { fetchIncidents } from '../../services/dashboardApi';
import './IncidentsPage.css';

/**
 * IncidentsPage — shows all incident clips
 * URL params:  ?shift=morning&day=Mon&type=no-high-vis
 */
const IncidentsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterShift = searchParams.get('shift');   // morning | afternoon | night
  const filterDay   = searchParams.get('day');     // Mon | Tue | … (display only)
  const filterType  = searchParams.get('type');    // safety_event_type

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState(filterType || 'all');
  const [acknowledged, setAcknowledged] = useState(new Set());
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => { loadIncidents(); }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await fetchIncidents();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = (id) => setAcknowledged(prev => new Set([...prev, id]));

  const filtered = incidents.filter(inc => {
    if (filterShift && inc.shift !== filterShift) return false;
    if (activeType !== 'all' &&
        inc.group !== activeType &&
        inc.safety_event_type !== activeType) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID','Date','Time','Location','Type','Duration','Risk Score','Shift','Acknowledged'];
    const rows = filtered.map(i => [
      i.id, i.date, i.time, `"${i.location}"`, i.safety_event_type,
      i.duration, i.risk_score ?? 'N/A', i.shift ?? '', acknowledged.has(i.id) ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SHIFT_LABELS = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', night: '🌙 Night' };
  const contextParts = [
    filterShift ? SHIFT_LABELS[filterShift] : null,
    filterDay   ? filterDay                 : null,
  ].filter(Boolean);

  return (
    <div className="ip-page">
      <div className="bg-orb bg-orb--cyan"   aria-hidden="true" />
      <div className="bg-orb bg-orb--violet" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="ip-header">
        <div className="ip-header-left">
          <button className="ip-back-btn" onClick={() => navigate('/')}>
            ← Dashboard
          </button>
          <div>
            <NodeLogo size="sm" />
            <h1 className="ip-title">Incident Clips</h1>
            <p className="ip-subtitle">
              {contextParts.length ? contextParts.join(' · ') : 'All incidents'}
            </p>
          </div>
        </div>
        <div className="ip-header-right">
          <span className="ip-count">{filtered.length} clip{filtered.length !== 1 ? 's' : ''}</span>
          <button className="ip-export-btn" onClick={exportCSV}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Type Filter Tabs ── */}
      <div className="ip-filter-tabs">
        {[
          { key: 'all',     label: 'All Types'         },
          { key: 'ppe',     label: '🦺 No High-Vis'   },
          { key: 'mhe',     label: '🚜 MHE Proximity'  },
          { key: 'walkway', label: '🚧 Walkway Safety' },
          { key: 'dock',    label: '🚪 Dock Door'      },
        ].map(f => (
          <button
            key={f.key}
            className={`ip-filter-tab${activeType === f.key ? ' ip-filter-tab--active' : ''}`}
            onClick={() => setActiveType(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Clips Grid ── */}
      <div className="ip-content">
        {loading ? (
          <div className="ip-loading">
            <div className="ip-spinner" />
            <p>Loading incidents…</p>
          </div>
        ) : error ? (
          <div className="ip-error">
            <p>⚠️ {error}</p>
            <button className="ip-retry" onClick={loadIncidents}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ip-empty">
            <div className="ip-empty-icon">🔍</div>
            <p>No incidents match this filter</p>
          </div>
        ) : (
          <div className="ip-grid">
            {filtered.map(incident => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onPlayClick={setSelectedIncident}
                isAcknowledged={acknowledged.has(incident.id)}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Full-screen Clip Modal ── */}
      {selectedIncident && (
        <div className="ip-modal" onClick={() => setSelectedIncident(null)}>
          <div className="ip-modal-content" onClick={e => e.stopPropagation()}>
            <button className="ip-modal-close" onClick={() => setSelectedIncident(null)}>✕</button>
            <div className="ip-modal-meta">
              <span>{selectedIncident.date} · {selectedIncident.time}</span>
              <span>📍 {selectedIncident.location}</span>
              {selectedIncident.risk_score != null && (
                <span>Risk score: {selectedIncident.risk_score}</span>
              )}
            </div>
            <img
              src={selectedIncident.video_url}
              alt="Incident clip"
              className="ip-modal-img"
            />
            {selectedIncident.description && (
              <p className="ip-modal-desc">{selectedIncident.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentsPage;
