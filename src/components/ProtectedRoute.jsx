import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * Checks Cognito session on mount. While checking: shows a spinner.
 * If authenticated: renders children. If not: redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'checking') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#07090f',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 36,
            height: 36,
            border: '3px solid rgba(0, 212, 255, 0.15)',
            borderTopColor: '#00d4ff',
            borderRadius: '50%',
            animation: 'pr-spin 0.75s linear infinite',
          }} />
          <style>{`@keyframes pr-spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            Checking session…
          </span>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
