/**
 * Dashboard API Service
 *
 * All API calls go through here. If the backend is unavailable for any
 * reason (server not running, network error, DB down) every function
 * automatically falls back to realistic mock data so the app never crashes
 * and still looks great for demos.
 *
 * To point at a different backend: set REACT_APP_API_URL in your .env
 * e.g.  REACT_APP_API_URL=https://api.yourproduction.com
 */

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

// ─── Demo / Fallback Video URLs ───────────────────────────────────────────────
// Reliable Google-hosted MP4s – swap in real RTSP/HLS streams when ready.
const DEMO_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

// ─── Mock / Fallback Data ─────────────────────────────────────────────────────
export const MOCK = {
  dashboardFeeds: [
    {
      feed_id: 1,
      building_name: "Clark Building",
      camera_loc: "Main Entrance",
      floor_num: 1,
      camera_id: 1,
      feed_url: DEMO_VIDEOS[0],
    },
    {
      feed_id: 2,
      building_name: "Engineering Building",
      camera_loc: "South Wing",
      floor_num: 1,
      camera_id: 3,
      feed_url: DEMO_VIDEOS[1],
    },
    {
      feed_id: 3,
      building_name: "Student Union",
      camera_loc: "North Entrance",
      floor_num: 2,
      camera_id: 6,
      feed_url: DEMO_VIDEOS[2],
    },
    {
      feed_id: 4,
      building_name: "Campus Village",
      camera_loc: "Parking Level 1",
      floor_num: 1,
      camera_id: 7,
      feed_url: DEMO_VIDEOS[3],
    },
  ],

  cameras: [
    { camera_id: 1, building_name: "Clark Building", floor_num: 1, camera_name: "Camera 1A", camera_loc: "Main Entrance", network_state: 1, feed: DEMO_VIDEOS[0] },
    { camera_id: 2, building_name: "Clark Building", floor_num: 1, camera_name: "Camera 1B", camera_loc: "Lobby",         network_state: 1, feed: DEMO_VIDEOS[1] },
    { camera_id: 3, building_name: "Engineering Building", floor_num: 1, camera_name: "Camera 2A", camera_loc: "South Wing",    network_state: 1, feed: DEMO_VIDEOS[0] },
    { camera_id: 4, building_name: "Engineering Building", floor_num: 2, camera_name: "Camera 2B", camera_loc: "Lab Corridor",  network_state: 0, feed: DEMO_VIDEOS[2] },
    { camera_id: 5, building_name: "Student Union",        floor_num: 1, camera_name: "Camera 3A", camera_loc: "Main Hall",     network_state: 1, feed: DEMO_VIDEOS[3] },
    { camera_id: 6, building_name: "Student Union",        floor_num: 2, camera_name: "Camera 3B", camera_loc: "North Entrance",network_state: 1, feed: DEMO_VIDEOS[0] },
    { camera_id: 7, building_name: "Campus Village",       floor_num: 1, camera_name: "Camera 4A", camera_loc: "Parking Level 1", network_state: 0, feed: DEMO_VIDEOS[1] },
    { camera_id: 8, building_name: "Campus Village",       floor_num: 1, camera_name: "Camera 4B", camera_loc: "West Gate",     network_state: 1, feed: DEMO_VIDEOS[2] },
  ],

  recentAlerts: [
    { building_name: "Clark Building",       event_type: "Arson",       event_date: "2026-02-20", camera_loc: "Main Entrance"    },
    { building_name: "Engineering Building", event_type: "Dumping",     event_date: "2026-02-19", camera_loc: "South Wing"       },
    { building_name: "Student Union",        event_type: "Arson",       event_date: "2026-02-18", camera_loc: "Main Hall"        },
    { building_name: "Campus Village",       event_type: "Trespassing", event_date: "2026-02-18", camera_loc: "Parking Level 1" },
    { building_name: "Clark Building",       event_type: "Vandalism",   event_date: "2026-02-17", camera_loc: "Lobby"           },
  ],

  cameraCount: 8,
  buildingCount: 4,

  cameraStatus: [
    { id: "Active",   label: "Active",   value: 6 },
    { id: "Inactive", label: "Inactive", value: 2 },
  ],

  userStats: [
    { id: "Admin", label: "Administrators", value: 3 },
    { id: "Staff", label: "Staff",          value: 12 },
  ],

  // No incidents yet – score starts at 100.
  // This value is only used when the server is completely unreachable.
  safetyScores: {
    today: 100, week: 100, month: 100,
    today_delta: 0, week_delta: 0, month_delta: 0,
    history: [
      { label: 'Mon', score: 100 }, { label: 'Tue', score: 100 },
      { label: 'Wed', score: 100 }, { label: 'Thu', score: 100 },
      { label: 'Fri', score: 100 }, { label: 'Sat', score: 100 },
      { label: 'Sun', score: 100 },
    ],
    uk_market_avg: 74,
    uk_percentile: 99,
    internal_avg: 100,
    site_rank: 1,
    total_sites: 1,
  },
};

