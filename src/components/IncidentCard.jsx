import React, { useState } from 'react';
import './IncidentCard.css';

const getRiskLevel = (score) => {
  if (score >= 75) return { label: 'HIGH RISK', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' };
  if (score >= 50) return { label: 'MED RISK',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' };
  return                 { label: 'LOW RISK',  color: '#10b981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)' };
};

/**
 * IncidentCard Component
 * Displays a single safety incident with video player, metadata, and type badge
 */
const IncidentCard = ({ incident, onPlayClick, isAcknowledged = false, onAcknowledge }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (onPlayClick) {
      onPlayClick(incident);
    }
  };

  const risk = incident.risk_score != null ? getRiskLevel(incident.risk_score) : null;

  return (
    <div className={`incident-card${isAcknowledged ? ' incident-card--acked' : ''}`}>
      <div className="incident-video-container">
        {risk && (
          <div className="risk-badge" style={{ color: risk.color, background: risk.bg, borderColor: risk.border }}>
            {risk.label}{incident.risk_score != null ? ` · ${incident.risk_score}` : ''}
          </div>
        )}
        {!isPlaying ? (
          <>
            <img
              src={incident.video_url}
              alt="Incident preview"
              className="incident-video-thumbnail"
            />
            <div className="incident-play-overlay" onClick={handlePlayClick}>
              <div className="incident-play-button">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <video
            src={incident.video_url}
            className="incident-video"
            controls
            autoPlay
            controlsList="nodownload"
          />
        )}
      </div>

      <div className="incident-content">
        <div className="incident-header">
          <div className="incident-datetime">
            <span className="incident-date">{incident.date}</span>
            <span className="incident-time">{incident.time}</span>
          </div>
          <span className="incident-duration">{incident.duration}</span>
        </div>

        <div className="incident-location">
          <svg className="incident-location-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
          </svg>
          {incident.location}
        </div>

        {incident.description && (
          <p className="incident-description">{incident.description}</p>
        )}

        <button
          className={`acknowledge-btn${isAcknowledged ? ' acknowledge-btn--done' : ''}`}
          onClick={() => !isAcknowledged && onAcknowledge && onAcknowledge(incident.id)}
          disabled={isAcknowledged}
        >
          {isAcknowledged ? '✓ Acknowledged' : 'Acknowledge'}
        </button>
      </div>
    </div>
  );
};

export default IncidentCard;
