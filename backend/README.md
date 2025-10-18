# 🗂️ Backend Structure - AI School Dashboard

This document describes the complete backend folder structure.

## 📁 Directory Structure

```
backend/
├── config/          # Configuration files
├── models/          # Sequelize models (ORM)
├── routes/          # Express route definitions
├── controllers/     # Business logic handlers
├── middleware/      # Express middleware
├── services/        # External service integrations
├── utils/           # Helper functions
├── tests/           # Test files
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── package.json     # Dependencies
```

## 📄 File Purposes

### /config
- `database.js` - Sequelize configuration for PostgreSQL
- `auth.js` - JWT secret and authentication settings
- `ai.js` - OpenAI API keys and AI service configuration

### /models
Database models matching PostgreSQL schema:
- `User.js` - Authentication model
- `Teacher.js` - Teacher profile model
- `Student.js` - Student profile model
- `Class.js` - Class/homeroom model
- `Course.js` - Course/subject model
- `Grade.js` - Student grades model
- `Attendance.js` - Attendance records model
- `index.js` - Model associations and exports

### /routes
RESTful API route definitions:
- `auth.routes.js` - Login, register, logout, refresh token
- `students.routes.js` - CRUD operations for students
- `teachers.routes.js` - CRUD operations for teachers
- `classes.routes.js` - Class management
- `courses.routes.js` - Course management
- `grades.routes.js` - Grade input and queries
- `attendance.routes.js` - Attendance marking
- `dashboard.routes.js` - Aggregated statistics
- `ai.routes.js` - AI prediction endpoints

### /controllers
Business logic separated from routes:
- `authController.js` - Authentication logic
- `studentController.js` - Student operations
- `teacherController.js` - Teacher operations
- `classController.js` - Class operations
- `courseController.js` - Course operations
- `gradeController.js` - Grade operations
- `attendanceController.js` - Attendance operations
- `dashboardController.js` - Dashboard data aggregation
- `aiController.js` - AI prediction logic

### /middleware
Express middleware functions:
- `authMiddleware.js` - JWT token verification
- `errorHandler.js` - Centralized error handling
- `validation.js` - Request validation middleware
- `rateLimiter.js` - API rate limiting
- `roleCheck.js` - Authorization by role

### /services
External service integrations:
- `aiService.js` - OpenAI API wrapper
- `mlService.js` - Machine learning predictions
- `emailService.js` - Email notifications (Nodemailer)
- `smsService.js` - SMS notifications (Twilio)

### /utils
Helper functions:
- `logger.js` - Winston logger configuration
- `validators.js` - Custom validation functions
- `helpers.js` - Common utility functions
- `constants.js` - Application constants

### /tests
Test files organized by type:
- `unit/` - Unit tests for individual functions
- `integration/` - Integration tests for APIs
- `api/` - API endpoint tests

---

## 🚀 Next Steps (Week 3-4)

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Implement database connection
4. Create Sequelize models
5. Build authentication system
6. Develop API endpoints
7. Add validation and error handling
8. Write unit tests

---

**Status**: ⏳ Ready for Week 3-4 Development  
**Created**: Week 1-2  
**Last Updated**: December 2024
