# 🏗️ KERIS Backend - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                │
│            http://localhost:5173                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/CORS
                         │
┌─────────────────────────▼────────────────────────────────────┐
│         Express.js REST API (Backend)                        │
│            http://localhost:5000                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Routes Layer                                        │   │
│  │ - authRoutes       - courseRoutes                  │   │
│  │ - userRoutes       - mentorRoutes                  │   │
│  │ - projectRoutes    - communityRoutes               │   │
│  │ - dashboardRoutes                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌─────────────────────▼─────────────────────────────────┐  │
│  │ Middleware Layer                                    │  │
│  │ - authenticateToken (JWT validation)               │  │
│  │ - validationMiddleware (Input validation)           │  │
│  │ - corsMiddleware (CORS handling)                    │  │
│  │ - errorHandler (Error management)                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌─────────────────────▼─────────────────────────────────┐  │
│  │ Controllers Layer (Business Logic)                  │  │
│  │ - authController      - courseController          │  │
│  │ - userController      - mentorController          │  │
│  │ - projectController   - communityController        │  │
│  │ - dashboardController                              │  │
│  └─────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌─────────────────────▼─────────────────────────────────┐  │
│  │ Models Layer (ORM - Sequelize)                      │  │
│  │ - User        - Course       - Project              │  │
│  │ - Module      - Submission   - Thread/Reply         │  │
│  │ - Mentor      - Enrollment                          │  │
│  └─────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌─────────────────────▼─────────────────────────────────┐  │
│  │ Utils Layer                                         │  │
│  │ - JWT (token generation/verification)              │  │
│  │ - Password (hashing/comparison)                     │  │
│  │ - Response (formatting)                             │  │
│  │ - ErrorHandler (error utilities)                    │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────┬────────────────────────────────────┘
                           │
                      Database Layer
                           │
┌──────────────────────────▼────────────────────────────────────┐
│              MySQL 5.7+ (Database)                            │
│            keris_db (Database name)                           │
│                                                               │
│  Tables:                                                      │
│  - users              - projects          - mentors           │
│  - courses            - submissions        - enrollments      │
│  - modules            - threads            - course_enrollments│
│  - replies                                                    │
└───────────────────────────────────────────────────────────────┘
```

## Request/Response Flow

```
User Request
    │
    ▼
Express Router
    │ (Route matching)
    ▼
Middleware Pipeline
    │ 1. CORS
    │ 2. Body parser
    │ 3. Authentication (if needed)
    │ 4. Validation (if needed)
    ▼
Controller
    │ (Business logic)
    │ (Data processing)
    ▼
Model/Database
    │ (CRUD operations)
    │ (Data persistence)
    ▼
Response
    │ (JSON formatted)
    ▼
Client
```

## Authentication Flow

```
1. User Registration
   POST /api/auth/register
   → Validate input
   → Hash password (bcryptjs)
   → Create user in DB
   → Generate JWT token
   → Return token

2. User Login
   POST /api/auth/login
   → Find user by email
   → Compare password hash
   → Generate JWT token
   → Return token

3. Protected Request
   GET /api/users/profile
   Header: Authorization: Bearer JWT_TOKEN
   → authenticateToken middleware
   → Verify JWT signature
   → Extract user ID from token
   → Proceed to controller
   → Return user data
```

## File Organization

```
KERIS-Backend/
│
├── src/
│   ├── config/
│   │   ├── database.ts      (Sequelize setup)
│   │   └── env.ts          (Environment config)
│   │
│   ├── controllers/         (Business logic)
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── courseController.ts
│   │   ├── mentorController.ts
│   │   ├── projectController.ts
│   │   ├── communityController.ts
│   │   └── dashboardController.ts
│   │
│   ├── middleware/          (Express middleware)
│   │   ├── auth.ts         (JWT auth)
│   │   ├── validation.ts    (Input validation)
│   │   └── cors.ts         (CORS)
│   │
│   ├── models/              (Database models)
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Module.ts
│   │   ├── Project.ts
│   │   ├── Submission.ts
│   │   ├── Community.ts
│   │   ├── Mentor.ts
│   │   └── Enrollment.ts
│   │
│   ├── routes/              (API routes)
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── courseRoutes.ts
│   │   ├── mentorRoutes.ts
│   │   ├── projectRoutes.ts
│   │   ├── communityRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   └── index.ts
│   │
│   ├── utils/               (Utilities)
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── response.ts
│   │   └── errorHandler.ts
│   │
│   └── server.ts            (Main app)
│
├── dist/                    (Compiled output)
├── .env                     (Environment variables)
├── .env.example
├── package.json
├── tsconfig.json
└── Documentation
    ├── README.md                    (Full API docs)
    ├── QUICK_START.md              (Quick setup)
    ├── PROJECT_STRUCTURE.md         (Detailed structure)
    ├── DATABASE_SCHEMA.md           (Database design)
    ├── MYSQL_SETUP.md              (MySQL installation)
    ├── INTEGRATION_GUIDE.md         (Frontend integration)
    └── ARCHITECTURE.md             (This file)
