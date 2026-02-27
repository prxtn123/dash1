import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import IncidentDashboard from "./scenes/incident-dashboard/IncidentDashboard";
import IncidentsPage from "./scenes/incidents/IncidentsPage";
import SafetyDetail from "./scenes/safety-detail/SafetyDetail";
import MapView from "./scenes/map/MapView";
import UserRoles from "./scenes/team/UserRoles";
import Login from "./scenes/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

/**
 * node Safety Dashboard - Main App Component
 * /login          — public sign-in page
 * /               — protected dashboard (numbers + graphs)
 * /incidents      — protected incident clips view
 * /safety-detail  — protected safety score deep-dive
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
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <IncidentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety-detail"
          element={
            <ProtectedRoute>
              <SafetyDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <UserRoles />
            </ProtectedRoute>
          }
        />
        {/* Catch-all → dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

