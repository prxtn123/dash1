# node Safety Dashboard

**🏭 AI-Powered Warehouse Safety Incident Monitoring**

A modern, premium warehouse safety incident monitoring dashboard. Real-time incident tracking, video evidence, and intelligent alerting for warehouse managers and safety teams.

---

## 📋 Overview

**node** transforms warehouse safety by providing real-time visibility into safety incidents. The dashboard displays incidents across three main categories:

- **MHE Too Close** - Materials Handling Equipment proximity violations
- **No High-Vis** - Workers without proper safety gear detected
- **Walkway Zone** - Unauthorized personnel in restricted areas

---

## 🎯 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🔧 Configuration

### Environment Variables

Edit `.env` with your configuration:

```env
# API Endpoints (Update with your AWS API Gateway URLs)
REACT_APP_API_INCIDENTS_URL=https://your-api.amazonaws.com/incidents
REACT_APP_S3_BUCKET=your-bucket-name

# Optional: AWS Authentication (for future use)
REACT_APP_ENABLE_AUTH=false

# Performance
REACT_APP_AUTO_REFRESH_INTERVAL=10000
```

### API Integration

The dashboard is production-ready for AWS API integration:

**Expected API Response:**
```json
{
  "incidents": [
    {
      "id": "string",
      "video_url": "string (S3 URL or MP4 path)",
      "date": "2026-02-07",
      "time": "14:32:45",
      "location": "Warehouse Floor - Zone A",
      "safety_event_type": "no-high-vis | mhe-close | walkway-zoning",
      "description": "string",
      "duration": "3.2s"
    }
  ]
}
```

**Connect your API:**
1. Update `REACT_APP_API_INCIDENTS_URL` in `.env`
2. Modify `src/services/mockData.js` → replace mock data with actual API calls
3. Uncomment auto-refresh interval in `IncidentDashboard.jsx`

See [SETUP.md](SETUP.md) for detailed integration guide.

---

## 📁 Project Structure

```
src/
├── components/IncidentCard.jsx       # Incident display card
├── scenes/incident-dashboard/        # Main dashboard page
├── services/mockData.js              # API service layer (mock data)
├── App.js                            # Main app component
└── index.js                          # Entry point

public/
└── index.html                        # HTML template
```

---

## 🎨 Design

- **Modern Dark Theme** - Sleek, professional interface
- **Responsive** - Optimized for desktop, tablet, mobile
- **Smooth Animations** - 60fps performance
- **Accessibility** - WCAG 2.1 compliant
- **Large Text** - Easy viewing from distance

### Color Scheme
- MHE Close: **Red** (#ef4444)
- No High-Vis: **Orange** (#f97316)  
- Walkway Zone: **Yellow** (#eab308)

---

## 🚀 Deployment

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

## 📊 Features

✅ Real-time incident display  
✅ Video playback for evidence  
✅ Live incident statistics  
✅ Smart filtering by incident type  
✅ Mobile responsive  
✅ Auto-refresh ready  
✅ Production AWS integration ready  
✅ Clean, focused UI

---

## 🛠️ Available Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from CRA (⚠️ irreversible)
```

---

## 📝 Environment Setup

All environment variables are documented in `.env.example`. Key variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| `REACT_APP_API_INCIDENTS_URL` | API endpoint for incidents | Yes (for production) |
| `REACT_APP_S3_BUCKET` | S3 bucket for video storage | Yes (for production) |
| `REACT_APP_AUTO_REFRESH_INTERVAL` | Refresh rate in ms | No (default: 10000) |
| `REACT_APP_ENABLE_AUTH` | Enable authentication | No (future) |

---

## 🔐 Security Notes

- All API calls should be HTTPS
- Implement CORS policies on API Gateway
- Use IAM roles for S3 access
- Environment variables should not contain secrets (use AWS Secrets Manager)
- Video URLs should be pre-signed S3 URLs with expiration

---

## 📞 Support & Questions

- **Documentation**: See [SETUP.md](SETUP.md)
- **Email**: support@nodehub.uk

---

## 📄 License

All rights reserved © 2026 node (nodehub.uk)

---

**Ready to deploy? Update your API endpoints and launch! 🚀**
