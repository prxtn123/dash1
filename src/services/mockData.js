/**
 * mockData.js – legacy stub
 *
 * Real incident data comes from /v1/api/incidents via src/services/dashboardApi.js.
 * This file is kept only to avoid breaking any remaining legacy imports during
 * the transition period.  Do not add new mock data here.
 */

/** @deprecated – always empty; use fetchIncidents() from dashboardApi.js */
export const mockIncidents = [];

/** @deprecated */
export const fetchIncidents    = async () => [];
/** @deprecated */
export const fetchIncidentById = async () => null;

const mockDataAPI = { fetchIncidents, fetchIncidentById };
export default mockDataAPI;
