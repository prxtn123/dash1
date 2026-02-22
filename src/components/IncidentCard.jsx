import React, { useState } from 'react';
import './IncidentCard.css';

/**
 * IncidentCard Component
 * Displays a single safety incident with video player, metadata, and type badge
 */
const IncidentCard = ({ incident, onPlayClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (onPlayClick) {
      onPlayClick(incident);
    }
  };

  return (
    <div className="incident-card">
      <div className="incident-video-container">
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
      </div>
    </div>
  );
};

export default IncidentCard;
