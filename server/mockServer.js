/**
 * Mock Server – No database required
 *
 * Mirrors every endpoint in server/index.js using in-memory data.
 * Run this instead of the real server when:
 *   - You need to demo without a database connection
 *   - You're developing locally and the DB is unavailable
 *   - A customer needs a self-contained demo build
 *
 * Usage:
 *   cd server
 *   node mockServer.js
 *
 * The server listens on port 3002 (same as the real server) so no
 * changes are needed in the frontend.
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// ─── Demo Video URLs ──────────────────────────────────────────────────────────
const DEMO_VIDEOS = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
const buildings = [
  { building_name: "Clark Building",       lat: 37.3382, lng: -121.8863 },
  { building_name: "Engineering Building", lat: 37.3390, lng: -121.8850 },
  { building_name: "Student Union",        lat: 37.3375, lng: -121.8840 },
  { building_name: "Campus Village",       lat: 37.3365, lng: -121.8870 },
];

const cameras = [
  { camera_id: 1, building_name: "Clark Building",       floor_num: 1, camera_name: "Camera 1A", camera_loc: "Main Entrance",    network_state: 1, feed: DEMO_VIDEOS[0], date_of_installation: "2022-01-10" },
  { camera_id: 2, building_name: "Clark Building",       floor_num: 1, camera_name: "Camera 1B", camera_loc: "Lobby",             network_state: 1, feed: DEMO_VIDEOS[1], date_of_installation: "2022-01-10" },
  { camera_id: 3, building_name: "Engineering Building", floor_num: 1, camera_name: "Camera 2A", camera_loc: "South Wing",        network_state: 1, feed: DEMO_VIDEOS[0], date_of_installation: "2022-03-15" },
  { camera_id: 4, building_name: "Engineering Building", floor_num: 2, camera_name: "Camera 2B", camera_loc: "Lab Corridor",      network_state: 0, feed: DEMO_VIDEOS[2], date_of_installation: "2022-03-15" },
  { camera_id: 5, building_name: "Student Union",        floor_num: 1, camera_name: "Camera 3A", camera_loc: "Main Hall",         network_state: 1, feed: DEMO_VIDEOS[3], date_of_installation: "2022-05-20" },
  { camera_id: 6, building_name: "Student Union",        floor_num: 2, camera_name: "Camera 3B", camera_loc: "North Entrance",    network_state: 1, feed: DEMO_VIDEOS[0], date_of_installation: "2022-05-20" },
  { camera_id: 7, building_name: "Campus Village",       floor_num: 1, camera_name: "Camera 4A", camera_loc: "Parking Level 1",  network_state: 0, feed: DEMO_VIDEOS[1], date_of_installation: "2022-07-08" },
  { camera_id: 8, building_name: "Campus Village",       floor_num: 1, camera_name: "Camera 4B", camera_loc: "West Gate",         network_state: 1, feed: DEMO_VIDEOS[2], date_of_installation: "2022-07-08" },
];

// Mutable – updated by POST /v1/api/switch-feed
let dashboardFeeds = [
  { feed_id: 1, building_name: "Clark Building",       floor_num: 1, camera_id: 1, camera_loc: "Main Entrance",   feed_url: DEMO_VIDEOS[0] },
  { feed_id: 2, building_name: "Engineering Building", floor_num: 1, camera_id: 3, camera_loc: "South Wing",       feed_url: DEMO_VIDEOS[1] },
  { feed_id: 3, building_name: "Student Union",        floor_num: 2, camera_id: 6, camera_loc: "North Entrance",   feed_url: DEMO_VIDEOS[2] },
  { feed_id: 4, building_name: "Campus Village",       floor_num: 1, camera_id: 7, camera_loc: "Parking Level 1", feed_url: DEMO_VIDEOS[3] },
];

const events = [
  { event_id: 10, camera_id: 1, building_name: "Clark Building",       event_type: "Arson",       event_date: "2026-02-20", camera_loc: "Main Entrance"    },
  { event_id:  9, camera_id: 3, building_name: "Engineering Building", event_type: "Dumping",     event_date: "2026-02-19", camera_loc: "South Wing"       },
  { event_id:  8, camera_id: 5, building_name: "Student Union",        event_type: "Arson",       event_date: "2026-02-18", camera_loc: "Main Hall"        },
  { event_id:  7, camera_id: 7, building_name: "Campus Village",       event_type: "Trespassing", event_date: "2026-02-18", camera_loc: "Parking Level 1" },
  { event_id:  6, camera_id: 2, building_name: "Clark Building",       event_type: "Vandalism",   event_date: "2026-02-17", camera_loc: "Lobby"           },
  { event_id:  5, camera_id: 4, building_name: "Engineering Building", event_type: "Dumping",     event_date: "2026-02-16", camera_loc: "Lab Corridor"    },
  { event_id:  4, camera_id: 6, building_name: "Student Union",        event_type: "Arson",       event_date: "2026-02-15", camera_loc: "North Entrance"  },
  { event_id:  3, camera_id: 8, building_name: "Campus Village",       event_type: "Trespassing", event_date: "2026-02-14", camera_loc: "West Gate"       },
  { event_id:  2, camera_id: 1, building_name: "Clark Building",       event_type: "Vandalism",   event_date: "2026-02-13", camera_loc: "Main Entrance"   },
  { event_id:  1, camera_id: 5, building_name: "Student Union",        event_type: "Dumping",     event_date: "2026-02-12", camera_loc: "Main Hall"       },
];

const userCameraInfo = [
  { user_id: 1, camera_id: 1 },
  { user_id: 1, camera_id: 2 },
  { user_id: 2, camera_id: 3 },
];

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/v1/api/building-details", (req, res) => {
  res.json(buildings.map(({ building_name, lat, lng }) => ({ building_name, lat, lng })));
});

app.get("/v1/api/floor-detail", (req, res) => {
  const { buildingName } = req.query;
  const result = cameras.filter((c) => c.building_name === buildingName);
  res.json(result);
});

app.get("/v1/api/user-detail", (req, res) => {
  const { user_id } = req.query;
  const result = userCameraInfo
    .filter((u) => String(u.user_id) === String(user_id))
    .map(({ camera_id }) => ({ camera_id }));
  res.json(result);
});

app.get("/v1/api/camera-detail", (req, res) => {
  res.json([{ "COUNT(*)": cameras.length }]);
});

app.get("/v1/api/camera-select", (req, res) => {
  res.json(cameras);
});

app.get("/v1/api/dashboard-feed", (req, res) => {
  res.json(dashboardFeeds);
});

app.get("/v1/api/building-count", (req, res) => {
  res.json([{ "COUNT(*)": buildings.length }]);
});

app.get("/v1/api/inactive-active-cameras", (req, res) => {
  const inactive = cameras.filter((c) => c.network_state === 0).length;
  const active   = cameras.filter((c) => c.network_state === 1).length;
  res.json([{ count_of_zeros: inactive, count_of_ones: active }]);
});

app.get("/v1/api/camera-table", (req, res) => {
  const grouped = {};
  cameras.forEach((c) => {
    if (!grouped[c.building_name]) {
      grouped[c.building_name] = { building_name: c.building_name, num_cameras: 0, active: 0, inactive: 0 };
    }
    grouped[c.building_name].num_cameras++;
    if (c.network_state === 1) grouped[c.building_name].active++;
    else grouped[c.building_name].inactive++;
  });
  res.json(Object.values(grouped));
});

app.get("/v1/api/recent-alerts", (req, res) => {
  res.json(
    [...events]
      .sort((a, b) => b.event_id - a.event_id)
      .slice(0, 10)
      .map(({ building_name, event_type, event_date, camera_loc }) => ({
        building_name, event_type, event_date, camera_loc,
      }))
  );
});

app.get("/v1/api/all-alerts", (req, res) => {
  res.json(
    [...events]
      .sort((a, b) => b.event_id - a.event_id)
      .map(({ building_name, event_type, event_date, camera_loc }) => ({
        building_name, event_type, event_date, camera_loc,
      }))
  );
});

// User stats – used by PieChart instead of direct AWS Cognito call
app.get("/v1/api/user-stats", (req, res) => {
  res.json([
    { id: "Admin", label: "Administrators", value: 3  },
    { id: "Staff", label: "Staff",          value: 12 },
  ]);
});

app.get("/v1/api/safety-scores", (req, res) => {
  res.json({
    today: 87,
    week: 82,
    month: 79,
    today_delta: 5,
    week_delta: 3,
    month_delta: -2,
    history: [
      { label: "Mon", score: 78 },
      { label: "Tue", score: 81 },
      { label: "Wed", score: 85 },
      { label: "Thu", score: 83 },
      { label: "Fri", score: 88 },
      { label: "Sat", score: 90 },
      { label: "Sun", score: 87 },
    ],
    uk_market_avg: 74,
    uk_percentile: 85,
    internal_avg: 81,
    site_rank: 3,
    total_sites: 12,
  });
});

// ─── POST / UPDATE routes ─────────────────────────────────────────────────────

app.post("/v1/api/switch-feed", (req, res) => {
  const { feed_id, building_name, floor_num, camera_id, camera_loc, feed_url } = req.body;
  const idx = dashboardFeeds.findIndex((f) => f.feed_id === feed_id);
  if (idx !== -1) {
    dashboardFeeds[idx] = { feed_id, building_name, floor_num, camera_id, camera_loc, feed_url };
    res.json({ message: "Video feed changed successfully" });
  } else {
    res.status(404).json({ message: "Feed not found" });
  }
});

app.post("/v1/api/user-detail", (req, res) => {
  const { user_id, camera_id } = req.body;
  userCameraInfo.push({ user_id, camera_id });
  res.json({ message: "User camera added successfully" });
});

app.post("/v1/api/building", (req, res) => {
  const { building_name, lat, lng } = req.body;
  buildings.push({ building_name, lat, lng });
  res.json({ message: "Building name added successfully" });
});

app.post("/v1/api/addFloor", (req, res) => {
  const { building_name, floor_num, camera_name, camera_loc, date_of_installation } = req.body;
  const newId = Math.max(...cameras.map((c) => c.camera_id)) + 1;
  cameras.push({
    camera_id: newId,
    building_name,
    floor_num,
    camera_name,
    camera_loc,
    network_state: 1,
    feed: DEMO_VIDEOS[0],
    date_of_installation,
  });
  res.json({ message: "Camera added successfully" });
});

app.delete("/v1/api/delete_camera/:camera_id", (req, res) => {
  const id = parseInt(req.params.camera_id, 10);
  const idx = cameras.findIndex((c) => c.camera_id === id);
  if (idx === -1) {
    res.status(404).json({ message: "camera record not found" });
  } else {
    cameras.splice(idx, 1);
    res.json({ message: "camera record deleted successfully" });
  }
});

app.post("/v1/api/billing", (req, res) => {
  res.json({ message: "Billing data updated" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🟢  Mock server running on http://localhost:${PORT}`);
  console.log(`  ℹ️   No database required – all data is in-memory.\n`);
});
