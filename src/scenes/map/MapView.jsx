import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NodeLogo from '../../components/NodeLogo';
import './MapView.css';

/**
 * MapView — interactive warehouse floor-plan camera map
 * Shows camera positions, status, and last-seen incidents
 */

const CAMERAS = [
  { id: 'CAM-01', name: 'Loading Bay A', x: 12,  y: 18,  status: 'active',   incidents: 3, lastEvent: 'No High-Vis',     shift: 'morning',   zone: 'Loading' },
  { id: 'CAM-02', name: 'Loading Bay B', x: 28,  y: 18,  status: 'active',   incidents: 1, lastEvent: 'MHE Too Close',    shift: 'afternoon', zone: 'Loading' },
  { id: 'CAM-03', name: 'Aisle 1',       x: 15,  y: 42,  status: 'active',   incidents: 5, lastEvent: 'Walkway Zoning',   shift: 'afternoon', zone: 'Storage' },
  { id: 'CAM-04', name: 'Aisle 2',       x: 35,  y: 42,  status: 'active',   incidents: 2, lastEvent: 'No High-Vis',     shift: 'night',     zone: 'Storage' },
  { id: 'CAM-05', name: 'Aisle 3',       x: 55,  y: 42,  status: 'inactive', incidents: 0, lastEvent: null,               shift: null,        zone: 'Storage' },
  { id: 'CAM-06', name: 'Dispatch Gate', x: 75,  y: 18,  status: 'active',   incidents: 4, lastEvent: 'MHE Too Close',    shift: 'morning',   zone: 'Dispatch' },
  { id: 'CAM-07', name: 'Break Room',    x: 85,  y: 55,  status: 'active',   incidents: 0, lastEvent: null,               shift: null,        zone: 'Amenities' },
  { id: 'CAM-08', name: 'Fire Exit N',   x: 50,  y: 8,   status: 'active',   incidents: 1, lastEvent: 'Walkway Zoning',   shift: 'night',     zone: 'Exit' },
  { id: 'CAM-09', name: 'Fire Exit S',   x: 50,  y: 82,  status: 'active',   incidents: 0, lastEvent: null,               shift: null,        zone: 'Exit' },
  { id: 'CAM-10', name: 'Office Entry',  x: 88,  y: 78,  status: 'warning',  incidents: 2, lastEvent: 'No High-Vis',     shift: 'afternoon', zone: 'Office' },
];

