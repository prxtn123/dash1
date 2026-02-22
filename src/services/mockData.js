/**
 * Mock Data Service for node Safety Dashboard
 * 
 * This service provides mock incident data for development and testing.
 * Replace API_ENDPOINTS with actual AWS API Gateway URLs when ready.
 * 
 * Expected API Response Structure:
 * {
 *   incidents: [
 *     {
 *       id: string,
 *       video_url: string (S3 path or full URL),
 *       date: string (ISO 8601),
 *       time: string (HH:MM:SS),
 *       location: string,
 *       safety_event_type: 'no-high-vis' | 'mhe-close' | 'walkway-zoning'
 *     }
 *   ]
 * }
 */

const API_ENDPOINTS = {
  // TODO: Add your AWS API Gateway URLs here
  // INCIDENTS_LIST: 'https://your-api-gateway-url.amazonaws.com/incidents',
  // INCIDENT_VIDEO: 'https://your-s3-bucket.s3.amazonaws.com/',
};

/**
 * Mock incidents data - Remove when real API is connected
 */
export const mockIncidents = [
  {
    id: '1',
    video_url: 'https://placehold.co/640x480/1f2937/60a5fa?text=No+High-Vis',
    date: '2026-02-07',
    time: '14:32:45',
    location: 'Warehouse Floor - Zone A',
    safety_event_type: 'no-high-vis',
    description: 'Worker without high-visibility clothing detected',
    duration: '3.2s'
  },
  {
    id: '2',
    video_url: 'https://placehold.co/640x480/1f2937/f87171?text=MHE+Too+Close',
    date: '2026-02-07',
    time: '13:15:20',
    location: 'Loading Bay - Section 2',
    safety_event_type: 'mhe-close',
    description: 'Forklift operating too close to personnel',
    duration: '5.1s'
  },
  {
    id: '3',
    video_url: 'https://placehold.co/640x480/1f2937/facc15?text=Walkway+Zone',
    date: '2026-02-07',
    time: '12:48:10',
    location: 'Main Aisle - Walkway 3',
    safety_event_type: 'walkway-zoning',
    description: 'Personnel in restricted walkway zone',
    duration: '2.8s'
  },
  {
    id: '4',
    video_url: 'https://placehold.co/640x480/1f2937/60a5fa?text=No+High-Vis',
    date: '2026-02-07',
    time: '11:22:55',
    location: 'Packing Station - Area B',
    safety_event_type: 'no-high-vis',
    description: 'Operator without safety gear in active zone',
    duration: '1.9s'
  },
  {
    id: '5',
    video_url: 'https://placehold.co/640x480/1f2937/f87171?text=MHE+Too+Close',
    date: '2026-02-07',
    time: '10:05:32',
    location: 'Racking Area - Level 2',
    safety_event_type: 'mhe-close',
    description: 'Machinery operating with personnel too close',
    duration: '4.3s'
  },
  {
    id: '6',
    video_url: 'https://placehold.co/640x480/1f2937/facc15?text=Walkway+Zone',
    date: '2026-02-06',
    time: '16:42:18',
    location: 'Emergency Exit - Corridor',
    safety_event_type: 'walkway-zoning',
    description: 'Obstruction in emergency walkway detected',
    duration: '6.5s'
  }
];

/**
 * Fetch incidents from API (when connected)
 * For now, returns mock data
 * 
 * @param {Object} filters - Optional filters { type: 'no-high-vis' | 'mhe-close' | 'walkway-zoning' }
 * @returns {Promise<Array>} Array of incident objects
 */
export const fetchIncidents = async (filters = null) => {
  try {
    // TODO: Replace with actual API call:
    // const response = await fetch(API_ENDPOINTS.INCIDENTS_LIST);
    // const data = await response.json();
    // return data.incidents;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let incidents = [...mockIncidents];

    if (filters?.type) {
      incidents = incidents.filter(incident => incident.safety_event_type === filters.type);
    }

    return incidents;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    // Fallback to mock data
    return mockIncidents;
  }
};

/**
 * Get incident details by ID
 * 
 * @param {string} id - Incident ID
 * @returns {Promise<Object>} Incident object
 */
export const fetchIncidentById = async (id) => {
  try {
    // TODO: Replace with actual API call:
    // const response = await fetch(`${API_ENDPOINTS.INCIDENTS_LIST}/${id}`);
    // return response.json();

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockIncidents.find(incident => incident.id === id) || null;
  } catch (error) {
    console.error(`Error fetching incident ${id}:`, error);
    return mockIncidents.find(incident => incident.id === id) || null;
  }
};

/**
 * Get incidents by type
 * 
 * @param {string} type - Safety event type
 * @returns {Promise<Array>} Filtered incidents
 */
export const fetchIncidentsByType = async (type) => {
  return fetchIncidents({ type });
};

/**
 * Get summary statistics
 * 
 * @returns {Promise<Object>} Statistics object
 */
export const fetchIncidentStats = async () => {
  try {
    // TODO: Replace with actual API call if needed
    const incidents = mockIncidents;
    
    return {
      totalIncidents: incidents.length,
      noHighVis: incidents.filter(i => i.safety_event_type === 'no-high-vis').length,
      mheClose: incidents.filter(i => i.safety_event_type === 'mhe-close').length,
      walkwayZoning: incidents.filter(i => i.safety_event_type === 'walkway-zoning').length
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalIncidents: 0,
      noHighVis: 0,
      mheClose: 0,
      walkwayZoning: 0
    };
  }
};

const mockDataAPI = {
  fetchIncidents,
  fetchIncidentById,
  fetchIncidentsByType,
  fetchIncidentStats,
  API_ENDPOINTS
};

export default mockDataAPI;
