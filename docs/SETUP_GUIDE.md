# SRMS Setup Guide

## Prerequisites

Before running the School Result Management System (SRMS), ensure you have the following installed:

1. **Node.js** (v16.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MySQL** (v8.0 or higher)
   - Download from: https://dev.mysql.com/downloads/
   - Verify installation: `mysql --version`

3. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com/

## Quick Start

### Windows Users

1. **Run the automated setup script:**
   ```bash
   start-servers.bat
   ```
   This script will:
   - Check for Node.js and MySQL
   - Install dependencies for both backend and frontend
   - Generate Prisma client
   - Start both servers
   - Open the application in your browser

### Manual Setup

If you prefer to set up manually or are on Linux/Mac:

#### 1. Database Setup

First, ensure MySQL is running, then set up the database:

```bash
# Login to MySQL as root
mysql -u root -p

# Run the setup script
source setup-database.sql

# Or manually create database and user:
CREATE DATABASE IF NOT EXISTS srms;
CREATE USER IF NOT EXISTS 'srms_user'@'localhost' IDENTIFIED BY 'srms_pass';
GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file if it doesn't exist
# Copy from .env.example and update as needed
# Ensure DATABASE_URL points to localhost:
# DATABASE_URL="mysql://srms_user:srms_pass@localhost:3306/srms"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (optional)
npm run seed

# Start the backend server
npm start
```

The backend will run on http://localhost:5000

#### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:3000

## Troubleshooting

### Common Issues and Solutions

#### 1. WebSocket Connection Failed

**Error:** `WebSocket connection to 'ws://localhost:3000/?token=xxx' failed`

**Solution:**
- Ensure both backend and frontend servers are running
- Check that ports 3000 and 5000 are not blocked by firewall
- Verify Vite configuration in `frontend/vite.config.js`

#### 2. API Connection Error (500 Internal Server Error)

**Error:** `POST http://localhost:5000/api/auth/login 500`

**Possible causes and solutions:**

a. **Database connection issues:**
   - Verify MySQL is running: `netstat -an | findstr 3306`
   - Check database credentials in `backend/.env`
   - Ensure database and user exist

b. **Missing environment variables:**
   - Check `backend/.env` has all required variables:
     ```
     PORT=5000
     DATABASE_URL="mysql://srms_user:srms_pass@localhost:3306/srms"
     NODE_ENV=development
     JWT_SECRET=your_secret_key_here
     ```

c. **Prisma client not generated:**
   ```bash
   cd backend
   npx prisma generate
   ```

d. **Database schema not migrated:**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

#### 3. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows - Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

#### 4. MySQL Access Denied

**Error:** `ERROR 1045 (28000): Access denied for user 'srms_user'@'localhost'`

**Solution:**
- Run the `setup-database.sql` script as MySQL root user
- Or manually create the user and grant permissions:
  ```sql
  CREATE USER 'srms_user'@'localhost' IDENTIFIED BY 'srms_pass';
  GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

#### 5. Prisma Migration Issues

**Error:** `Error: P3009: migrate found failed migrations`

**Solution:**
```bash
cd backend
# Reset the database (WARNING: This will delete all data)
npx prisma migrate reset
# Then apply migrations
npx prisma migrate deploy
```

## Development Commands

### Backend Commands

```bash
cd backend

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Check code style
npm run lint

# Format code
npm run format

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Check code style
npm run lint
```

## API Documentation

Once the backend is running, you can access:
- API Documentation: http://localhost:5000/api-docs
- Health Check: http://localhost:5000/health
- API Info: http://localhost:5000/api

## Default Credentials

After seeding the database, you can use these default credentials:

- **Admin:** admin@srms.edu.np / Admin123!
- **Teacher:** teacher@srms.edu.np / Teacher123!
- **Student:** student@srms.edu.np / Student123!

## Project Structure

```
SRMS/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── server.js     # Server entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── frontend/             # React/Vite application
│   ├── src/
│   │   ├── api/          # API client configuration
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── main.jsx      # Application entry point
│   ├── vite.config.js    # Vite configuration
│   └── package.json
└── database/             # Database migrations and seeders
    ├── migrations/
    └── seeders/
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="mysql://srms_user:srms_pass@localhost:3306/srms"

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=24h

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SRMS
VITE_APP_VERSION=1.0.0
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Support

If you encounter any issues not covered in this guide, please:
1. Check the project's issue tracker
2. Review the error logs in `backend/logs/`
3. Ensure all dependencies are up to date
4. Try clearing node_modules and reinstalling:
   ```bash
   # In both backend and frontend directories
   rm -rf node_modules package-lock.json
   npm install
   ```

## License

This project is licensed under the MIT License.