const ZONES = [
  { label: 'Loading',   x: 5,  y: 8,  w: 35, h: 25, color: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)' },
  { label: 'Storage',   x: 5,  y: 33, w: 65, h: 30, color: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  { label: 'Dispatch',  x: 60, y: 8,  w: 35, h: 25, color: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)' },
  { label: 'Amenities', x: 70, y: 45, w: 25, h: 22, color: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)' },
  { label: 'Office',    x: 70, y: 67, w: 25, h: 22, color: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
];

const STATUS_COLOR = { active: '#22d3ee', inactive: '#4b5563', warning: '#f59e0b' };
const STATUS_LABEL = { active: 'Active', inactive: 'Offline', warning: 'Warning' };

const MapView = () => {
  const navigate  = useNavigate();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('all');

  const visibleCameras = (cameras) => cameras.filter(c => {
    if (filter === 'all')      return true;
    if (filter === 'active')   return c.status === 'active';
    if (filter === 'inactive') return c.status === 'inactive';
    if (filter === 'warning')  return c.status === 'warning';
    if (filter === 'alerts')   return c.incidents > 0;
    return true;
  });

  const activeCams   = CAMERAS.filter(c => c.status === 'active').length;
  const warningCams  = CAMERAS.filter(c => c.status === 'warning').length;
  const offlineCams  = CAMERAS.filter(c => c.status === 'inactive').length;
  const totalAlerts  = CAMERAS.reduce((s, c) => s + c.incidents, 0);

  return (
    <div className="mv-page">
      <div className="bg-orb bg-orb--cyan"   aria-hidden="true" />
      <div className="bg-orb bg-orb--violet" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="mv-header">
        <div className="mv-header-left">
          <button className="mv-back-btn" onClick={() => navigate('/')}>← Dashboard</button>
          <div>
            <NodeLogo size="sm" />
            <h1 className="mv-title">Camera Map</h1>
            <p className="mv-subtitle">Warehouse floor-plan — live camera status</p>
          </div>
        </div>
        <div className="mv-kpis">
          <div className="mv-kpi"><span className="mv-kpi-dot" style={{background:'#22d3ee'}} />{activeCams} Active</div>
          <div className="mv-kpi"><span className="mv-kpi-dot" style={{background:'#f59e0b'}} />{warningCams} Warning</div>
          <div className="mv-kpi"><span className="mv-kpi-dot" style={{background:'#4b5563'}} />{offlineCams} Offline</div>
          <div className="mv-kpi"><span className="mv-kpi-dot" style={{background:'#f87171'}} />{totalAlerts} Alerts</div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="mv-filters">
        {[
          { key: 'all',      label: 'All Cameras' },
          { key: 'active',   label: '🟢 Active'   },
          { key: 'warning',  label: '🟡 Warning'  },
          { key: 'inactive', label: '🔴 Offline'  },
          { key: 'alerts',   label: '⚠️ Has Alerts' },
        ].map(f => (
          <button
            key={f.key}
            className={`mv-filter-tab${filter === f.key ? ' mv-filter-tab--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="mv-content">

        {/* ── Floor plan ── */}
        <div className="mv-floorplan">
          <div className="mv-floorplan-label">Warehouse Floor Plan</div>

          {/* Zone overlays */}
          {ZONES.map(z => (
            <div
              key={z.label}
              className="mv-zone"
              style={{
                left:   `${z.x}%`,  top:    `${z.y}%`,
                width:  `${z.w}%`,  height: `${z.h}%`,
                background: z.color,
                border: `1px solid ${z.border}`,
              }}
            >
              <span className="mv-zone-label">{z.label}</span>
            </div>
          ))}

          {/* Camera markers */}
          {visibleCameras(CAMERAS).map(cam => (
            <button
              key={cam.id}
              className={`mv-cam-marker${selected?.id === cam.id ? ' mv-cam-marker--selected' : ''}${cam.incidents > 0 ? ' mv-cam-marker--alert' : ''}`}
              style={{
                left:   `${cam.x}%`,
                top:    `${cam.y}%`,
                '--cam-color': STATUS_COLOR[cam.status],
              }}
              onClick={() => setSelected(selected?.id === cam.id ? null : cam)}
              title={`${cam.id} — ${cam.name} (${STATUS_LABEL[cam.status]})`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              {cam.incidents > 0 && (
                <span className="mv-cam-badge">{cam.incidents}</span>
              )}
            </button>
          ))}

          {/* Popup for selected camera */}
          {selected && (
            <div
              className="mv-popup"
              style={{
                left: `${Math.min(selected.x + 4, 70)}%`,
                top:  `${Math.min(selected.y + 4, 72)}%`,
              }}
            >
              <button className="mv-popup-close" onClick={() => setSelected(null)}>✕</button>
              <div className="mv-popup-id">{selected.id}</div>
              <div className="mv-popup-name">{selected.name}</div>
              <div className="mv-popup-status" style={{ color: STATUS_COLOR[selected.status] }}>
                ● {STATUS_LABEL[selected.status]}
              </div>
              <div className="mv-popup-zone">Zone: {selected.zone}</div>
              {selected.incidents > 0 ? (
                <>
                  <div className="mv-popup-incidents">
                    <strong>{selected.incidents}</strong> incident{selected.incidents !== 1 ? 's' : ''} this week
                  </div>
                  <div className="mv-popup-lastevent">Last: {selected.lastEvent}</div>
                  <button
                    className="mv-popup-view-btn"
                    onClick={() => navigate(`/incidents?shift=${selected.shift}`)}
                  >
                    View clips →
                  </button>
                </>
              ) : (
                <div className="mv-popup-clear">✅ No incidents</div>
              )}
            </div>
          )}
        </div>

        {/* ── Camera list sidebar ── */}
        <div className="mv-sidebar">
          <h3 className="mv-sidebar-title">Camera Directory</h3>
          <div className="mv-cam-list">
            {visibleCameras(CAMERAS).map(cam => (
              <div
                key={cam.id}
                className={`mv-cam-row${selected?.id === cam.id ? ' mv-cam-row--selected' : ''}`}
                onClick={() => setSelected(selected?.id === cam.id ? null : cam)}
              >
                <div
                  className="mv-cam-row-dot"
                  style={{ background: STATUS_COLOR[cam.status] }}
                />
                <div className="mv-cam-row-info">
                  <div className="mv-cam-row-id">{cam.id}</div>
                  <div className="mv-cam-row-name">{cam.name}</div>
                </div>
                {cam.incidents > 0 && (
                  <span className="mv-cam-row-badge">{cam.incidents}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
