# Server API

Backend API server for the Node Safety Dashboard application.

## Overview

This Express.js server provides REST API endpoints for managing camera surveillance data, including buildings, floors, cameras, and security events.

## Security Setup

### Database Credentials

⚠️ **IMPORTANT**: Database credentials are now stored in environment variables.

1. Create a `.env` file in the root directory (not in the server directory):
```bash
# From project root
cp .env.example .env
```

2. Edit `.env` and add your database credentials:
```env
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-secure-password
DB_PORT=3306
DB_NAME=cam_sur
```

3. **NEVER commit the `.env` file** - it's already in `.gitignore`

### Database Connection

The database connection is configured in `config/db.js` and uses environment variables:

```javascript
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});
```

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development
```bash
npm run devStart
```

### Production
```bash
npm start
```

The server will run on port 3002 by default.

## API Endpoints

### Building Management
- `GET /v1/api/building-details` - Get all buildings with coordinates
- `POST /v1/api/building` - Add a new building
- `GET /v1/api/building-count` - Get total building count

### Floor Management
- `GET /v1/api/floor-detail?buildingName=<name>` - Get floors and cameras for a building
- `POST /v1/api/addFloor` - Add a new floor and camera

### Camera Management
- `GET /v1/api/camera-detail` - Get camera count
- `GET /v1/api/camera-select` - Get all cameras
- `GET /v1/api/camera-table` - Get camera statistics by building
- `DELETE /v1/api/delete_camera/:camera_id` - Delete a camera

### Dashboard & Feeds
- `GET /v1/api/dashboard-feed` - Get dashboard video feeds
- `POST /v1/api/switch-feed` - Switch video feed
- `GET /v1/api/inactive-active-cameras` - Get active/inactive camera counts

### Events & Alerts
- `GET /v1/api/recent-alerts` - Get 10 most recent alerts
- `GET /v1/api/all-alerts` - Get all alerts

### User Management
- `GET /v1/api/user-detail?user_id=<id>` - Get user's cameras
- `POST /v1/api/user-detail` - Assign camera to user

### Billing
- `POST /v1/api/billing` - Update billing data

## Security Features

✅ **SQL Injection Prevention**: All queries use parameterized statements
✅ **No Hardcoded Credentials**: All sensitive data in environment variables
✅ **CORS Enabled**: Cross-origin requests supported

### Recommended Additional Security Measures

- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add input validation middleware
- [ ] Use HTTPS in production
- [ ] Add request logging
- [ ] Implement error handling middleware
- [ ] Use connection pooling for database
- [ ] Add API versioning strategy

## Environment Variables

Required environment variables (set in root `.env` file):

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` or RDS endpoint |
| `DB_USER` | Database username | `admin` |
| `DB_PASSWORD` | Database password | `your-secure-password` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | `cam_sur` |

## Database Schema

The application uses MySQL with the following main tables:
- `building` - Building information with coordinates
- `floor` - Floor information
- `camera` - Camera details and status
- `event` - Security events/alerts
- `dashboard_feeds` - Video feed configuration
- `user_camera_info` - User-camera assignments
- `transactions` - Billing information

## Dependencies

- **express** - Web framework
- **mysql** - MySQL database driver
- **cors** - CORS middleware

## Development Dependencies

- **nodemon** - Auto-restart server on file changes

## Troubleshooting

### Database Connection Error

If you see "Database connection failed", check:
1. `.env` file exists in project root
2. Database credentials are correct
3. Database server is running and accessible
4. Network/firewall rules allow connection

### CORS Issues

CORS is enabled for all origins in development. For production, configure specific origins:

```javascript
const corsOptions = {
  origin: 'https://your-frontend-domain.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong database passwords**
3. **Keep dependencies updated**: Run `npm audit` regularly
4. **Use HTTPS in production**
5. **Implement authentication** before deploying to production
6. **Add input validation** for all endpoints
7. **Monitor logs** for suspicious activity

## License

ISC

## Contributing

Please read SECURITY.md in the project root for security guidelines.
