import React, { useState, useEffect } from 'react';
import IncidentCard from '../../components/IncidentCard';
import { fetchIncidents, fetchIncidentStats } from '../../services/mockData';
import './IncidentDashboard.css';

/**
 * IncidentDashboard - Main page for node Safety Dashboard
 * Displays safety incidents with filtering by type
 */
const IncidentDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    noHighVis: 0,
    mheClose: 0,
    walkwayZoning: 0
  });
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    loadIncidents();
    loadStats();

    // TODO: Set up auto-refresh when API is connected
    // const interval = setInterval(() => {
    //   loadIncidents();
    // }, 10000); // Refresh every 10 seconds
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, incidents]);

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

  const loadStats = async () => {
    try {
      const data = await fetchIncidentStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const filterIncidents = () => {
    if (!selectedType) return incidents;
    return incidents.filter(incident => incident.safety_event_type === selectedType);
  };

  const displayedIncidents = filterIncidents();

  const typeFilters = [
    { id: 'all', label: 'All Incidents', count: stats.totalIncidents, color: '#6b7280' },
    { id: 'no-high-vis', label: 'No High-Vis', count: stats.noHighVis, color: '#f97316' },
    { id: 'mhe-close', label: 'MHE Too Close', count: stats.mheClose, color: '#ef4444' },
    { id: 'walkway-zoning', label: 'Walkway Zone', count: stats.walkwayZoning, color: '#eab308' }
  ];

  return (
    <div className="incident-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">Safety Incident Monitor</h1>
            <p className="dashboard-subtitle">Real-time warehouse safety monitoring powered by node</p>
          </div>
          <div className="dashboard-status">
            <span className="status-dot"></span>
            <span className="status-text">Live</span>
          </div>
        </div>
      </div>

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
        ) : displayedIncidents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No incidents recorded</p>
            <p className="empty-subtext">
              {selectedType
                ? 'Try selecting a different incident type'
                : 'Great! Your warehouse is operating safely'}
            </p>
          </div>
        ) : (
          <div className="incidents-grid">
            {displayedIncidents.map(incident => (
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