```

## Technology Stack

```
Runtime:     Node.js 18+
Language:    TypeScript
Framework:   Express.js
ORM:         Sequelize
Database:    MySQL 5.7+
Auth:        JWT (JSON Web Tokens)
Hashing:     bcryptjs
Validation:  express-validator
Logging:     Morgan
API Format:  REST with JSON
```

## Key Features

### 1. Authentication & Authorization
- JWT-based token authentication
- Password hashing with bcryptjs
- Role-based access control (user, mentor, admin)
- Token expiration (7 days)

### 2. User Management
- User registration & login
- Profile management
- Password change
- User levels & points system

### 3. Course Management
- Course listing with pagination
- Module & lesson tracking
- Course progress tracking
- Learning points system

### 4. Project System
- Project challenges
- User submissions
- Submission review & scoring
- Gamified rewards & badges

### 5. Mentor System
- Mentor profiles & availability
- Track enrollments
- Mentor contact system
- Rating & review system

### 6. Community Forum
- Discussion threads
- Thread replies
- Like system
- Categorized discussions

### 7. Dashboard
- User statistics
- Recent activity
- Upcoming sessions
- Progress overview

## Database Relationships

```
User (1) ──────────────────────────── (M) CourseEnrollment
  │
  ├─ (1) ──────────────────────── (M) Enrollment
  │ (with Mentor)
  │
  ├─ (1) ──────────────────────── (M) Thread
  │ (as author)
  │
  ├─ (1) ──────────────────────── (M) Reply
  │ (as author)
  │
  ├─ (1) ──────────────────────── (M) Submission
  │ (as student)
  │
  ├─ (1) ──────────────────────── (1) Mentor
  │ (mentor profile)
  │
  └─ (1) ──────────────────────── (M) Course
    (as instructor)

Course (1) ──────────────────────── (M) Module
  │
  └─ (M) ──────────────────────── (1) CourseEnrollment

Project (1) ──────────────────────── (M) Submission
  │
  └─ (M) ──────────────────────── (1) User
    (submit solution)

Mentor (1) ──────────────────────── (M) Enrollment

Thread (1) ──────────────────────── (M) Reply
```

## API Endpoint Categories

### Auth Endpoints (3)
- Register
- Login
- Logout

### User Endpoints (3)
- Get Profile
- Update Profile
- Change Password

### Course Endpoints (5)
- Get All Courses
- Get Course Detail
- Get Module Detail
- Get Course Progress
- Mark Lesson Complete

### Mentor Endpoints (4)
- Get All Mentors
- Get Mentor Detail
- Enroll Track
- Contact Mentor

### Project Endpoints (4)
- Get All Projects
- Get Project Detail
- Submit Project
- Get Submission

### Community Endpoints (5)
- Get All Threads
- Get Thread Detail
- Create Thread
- Reply to Thread
- Like Thread

### Dashboard Endpoints (1)
- Get Dashboard Overview

**Total: 25 Endpoints**

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nama_lengkap": "John Doe"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not found",
  "error": "USER_NOT_FOUND",
  "statusCode": 404
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

## Deployment Architecture

### Development
```
Frontend (localhost:5173)
    ↓ (HTTP)
Backend (localhost:5000)
    ↓ (Database)
MySQL (localhost:3306)
```

### Production
```
CDN → Frontend (Static files)
         ↓ (API calls)
Load Balancer → Backend Servers
                    ↓ (Database)
MySQL Cluster
```

## Security Implementation

1. **Input Validation**
   - express-validator
   - Type checking with TypeScript
   - Whitelisting allowed fields

2. **Password Security**
   - bcryptjs hashing
   - 10 salt rounds
   - Never stored in plain text

3. **Token Security**
   - JWT with signature verification
   - 7-day expiration
   - Refresh token capability (ready)

4. **CORS Protection**
   - Configurable origins
   - Headers validation
   - Preflight requests

5. **Error Handling**
   - Safe error messages
   - No database error exposure
   - Consistent error format

## Performance Optimization

1. **Database Indexing**
   - Email (unique)
   - Category, level
   - userId, courseId (foreign keys)

2. **Connection Pooling**
   - Max 10 concurrent connections
   - Idle timeout after 10s
   - Automatic connection recycling

3. **Response Format**
   - JSON compression ready
   - Pagination support
   - Field selection capability

4. **Query Optimization**
   - Eager loading with includes
   - Selective field projection
   - Proper indexes

## Monitoring & Logging

```
Morgan HTTP Logger
    ↓
Log format: combined
    ↓
Console output
    ↓
Ready for integration with:
    - Winston (file logging)
    - Sentry (error tracking)
    - DataDog (monitoring)
```

## Development Workflow

```
1. Make changes to .ts files
2. Save file (trigger hot reload with tsx)
3. Check console for compilation errors
4. Test endpoint with Postman/curl
5. Check database for data persistence
6. Commit changes
```

## Next Steps

1. ✅ Understand architecture
2. ✅ Review technology stack
3. → Read QUICK_START.md for setup
4. → Follow MYSQL_SETUP.md for database
5. → Use INTEGRATION_GUIDE.md for frontend
6. → Deploy using provided guides

---

**Architecture Document v1.0**
Last Updated: 2024
