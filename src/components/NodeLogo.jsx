import React from 'react';
import './NodeLogo.css';

/**
 * NodeLogo — reusable "node." wordmark
 * size: 'sm' (header default) | 'md' | 'lg'
 */
const NodeLogo = ({ size = 'sm', className = '' }) => (
  <div className={`node-logo node-logo--${size} ${className}`}>
    <span className="node-logo-wordmark">node</span>
    <span className="node-logo-dot">.</span>
  </div>
);

export default NodeLogo;
