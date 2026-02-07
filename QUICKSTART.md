# 🚀 node Safety Dashboard - Quick Start

Welcome to **node** - Your AI-Powered Warehouse Safety Monitoring System!

## ⚡ Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd /path/to/dash1
npm install
```

### 2️⃣ Start Development Server
```bash
npm start
```

The dashboard will automatically open at **http://localhost:3000**

### 3️⃣ See It Working!
- 🎯 View 6 sample safety incidents
- 🔴 Red incidents: MHE Too Close  
- 🟠 Orange incidents: No High-Vis
- 🟡 Yellow incidents: Walkway Zone
- ✨ Click cards to view videos
- 🔄 Use filters to view specific types

---

## 📋 What You're Seeing (Mock Data)

The dashboard comes preloaded with realistic sample incidents. Each incident shows:
- **Video preview** (placeholder)
- **Incident type badge** (color-coded)
- **Location** (where it happened)
- **Date & Time** (when it occurred)
- **Duration** (how long the incident lasted)

**No API connection needed yet!** Everything works with mock data.

---

## 🔌 Connect Your Real Data

When you're ready to connect your AWS API:

### Step 1: Update `.env` file
```bash
cp .env.example .env
```

Edit `.env` and add your API endpoints:
```env
REACT_APP_API_INCIDENTS_URL=https://your-api.amazonaws.com/incidents
REACT_APP_S3_BUCKET=your-bucket-name
```

### Step 2: Modify the API service
Edit `src/services/mockData.js`:
- Replace the mock data with your API calls
- Update `API_ENDPOINTS` with your URLs
- Uncomment the real API fetch code

### Step 3: Enable auto-refresh
Edit `src/scenes/incident-dashboard/IncidentDashboard.jsx`:
- Uncomment the `setInterval` code for auto-refresh
- Set your desired refresh rate

---

## 📁 Project Structure

```
dash1/
├── src/
│   ├── components/
│   │   ├── IncidentCard.jsx      ← Individual incident card
│   │   └── IncidentCard.css
│   ├── scenes/
│   │   └── incident-dashboard/
│   │       ├── IncidentDashboard.jsx   ← Main dashboard
│   │       └── IncidentDashboard.css
│   ├── services/
│   │   └── mockData.js           ← Mock data & API service
│   ├── App.js                    ← Main app component
│   └── index.js                  ← Entry point
├── public/
│   └── index.html
├── package.json
├── .env.example                  ← Copy to .env
├── README.md                     ← Full documentation
├── SETUP.md                      ← Setup guide
└── MIGRATION.md                  ← What changed
```

---

## 🎨 Design Features

✨ **Modern Dark Theme**
- Sleek gradient background
- Blue accent color (#3b82f6)
- Professional, premium look

📱 **Fully Responsive**
- Desktop: Full grid layout
- Tablet: 2-column layout  
- Mobile: Single column

⚡ **Smooth Animations**
- Hover effects
- Loading spinners
- Refresh button animation

---

## 🛠️ Available Commands

```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from create-react-app (⚠️ permanent)
```

---

## 🎯 Key Features Working Now

✅ Display incidents with videos  
✅ Filter by incident type  
✅ Color-coded badges  
✅ Statistics dashboard  
✅ Mobile responsive  
✅ Smooth animations  
✅ Full-screen video modal  
✅ Refresh button  

---

## 🔧 Customization

### Change Colors
Edit color codes in:
- `src/components/IncidentCard.jsx` → `getTypeColor()`
- `src/scenes/incident-dashboard/IncidentDashboard.css`

Current colors:
- Red: #ef4444 (MHE Close)
- Orange: #f97316 (No High-Vis)
- Yellow: #eab308 (Walkway Zone)

### Adjust Refresh Rate
In `src/scenes/incident-dashboard/IncidentDashboard.jsx`:
```javascript
const interval = setInterval(() => {
  loadIncidents();
}, 10000); // Change from 10000ms (10s)
```

### Add Your Logo
Replace in `public/index.html` and update the dashboard title

---

## 📊 Expected API Format

When you connect your API, it should return:

```json
{
  "incidents": [
    {
      "id": "incident-001",
      "video_url": "https://s3.amazonaws.com/video.mp4",
      "date": "2026-02-07",
      "time": "14:32:45",
      "location": "Warehouse Floor - Zone A",
      "safety_event_type": "no-high-vis",
      "description": "Worker without high-visibility clothing",
      "duration": "3.2s"
    }
  ]
}
```

---

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

### Docker
```bash
npm run build
docker build -t node-safety-dashboard .
docker run -p 3000:3000 node-safety-dashboard
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **README.md** | Full project overview |
| **SETUP.md** | Detailed setup & configuration |
| **MIGRATION.md** | What changed from original |
| **.env.example** | Environment variables template |

---

## ❓ Troubleshooting

**Port 3000 already in use?**
```bash
npm start -- --port 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Still having issues?**
Check the documentation files or review the console for error messages.

---

## 🎉 You're All Set!

Your node Safety Dashboard is ready to go. 

**Next Steps:**
1. ✅ Run `npm install` 
2. ✅ Run `npm start`
3. ✅ View mock incidents
4. ✅ (Optional) Connect your API when ready

---

**Happy monitoring! 🏭✨**

For full documentation, see [README.md](README.md) and [SETUP.md](SETUP.md)
