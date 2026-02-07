import React from "react";
import { Route, Routes } from "react-router-dom";
import IncidentDashboard from "./scenes/incident-dashboard/IncidentDashboard";
import "./App.css";

/**
 * node Safety Dashboard - Main App Component
 * 
 * Simplified routing focused on incident monitoring
 * Authentication to be added later
 */
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<IncidentDashboard />} />
        {/* Add additional routes here as needed */}
      </Routes>
    </div>
  );
}

export default App;

