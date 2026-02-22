import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import IncidentDashboard from "./scenes/incident-dashboard/IncidentDashboard";
import Login from "./scenes/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

/**
 * node Safety Dashboard - Main App Component
 * /login  — public sign-in page
 * /       — protected dashboard (requires Cognito session)
 */
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <IncidentDashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all → dashboard (ProtectedRoute will redirect to /login if needed) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