// ─── Internal helpers ────────────────────────────────────────────────────────
const get  = (path)         => axios.get (`${BASE_URL}${path}`).then((r) => r.data);
const post = (path, data)   => axios.post(`${BASE_URL}${path}`, data).then((r) => r.data);

// ─── Public API Functions ─────────────────────────────────────────────────────

export const fetchDashboardFeeds = async () => {
  try {
    return await get("/v1/api/dashboard-feed");
  } catch {
    console.warn("[API] dashboard-feed unavailable – using mock data");
    return MOCK.dashboardFeeds;
  }
};

export const fetchCameraSelect = async () => {
  try {
    return await get("/v1/api/camera-select");
  } catch {
    console.warn("[API] camera-select unavailable – using mock data");
    return MOCK.cameras;
  }
};

export const fetchRecentAlerts = async () => {
  try {
    return await get("/v1/api/recent-alerts");
  } catch {
    console.warn("[API] recent-alerts unavailable – using mock data");
    return MOCK.recentAlerts;
  }
};

export const fetchCameraCount = async () => {
  try {
    const data = await get("/v1/api/camera-detail");
    return data[0]["COUNT(*)"];
  } catch {
    console.warn("[API] camera-detail unavailable – using mock data");
    return MOCK.cameraCount;
  }
};

export const fetchBuildingCount = async () => {
  try {
    const data = await get("/v1/api/building-count");
    return data[0]["COUNT(*)"];
  } catch {
    console.warn("[API] building-count unavailable – using mock data");
    return MOCK.buildingCount;
  }
};

export const fetchCameraStatus = async () => {
  try {
    const data = await get("/v1/api/inactive-active-cameras");
    return [
      { id: "Inactive", label: "Inactive", value: data[0]["count_of_zeros"] },
      { id: "Active",   label: "Active",   value: data[0]["count_of_ones"]  },
    ];
  } catch {
    console.warn("[API] inactive-active-cameras unavailable – using mock data");
    return MOCK.cameraStatus;
  }
};

export const fetchUserStats = async () => {
  // This replaces the direct AWS Cognito call in PieChart so credentials
  // never need to be bundled in the frontend build.
  try {
    return await get("/v1/api/user-stats");
  } catch {
    console.warn("[API] user-stats unavailable – using mock data");
    return MOCK.userStats;
  }
};

export const fetchSafetyScores = async () => {
  try {
    return await get("/v1/api/safety-scores");
  } catch {
    console.warn("[API] safety-scores unavailable – using mock data");
    return MOCK.safetyScores;
  }
};

/**
 * Fetch incidents for a given date (default: today).
 * @param {Object} [filters]  Optional { date: 'YYYY-MM-DD', type: string, shift: string }
 */
export const fetchIncidents = async (filters = null) => {
  try {
    const params = new URLSearchParams();
    if (filters?.date) params.set('date', filters.date);
    const query = params.toString();
    const data  = await get(`/v1/api/incidents${query ? '?' + query : ''}`);
    return applyIncidentFilters(data, filters);
  } catch {
    console.warn('[API] incidents unavailable – returning empty list');
    return [];
  }
};

function applyIncidentFilters(incidents, filters) {
  if (!filters) return incidents;
  let result = incidents;
  if (filters.type)  result = result.filter(i =>
    i.safety_event_type === filters.type || i.group === filters.type
  );
  if (filters.shift) result = result.filter(i => i.shift === filters.shift);
  return result;
}

export const switchFeed = async (payload) => {
  try {
    return await post("/v1/api/switch-feed", payload);
  } catch {
    console.warn("[API] switch-feed unavailable – returning mock success");
    return { message: "Feed updated (demo mode)" };
  }
};
