import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import IncidentCard from '../../components/IncidentCard';
import SafetyScorePanel from '../../components/SafetyScorePanel';
import { fetchIncidents } from '../../services/mockData';
import './IncidentDashboard.css';

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

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await fetchIncidents();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="dashboard-title">Safety Incident Monitor</h1>
            <p className="dashboard-subtitle">Real-time warehouse safety monitoring</p>
          </div>
          <div className="dashboard-header-right">
            <div className="dashboard-status">
              <span className="status-dot"></span>
              <span className="status-text">Live</span>
            </div>
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
      <SafetyScorePanel />

      {/* Incidents Grid */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading incidents...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>⚠️ {error}</p>
            <button onClick={loadIncidents} className="retry-button">
              Retry
            </button>
          </div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No incidents recorded</p>
            <p className="empty-subtext">Great! Your warehouse is operating safely</p>
          </div>
        ) : (
          <div className="incidents-grid">
            {incidents.map(incident => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onPlayClick={setSelectedIncident}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Video Modal */}
      {selectedIncident && (
        <div className="video-modal" onClick={() => setSelectedIncident(null)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={() => setSelectedIncident(null)}
            >
              ✕
            </button>
            <img
              src={selectedIncident.video_url}
              alt="Incident video"
              className="video-modal-video"
            />
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button className="refresh-button" onClick={loadIncidents} title="Refresh incidents">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
      </button>
    </div>
  );
};

export default IncidentDashboard;
