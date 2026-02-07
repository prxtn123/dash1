# 🔌 API Integration Guide

Complete guide to connecting your AWS API Gateway to the node Safety Dashboard.

## 📋 Prerequisites

- AWS Account with API Gateway configured
- API returns incidents in the expected format
- CORS enabled on your API
- S3 bucket for video storage (optional, can use full URLs)

---

## 🚀 Integration Steps

### Step 1: Set Up Environment Variables

Copy the example file and add your endpoints:

```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_INCIDENTS_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/incidents
REACT_APP_S3_BUCKET=your-bucket-name
REACT_APP_S3_REGION=us-east-1
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AUTO_REFRESH_INTERVAL=10000
REACT_APP_DEBUG_MODE=false
```

### Step 2: Update Mock Data Service

File: `src/services/mockData.js`

Replace the mock `API_ENDPOINTS`:

```javascript
const API_ENDPOINTS = {
  INCIDENTS_LIST: process.env.REACT_APP_API_INCIDENTS_URL,
  // Add other endpoints as needed
};
```

### Step 3: Implement API Calls

Replace mock data fetching with real API calls:

```javascript
/**
 * Fetch incidents from API
 */
export const fetchIncidents = async (filters = null) => {
  try {
    const url = new URL(API_ENDPOINTS.INCIDENTS_LIST);
    
    if (filters?.type) {
      url.searchParams.append('type', filters.type);
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed:
        // 'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.incidents || [];
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error; // Let component handle error
  }
};
```

### Step 4: Enable Auto-Refresh

File: `src/scenes/incident-dashboard/IncidentDashboard.jsx`

In the `useEffect` hook, uncomment the auto-refresh code:

```javascript
useEffect(() => {
  loadIncidents();
  loadStats();

  // Enable auto-refresh
  const interval = setInterval(() => {
    loadIncidents();
  }, parseInt(process.env.REACT_APP_AUTO_REFRESH_INTERVAL) || 10000);
  
  return () => clearInterval(interval);
}, []);
```

### Step 5: Add Error Handling

Handle API errors gracefully in the dashboard:

