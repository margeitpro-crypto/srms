# Nepal National School Result Management System (SRMS)

A comprehensive web-based system for managing, calculating, and publishing school-level examination results across Nepal.

## Overview

This project implements a full-stack application with a React frontend and Node.js/Express backend, designed to handle user management, marks entry, automated grading, reporting, and more for schools in Nepal.

## Features

- **User Management**: Role-based access for Super Admin, District Admin, School Admin, Teachers, Students, and Parents.
- **Marks Entry & Calculation**: Input marks, auto-calculate grades, GPA/CGPA.
- **Reporting**: Generate reports, certificates, and analytics.
- **Security**: JWT authentication, encrypted data, audit logs.
- **Notifications**: SMS/Email alerts for result publication.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Docker, AWS/DigitalOcean

## Project Structure

- `frontend/`: React application
- `backend/`: Express API server
- `database/`: Migrations and seeders
- `docs/`: Documentation
- `scripts/`: Deployment and utility scripts

## Getting Started

1. Clone the repository
2. Install dependencies for frontend and backend
3. Set up environment variables
4. Run database migrations
5. Start the development servers

## Contributing

Please read the contributing guidelines before making changes.

## License

This project is licensed under the ISC License.
