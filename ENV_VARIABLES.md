# 🌍 Environment Variables Reference

Complete guide to all environment variables used in the node Safety Dashboard.

## 📋 Overview

All environment variables should be defined in `.env` file at the root of the project.

### Copy Template

```bash
cp .env.example .env
```

Then edit `.env` with your values.

---

## 🔑 API Configuration

### `REACT_APP_API_INCIDENTS_URL`
**Type:** `URL`  
**Required:** Yes (for production)  
**Description:** AWS API Gateway endpoint that returns incidents list

**Example:**
```env
REACT_APP_API_INCIDENTS_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/incidents
```

**Response Format:**
```json
{
  "incidents": [
    {
      "id": "string",
      "video_url": "string",
      "date": "2026-02-07",
      "time": "14:32:45",
      "location": "string",
      "safety_event_type": "no-high-vis | mhe-close | walkway-zoning",
      "description": "string",
      "duration": "string"
    }
  ]
}
```

---

### `REACT_APP_API_REGIONS_URL` (Optional)
**Type:** `URL`  
**Required:** No  
**Description:** Endpoint to fetch available warehouse regions/locations

**Example:**
```env
REACT_APP_API_REGIONS_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/regions
```

---

## 💾 AWS Configuration

### `REACT_APP_S3_BUCKET`
**Type:** `String`  
**Required:** Yes (for video storage)  
**Description:** S3 bucket name where incident videos are stored

**Example:**
```env
REACT_APP_S3_BUCKET=node-safety-videos-prod
```

---

### `REACT_APP_S3_REGION`
**Type:** `String` (AWS Region)  
**Required:** No  
**Default:** `us-east-1`  
**Description:** AWS region where S3 bucket is located