```javascript
const loadIncidents = async () => {
  setLoading(true);
  try {
    const data = await fetchIncidents();
    setIncidents(data);
    setError(null);
  } catch (err) {
    setError('Failed to load incidents. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 Expected API Response Format

Your API should return incidents in this format:

```json
{
  "incidents": [
    {
      "id": "inc-12345",
      "video_url": "https://s3.amazonaws.com/bucket/incident-001.mp4",
      "date": "2026-02-07",
      "time": "14:32:45",
      "location": "Warehouse Floor - Zone A",
      "safety_event_type": "no-high-vis",
      "description": "Worker without high-visibility clothing detected",
      "duration": "3.2s"
    },
    {
      "id": "inc-12346",
      "video_url": "https://s3.amazonaws.com/bucket/incident-002.mp4",
      "date": "2026-02-07",
      "time": "13:15:20",
      "location": "Loading Bay - Section 2",
      "safety_event_type": "mhe-close",
      "description": "Forklift operating too close to personnel",
      "duration": "5.1s"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Unique incident identifier | ✅ Yes |
| `video_url` | string | S3 URL or video path (MP4) | ✅ Yes |
| `date` | string | ISO 8601 date (YYYY-MM-DD) | ✅ Yes |
| `time` | string | Time in HH:MM:SS format | ✅ Yes |
| `location` | string | Location description | ✅ Yes |
| `safety_event_type` | string | One of: `no-high-vis`, `mhe-close`, `walkway-zoning` | ✅ Yes |
| `description` | string | Human-readable incident description | ⭕ Optional |
| `duration` | string | Incident duration (e.g., "3.2s") | ⭕ Optional |

---

## 🔐 Authentication

If your API requires authentication:

### JWT Token Authentication

```javascript
export const fetchIncidents = async (filters = null) => {
  const token = localStorage.getItem('authToken'); // Or from your auth service
  
  const response = await fetch(API_ENDPOINTS.INCIDENTS_LIST, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Handle 401 responses
  if (response.status === 401) {
    // Redirect to login or refresh token
    window.location.href = '/login';
  }
  
  return response.json();
};
```

### AWS Signature V4

For AWS Amplify API authentication:

```javascript
import { API } from 'aws-amplify';

export const fetchIncidents = async (filters = null) => {
  try {
    const data = await API.get('apiName', '/incidents');
    return data.incidents;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
```

---

## 🎯 Filtering by Type

Your API should support filtering:

```javascript
export const fetchIncidentsByType = async (type) => {
  try {
    const url = new URL(API_ENDPOINTS.INCIDENTS_LIST);
    url.searchParams.append('type', type);
    
    const response = await fetch(url);
    const data = await response.json();
    return data.incidents || [];
  } catch (error) {
    console.error('Error fetching filtered incidents:', error);
    throw error;
  }
};
```

API endpoint: `GET /incidents?type=no-high-vis`

---

## 📈 Statistics Endpoint

Optional: Create a separate endpoint for statistics:

```javascript
const API_ENDPOINTS = {
  INCIDENTS_LIST: '...incidents',
  INCIDENTS_STATS: '...incidents/stats'
};

export const fetchIncidentStats = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.INCIDENTS_STATS);
    return response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};
```

Response format:
```json
{
  "totalIncidents": 42,
  "noHighVis": 18,
  "mheClose": 15,
  "walkwayZoning": 9,
  "lastUpdate": "2026-02-07T14:32:45Z"
}
```

---

## 🛡️ CORS Configuration

Your API Gateway should have CORS enabled:

```
Access-Control-Allow-Origin: https://your-domain.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## 🧪 Testing Your API

Before integration, test your API:

```bash
# Get all incidents
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.amazonaws.com/incidents

# Filter by type
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://your-api.amazonaws.com/incidents?type=no-high-vis"

# Get statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.amazonaws.com/incidents/stats
```

---

## 🐛 Debugging

### Enable Debug Mode

In `.env`:
```env
REACT_APP_DEBUG_MODE=true
```

Then in `mockData.js`:

```javascript
if (process.env.REACT_APP_DEBUG_MODE === 'true') {
  console.log('API Request:', url);
  console.log('Response:', data);
}
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Look for API calls
4. Check response status and body

### Console Errors

Any API errors will appear in the browser console.

---

## 📦 Error Handling

Implement proper error handling:

```javascript
export const fetchIncidents = async (filters = null) => {
  try {
    const response = await fetch(url);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Validate response
    if (!data.incidents || !Array.isArray(data.incidents)) {
      throw new Error('Invalid response format');
    }
    
    return data.incidents;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};
```

---

## 🚀 Performance Optimization

### Pagination

```javascript
export const fetchIncidents = async (page = 1, limit = 20) => {
  const url = new URL(API_ENDPOINTS.INCIDENTS_LIST);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);
  
  const response = await fetch(url);
  return response.json();
};
```

### Caching

```javascript
const incidentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const fetchIncidentsWithCache = async (filters = null) => {
  const cacheKey = JSON.stringify(filters);
  const cached = incidentCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchIncidents(filters);
  incidentCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};
```

---

## ✅ Checklist

- [ ] API endpoint created and tested
- [ ] CORS enabled on API Gateway
- [ ] Response format matches expected schema
- [ ] `.env` file configured with API URLs
- [ ] `mockData.js` updated with real API calls
- [ ] Error handling implemented
- [ ] Auto-refresh enabled
- [ ] Tested with browser DevTools Network tab
- [ ] Tested error scenarios (network down, invalid auth, etc.)
- [ ] Performance acceptable (< 2s response time)

---

## 📞 Troubleshooting

### "CORS error"
- Check API Gateway CORS settings
- Verify `Access-Control-Allow-Origin` includes your domain

### "API returns 401"
- Check authentication token/credentials
- Verify permissions in AWS IAM

### "Empty incidents list"
- Verify API is returning data
- Check filters in your request
- Test API directly with curl

### "Videos not loading"
- Verify S3 URLs are accessible
- Check S3 bucket permissions
- Ensure URLs are public or pre-signed

---

## 🎉 You're Connected!

Once integrated, your dashboard will:
- ✅ Display real incidents
- ✅ Auto-refresh every 10 seconds
- ✅ Filter by incident type
- ✅ Show live statistics

**Enjoy your live warehouse safety monitoring! 🏭✨**
