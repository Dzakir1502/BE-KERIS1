# 📁 Backend Project Structure

## Folder Organization

```
KERIS-Backend/
├── src/
│   ├── config/                 # Konfigurasi aplikasi
│   │   ├── database.ts        # Sequelize instance & connection
│   │   └── env.ts             # Environment variables
│   │
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── courseController.ts
│   │   ├── mentorController.ts
│   │   ├── projectController.ts
│   │   ├── communityController.ts
│   │   └── dashboardController.ts
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts            # JWT authentication
│   │   ├── validation.ts       # Request validation
│   │   └── cors.ts            # CORS configuration
│   │
│   ├── models/                 # Database models (Sequelize)
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Module.ts
│   │   ├── Project.ts
│   │   ├── Submission.ts
│   │   ├── Community.ts       # Thread & Reply models
│   │   ├── Mentor.ts
│   │   └── Enrollment.ts
│   │
│   ├── routes/                 # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── courseRoutes.ts
│   │   ├── mentorRoutes.ts
│   │   ├── projectRoutes.ts
│   │   ├── communityRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   └── index.ts           # Main router
│   │
│   ├── utils/                  # Utility functions
│   │   ├── jwt.ts             # JWT token generation/verification
│   │   ├── password.ts        # Password hashing/comparison
│   │   ├── response.ts        # API response formatters
│   │   └── errorHandler.ts    # Error handling utilities
│   │
│   └── server.ts              # Main application entry point
│
├── dist/                       # Compiled JavaScript output
├── .env                        # Environment variables (create from .env.example)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies & scripts
├── README.md                  # Project documentation
├── DATABASE_SCHEMA.md         # Database schema documentation
├── INTEGRATION_GUIDE.md       # Frontend integration guide
└── MYSQL_SETUP.md            # MySQL setup instructions
```

## File Purposes

### Config (`src/config/`)

| File | Purpose |
|------|---------|
| `database.ts` | Sequelize initialization & MySQL connection |
| `env.ts` | Load & export environment variables |

### Controllers (`src/controllers/`)

| File | Purpose | Methods |
|------|---------|---------|
| `authController.ts` | Handle authentication | register, login, logout |
| `userController.ts` | User profile management | getProfile, updateProfile, changePassword |
| `courseController.ts` | Course management | getAllCourses, getCourseDetail, getCourseProgress |
| `mentorController.ts` | Mentor operations | getAllMentors, getMentorDetail, enrollTrack |
| `projectController.ts` | Project submissions | getAllProjects, submitProject, getUserSubmission |
| `communityController.ts` | Forum discussions | getAllThreads, createThread, replyToThread |
| `dashboardController.ts` | Dashboard data | getDashboard |

### Middleware (`src/middleware/`)

| File | Purpose |
|------|---------|
| `auth.ts` | JWT authentication & authorization |
| `validation.ts` | Express validator error handling |
| `cors.ts` | Cross-Origin Resource Sharing setup |

### Models (`src/models/`)

| File | Database Table | Purpose |
|------|---|---------|
| `User.ts` | users | User accounts & profiles |
| `Course.ts` | courses | Course information |
| `Module.ts` | modules | Course modules & lessons |
| `Project.ts` | projects | Project challenges |
| `Submission.ts` | submissions | Project submissions |
| `Community.ts` | threads, replies | Forum discussions |
| `Mentor.ts` | mentors | Mentor profiles |
| `Enrollment.ts` | enrollments, course_enrollments | Course & mentor enrollments |

### Routes (`src/routes/`)

| File | Base Path | Routes |
|------|-----------|--------|
| `authRoutes.ts` | `/api/auth` | register, login, logout |
| `userRoutes.ts` | `/api/users` | profile management |
| `courseRoutes.ts` | `/api/courses` | course listings & progress |
| `mentorRoutes.ts` | `/api/mentors` | mentor listings & enrollment |
| `projectRoutes.ts` | `/api/projects` | projects & submissions |
| `communityRoutes.ts` | `/api/community` | forum threads & replies |
| `dashboardRoutes.ts` | `/api/dashboard` | dashboard overview |
| `index.ts` | `/api` | Combines all routes |

### Utils (`src/utils/`)

| File | Functions |
|------|-----------|
| `jwt.ts` | generateToken, verifyToken, decodeToken |
| `password.ts` | hashPassword, comparePassword |
| `response.ts` | sendSuccess, sendError |
| `errorHandler.ts` | AppError class, errorHandler, asyncHandler |