**Supported Regions:**
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)
- [Full list](https://docs.aws.amazon.com/general/latest/gr/s3.html)

**Example:**
```env
REACT_APP_S3_REGION=eu-west-1
```

---

### `REACT_APP_AWS_REGION`
**Type:** `String` (AWS Region)  
**Required:** No  
**Default:** `us-east-1`  
**Description:** Default AWS region for Amplify and other services

**Example:**
```env
REACT_APP_AWS_REGION=us-east-1
```

---

## 🔐 Authentication (Future Use)

### `REACT_APP_USER_POOL_ID`
**Type:** `String`  
**Required:** No (for future authentication)  
**Description:** AWS Cognito User Pool ID

**Format:** `region_alphanumeric` (e.g., `us-east-1_abcd1234X`)

**Example:**
```env
REACT_APP_USER_POOL_ID=us-east-1_aBcDeF1234
```

---

### `REACT_APP_USER_POOL_WEB_CLIENT_ID`
**Type:** `String`  
**Required:** No (for future authentication)  
**Description:** AWS Cognito Web Client ID

**Format:** Alphanumeric string (40+ characters)

**Example:**
```env
REACT_APP_USER_POOL_WEB_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s
```

---

### `REACT_APP_ENABLE_AUTH`
**Type:** `Boolean` (`true` or `false`)  
**Required:** No  
**Default:** `false`  
**Description:** Enable/disable authentication requirements

**Example:**
```env
REACT_APP_ENABLE_AUTH=false
```

---

## ⚙️ Performance & Behavior

### `REACT_APP_AUTO_REFRESH_INTERVAL`
**Type:** `Number` (milliseconds)  
**Required:** No  
**Default:** `10000` (10 seconds)  
**Description:** How often the dashboard auto-refreshes incidents

**Recommended Values:**
- `5000` - Every 5 seconds (high refresh)
- `10000` - Every 10 seconds (balanced)
- `30000` - Every 30 seconds (low refresh)
- `60000` - Every 60 seconds (minimal)

**Example:**
```env
REACT_APP_AUTO_REFRESH_INTERVAL=10000
```

---

### `REACT_APP_DEBUG_MODE`
**Type:** `Boolean` (`true` or `false`)  
**Required:** No  
**Default:** `false`  
**Description:** Enable debug logging to console

**Example:**
```env
REACT_APP_DEBUG_MODE=true
```

When enabled, logs:
- API requests and responses
- Component lifecycle events
- State changes
- Error details

---

## 📦 Build & Deployment

### `REACT_APP_VERSION`
**Type:** `String`  
**Required:** No  
**Description:** Application version for tracking

**Example:**
```env
REACT_APP_VERSION=0.1.0
```

---

### `REACT_APP_ENVIRONMENT`
**Type:** `String`  
**Options:** `development`, `staging`, `production`  
**Required:** No  
**Default:** `development`  
**Description:** Current environment

**Example:**
```env
REACT_APP_ENVIRONMENT=production
```

---

## 📝 Complete `.env` Example

```env
# API Configuration
REACT_APP_API_INCIDENTS_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/incidents
REACT_APP_API_REGIONS_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/regions

# AWS Configuration
REACT_APP_S3_BUCKET=node-safety-videos-prod
REACT_APP_S3_REGION=us-east-1
REACT_APP_AWS_REGION=us-east-1

# Authentication (for future use)
REACT_APP_USER_POOL_ID=us-east-1_aBcDeF1234
REACT_APP_USER_POOL_WEB_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s
REACT_APP_ENABLE_AUTH=false

# Performance
REACT_APP_AUTO_REFRESH_INTERVAL=10000
REACT_APP_DEBUG_MODE=false

# Build Info
REACT_APP_VERSION=0.1.0
REACT_APP_ENVIRONMENT=development
```

---

## 🔒 Security Notes

### ⚠️ Never Commit `.env` to Git

The `.env` file should **NEVER** be committed to version control. It's already in `.gitignore`.

### 🔐 Use `.env.local` for Secrets

For sensitive data:
```env
# .env.local (not committed)
REACT_APP_SECRET_KEY=your-secret
REACT_APP_API_KEY=your-api-key
```

### 🛡️ Protect Credentials

- Don't put AWS credentials directly in `.env`
- Use IAM roles for API access
- Use AWS Secrets Manager for sensitive data
- Rotate credentials regularly

### 🌐 Deployment

For AWS Amplify/production:
1. Set environment variables in AWS Console
2. Use AWS Systems Manager Parameter Store
3. Use AWS Secrets Manager
4. Never expose secrets in build process

---

## ✅ Validation Checklist

Before starting the app:

- [ ] `.env` file exists at project root
- [ ] All required variables are set
- [ ] API endpoints are correct and accessible
- [ ] AWS region is valid
- [ ] No credentials in `.env` (use IAM roles)
- [ ] `.env` is in `.gitignore` (don't commit!)
- [ ] All URLs use HTTPS in production

---

## 🧪 Testing Variables

For local development with mock data:

```env
# Mock data will work without these:
REACT_APP_API_INCIDENTS_URL=http://localhost:3001/api/incidents
REACT_APP_AUTO_REFRESH_INTERVAL=10000
REACT_APP_DEBUG_MODE=true
REACT_APP_ENVIRONMENT=development
```

The app will automatically fall back to mock data if API calls fail.

---

## 🚀 Environment Profiles

### Development
```env
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG_MODE=true
REACT_APP_API_INCIDENTS_URL=http://localhost:3001/api/incidents
```

### Staging
```env
REACT_APP_ENVIRONMENT=staging
REACT_APP_DEBUG_MODE=true
REACT_APP_API_INCIDENTS_URL=https://staging-api.amazonaws.com/incidents
REACT_APP_AUTO_REFRESH_INTERVAL=15000
```

### Production
```env
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG_MODE=false
REACT_APP_API_INCIDENTS_URL=https://api.amazonaws.com/incidents
REACT_APP_AUTO_REFRESH_INTERVAL=10000
```

---

## 📚 References

- [Create React App Docs](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [AWS Regions](https://docs.aws.amazon.com/general/latest/gr/aws-region-service-list.html)
- [AWS Amplify Docs](https://docs.amplify.aws/)

---

## 💡 Tips

1. **Copy `.env.example`** before making changes
2. **Use `REACT_APP_` prefix** for frontend env vars (required by CRA)
3. **Restart dev server** after changing `.env`
4. **Check `npm start` output** for variable errors
5. **Use `process.env.REACT_APP_*`** to access variables in code

---

## 🎉 Ready to Go!

Your environment is configured and ready for:
- ✅ Development with mock data
- ✅ Testing with API endpoints
- ✅ Production deployment

**Questions? See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed setup.**
