# API Reference

This document outlines the REST API endpoints for the SRMS backend.

## Authentication

### POST /api/auth/login
Login user and return JWT token.

### POST /api/auth/register
Register a new user.

## Users

### GET /api/users
Get all users (admin only).

### POST /api/users
Create a new user.

## Marks

### GET /api/marks
Get marks for a subject/exam.

### POST /api/marks
Enter marks for students.

## Reports

### GET /api/reports/summary
Get report summary.

### GET /api/reports/analytics
Get analytics data.

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes.

## Authentication

Include JWT token in Authorization header: `Bearer <token>`