## Data Flow Diagram

```
Request → Router → Middleware → Controller → Model → Database
                   ↓
              Validation
              
                   ↓
Response ← Formatter ← Controller ← Database
```

## Model Relationships

```
User (1) ─→ (M) Course
User (1) ─→ (M) Mentor
User (1) ─→ (M) Enrollment
User (1) ─→ (M) CourseEnrollment
User (1) ─→ (M) Thread
User (1) ─→ (M) Reply
User (1) ─→ (M) Submission

Course (1) ─→ (M) Module
Course (1) ─→ (M) CourseEnrollment
Course (1) ─→ (M) Project (tidak direct, tapi related)

Project (1) ─→ (M) Submission
Mentor (1) ─→ (M) Enrollment

Thread (1) ─→ (M) Reply
```

## Request/Response Flow Example

### Registration Request
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "nama_lengkap": "John Doe",
  "no_hp": "081234567890"
}
  ↓
authRoutes.ts (Route)
  ↓
validationMiddleware (Validate input)
  ↓
authController.register() (Business logic)
  ↓
User.create() (Database operation)
  ↓
Response: {
  "success": true,
  "data": { 
    "id": 1, 
    "email": "user@example.com", 
    "token": "jwt_token..." 
  }
}
```

### Protected Route Request
```
GET /api/courses/:courseId/progress
Headers: { Authorization: "Bearer jwt_token..." }
  ↓
courseRoutes.ts (Route)
  ↓
authenticateToken (Middleware - verify JWT)
  ↓
courseController.getCourseProgress()
  ↓
CourseEnrollment.findOne()
  ↓
Response: {
  "success": true,
  "data": { "progress": 50, "completedLessons": [...] }
}
```

## Environment Variables

```
PORT                  - Server port (default: 5000)
NODE_ENV             - Environment mode (development/production)
DB_HOST              - MySQL host
DB_PORT              - MySQL port (default: 3306)
DB_USER              - MySQL username
DB_PASSWORD          - MySQL password
DB_NAME              - Database name
JWT_SECRET           - Secret key for JWT signing
JWT_EXPIRY           - Token expiration time (default: 7d)
CORS_ORIGIN          - Allowed origins
MAX_FILE_SIZE        - Max upload file size
SMTP_HOST            - Email server host
SMTP_PORT            - Email server port
SMTP_USER            - Email username
SMTP_PASS            - Email password
```

## Development vs Production

### Development
```bash
npm run dev
# Uses tsx for hot reload
# Logging enabled
# Database syncing enabled
```

### Production
```bash
npm run build
npm start
# Compiled JavaScript
# No logging
# No auto sync
```

## Key Dependencies

```json
{
  "express": "Web framework",
  "sequelize": "ORM for MySQL",
  "mysql2": "MySQL driver",
  "jsonwebtoken": "JWT authentication",
  "bcryptjs": "Password hashing",
  "express-validator": "Request validation",
  "cors": "Cross-origin support",
  "morgan": "HTTP request logging",
  "dotenv": "Environment variables"
}
```

## TypeScript Configuration

- Target: ES2020
- Module: ES2020
- Strict: true
- ESModuleInterop: true
- Base URL: `.` dengan aliases untuk imports

## Security Features

1. **Password Hashing**: bcryptjs dengan 10 salt rounds
2. **JWT Tokens**: 7 day expiration
3. **CORS Protection**: Configurable origins
4. **Input Validation**: express-validator
5. **Error Handling**: Safe error messages
6. **Database Indexing**: Optimized queries

## API Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

## Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| VALIDATION_ERROR | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Permission denied |
| NOT_FOUND | 404 | Resource not found |
| USER_EXISTS | 409 | User already registered |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| INTERNAL_SERVER_ERROR | 500 | Server error |

## Best Practices

1. ✅ Always validate user input
2. ✅ Hash passwords before storing
3. ✅ Use try-catch with asyncHandler
4. ✅ Proper error messages
5. ✅ Use indexes on frequently queried columns
6. ✅ Limit response data (pagination)
7. ✅ Check user permissions
8. ✅ Log important events
9. ✅ Use environment variables
10. ✅ Keep secrets secure

## Next Steps

After understanding the structure:
1. Read README.md for API endpoints
2. Check DATABASE_SCHEMA.md for database design
3. Follow INTEGRATION_GUIDE.md to connect frontend
4. Use MYSQL_SETUP.md to setup database
