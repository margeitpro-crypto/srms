# SRMS - Current Issues and Fix Guide

## Current Issues Identified

### 1. WebSocket Connection Failed
**Error Messages:**
- `WebSocket connection to 'ws://localhost:3000/?token=_1MPt599dKa8' failed`
- `[vite] failed to connect to websocket`

**Status:** This is a Vite HMR (Hot Module Replacement) issue that occurs when the dev server is not running properly.

### 2. Backend API Error
**Error Message:**
- `POST http://localhost:5000/api/auth/login 500 (Internal Server Error)`

**Root Cause:** Database connection failure - MySQL user 'srms_user' doesn't exist or has incorrect credentials.

## Quick Fix Steps

### Step 1: Setup MySQL Database
Run the automated setup script that was created:
```bash
setup-mysql.bat
```

This will:
- Create the 'srms' database
- Create the 'srms_user' with password 'srms_pass'
- Grant necessary permissions
- Optionally run migrations and seed data

**If you prefer manual setup:**
```sql
mysql -u root -p

CREATE DATABASE IF NOT EXISTS srms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'srms_user'@'localhost' IDENTIFIED BY 'srms_pass';
GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

### Step 2: Configure Backend Environment
Ensure `backend/.env` has the correct database URL:
```env
PORT=5000
DATABASE_URL="mysql://srms_user:srms_pass@localhost:3306/srms"
NODE_ENV=development
JWT_SECRET=your_secure_secret_key_here
```

### Step 3: Setup Backend Database Schema
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run seed  # Optional: adds sample data
```

### Step 4: Start Both Servers
Use the automated startup script:
```bash
start-servers.bat
```

Or manually in two separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## Verification Steps

### Test Database Connection
Run the test script that was created:
```bash
node test-db-connection.js
```

This will verify:
- MySQL connection
- Database existence
- User permissions
- Prisma connection
- Table existence

### Check Server Status
- Backend health check: http://localhost:5000/health
- Should return: `{"status":"OK","timestamp":"...","uptime":...,"environment":"development","version":"1.0.0"}`

## Default Login Credentials
After seeding the database:
- **Admin:** admin@srms.edu.np / Admin123!
- **Teacher:** teacher@srms.edu.np / Teacher123!
- **Student:** student@srms.edu.np / Student123!

## Common Troubleshooting

### Issue: MySQL Access Denied
**Solution:**
1. Ensure MySQL is running: `net start | findstr -i mysql`
2. Run setup script: `setup-mysql.bat`
3. Check credentials in `backend/.env`

### Issue: Port Already in Use
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process
taskkill /PID <PID> /F
```

### Issue: Prisma Client Error
**Solution:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # Warning: deletes all data
npx prisma migrate deploy
```

### Issue: Frontend Not Loading
**Solution:**
1. Ensure backend is running first
2. Clear browser cache
3. Check console for errors
4. Verify frontend dependencies: `cd frontend && npm install`

## Project Status Summary

✅ **Completed:**
- Backend and frontend code exists
- Dependencies installed
- Configuration files present
- Vite configuration correct
- Backend server can start

❌ **Needs Fixing:**
- Database user creation
- Database schema migration
- Initial data seeding

## Quick Start Commands Summary
```bash
# One-time setup
setup-mysql.bat

# Start everything
start-servers.bat

# Test database
node test-db-connection.js

# Manual commands if needed
cd backend && npm start       # Start backend
cd frontend && npm run dev    # Start frontend
```

## Files Created to Help Fix Issues
1. `setup-mysql.bat` - Automated MySQL database setup
2. `start-servers.bat` - Automated server startup
3. `test-db-connection.js` - Database connection tester
4. `setup-database.sql` - SQL script for manual database setup
5. `SETUP_GUIDE.md` - Comprehensive setup documentation

## Next Actions Required
1. Run `setup-mysql.bat` to create database and user
2. Run `start-servers.bat` to start both servers
3. Open http://localhost:3000 in your browser
4. Login with one of the default credentials

The application should then be fully functional!