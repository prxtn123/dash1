# Security Policy

## ⚠️ CRITICAL SECURITY ALERT

**Database credentials were previously committed to git history!**

The following credentials were exposed in commit `ee63553` and remain in git history:
- **Database Host**: `camsurveillance.czyvcdd36lpu.us-west-2.rds.amazonaws.com`
- **Username**: `admin`
- **Password**: `cmpe281*`

### IMMEDIATE ACTION REQUIRED:

1. ✅ **Credentials removed from code** (fixed in this PR)
2. ⚠️ **MUST rotate database password immediately**
3. ⚠️ **MUST review database access logs** for unauthorized access
4. ⚠️ **Consider rotating RDS instance** if unauthorized access detected
5. ⚠️ **Credentials remain in git history** - history rewrite would break forks/clones

**Note**: While we've removed the credentials from the current code, they remain in git history. Anyone with access to the repository can still see them in older commits. The database password MUST be changed immediately.

## Security Issues Fixed

### Database Credentials
- ✅ **Fixed**: Hardcoded database credentials removed from `server/config/db.js`
- ✅ **Fixed**: Database configuration moved to environment variables
- **Action Required**: Update `.env` file with actual database credentials (DO NOT commit this file)

### Environment Variables
- ✅ **Fixed**: Added `.env` to `.gitignore` to prevent accidental commits
- ✅ **Fixed**: Updated `.env.example` with comprehensive configuration template
- **Action Required**: Copy `.env.example` to `.env` and fill in actual values

### SQL Injection Prevention
- ⚠️ **Identified**: Multiple SQL injection vulnerabilities in `server/index.js`
- **Recommendation**: Use parameterized queries for all database operations
- See "SQL Injection Vulnerabilities" section below for details

## Critical Security Measures

### 1. Environment Variables

Never commit sensitive data to the repository. Always use environment variables for:
- Database credentials
- API keys and secrets
- AWS access keys
- Third-party service credentials

**Setup Instructions:**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual credentials
# NEVER commit the .env file!
```

### 2. AWS Credentials

**Best Practice**: Use IAM roles instead of access keys whenever possible.

For local development:
- Use AWS CLI configuration (`~/.aws/credentials`)
- Use IAM roles for EC2/ECS/Lambda deployments
- Only use access keys as a last resort

If you must use access keys:
- Store them in `.env` file (never commit)
- Rotate them regularly
- Use least-privilege IAM policies
- Enable MFA for the IAM user

### 3. Database Security

**Current Implementation:**
```javascript
// server/config/db.js uses environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});
```

**Required `.env` configuration:**
```
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-secure-password
DB_PORT=3306
DB_NAME=cam_sur
```

**Additional Security Measures:**
- Use SSL/TLS for database connections
- Implement connection pooling
- Set up database firewall rules
- Use least-privilege database user permissions
- Regularly rotate database passwords

### 4. SQL Injection Vulnerabilities

**⚠️ CRITICAL ISSUES IDENTIFIED:**

The following endpoints in `server/index.js` are vulnerable to SQL injection:

#### Vulnerable Code Examples:

**Line 181-185** - User Detail POST:
```javascript
// VULNERABLE - uses string concatenation
db.query(
  "INSERT INTO user_camera_info (user_id, camera_id) VALUES (" +
    user_id + "," + camera_id + ")",
  // ...
);
```

**Line 201-207** - Building POST:
```javascript
// VULNERABLE - uses string concatenation
db.query(
  'INSERT INTO cam_sur.building (building_name,lat,lng) VALUES ("' +
    building_name + '",' + lat + "," + lng + ")",
  // ...
);
```

**Lines 229-245** - Switch Feed POST:
```javascript
// VULNERABLE - uses string concatenation
db.query(
  "UPDATE cam_sur.dashboard_feeds SET building_name=" +
    "'" + building_name + "'" +
    ",floor_num =" + floor_num +
    // ... more concatenation
  // ...
);
```

**Lines 284-288, 294-304, 316-327** - Add Floor POST:
```javascript
// VULNERABLE - multiple string concatenation queries
db.query(
  'INSERT INTO cam_sur.floor (building_name,floor_num) VALUES ("' +
    building_name + '",' + floor_num + ")",
  // ...
);
```

**Line 261** - Delete Camera:
```javascript
// VULNERABLE - uses string concatenation
db.query(
  "DELETE FROM cam_sur.camera WHERE camera_id = " + camera_id + "",
  // ...
);
```

#### Recommended Fix:

Use parameterized queries (prepared statements) for all database operations:

```javascript
// SECURE - uses parameterized query
db.query(
  "INSERT INTO user_camera_info (user_id, camera_id) VALUES (?, ?)",
  [user_id, camera_id],
  (err, result) => {
    // handle result
  }
);

// SECURE - for SELECT queries with parameters
db.query(
  "SELECT * FROM cam_sur.camera WHERE camera_id = ?",
  [camera_id],
  (err, result) => {
    // handle result
  }
);
```

**Note**: The current code at line 27 and line 50 already use parameterized queries correctly:
```javascript
// GOOD EXAMPLE - Line 27
db.query(
  "SELECT * FROM cam_sur.floor ... WHERE floor.building_name = ?",
  buildingName,
  // ...
);
```

### 5. API Security

**Current Status:**
- No authentication/authorization on API endpoints
- No rate limiting
- No input validation

**Recommendations:**
1. Implement JWT-based authentication
2. Add input validation and sanitization
3. Implement rate limiting
4. Add request logging
5. Use HTTPS only in production
6. Implement CORS properly

### 6. Frontend Security

**AWS Credentials in Frontend:**
- ⚠️ Frontend code references AWS credentials via environment variables
- `src/scenes/contacts/index.jsx` and `src/components/PieChart.jsx` use AWS SDK with credentials
- **Best Practice**: Use AWS Cognito Identity Pool with unauthenticated access or authenticated users
- Never expose AWS credentials in frontend code

**Recommended Approach:**
```javascript
// Instead of hardcoding credentials, use Cognito Identity Pool
import { Auth } from 'aws-amplify';

// Configure Amplify with Cognito Identity Pool
// Credentials are managed by AWS Cognito
```

## Setup Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all required environment variables in `.env`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit credentials to git
- [ ] Use parameterized queries for all SQL operations
- [ ] Implement proper authentication/authorization
- [ ] Use HTTPS in production
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly instead of creating a public issue.

## Security Best Practices

1. **Never commit secrets** - Use `.gitignore` and environment variables
2. **Rotate credentials regularly** - Change passwords and keys periodically
3. **Use least privilege** - Grant minimum required permissions
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Input validation** - Validate and sanitize all user input
6. **Use HTTPS** - Always use encrypted connections in production
7. **Enable logging** - Monitor for suspicious activity
8. **Regular backups** - Maintain secure backups of critical data

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
