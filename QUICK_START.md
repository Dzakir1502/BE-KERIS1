# 🎯 KERIS Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Setup Database (Windows + XAMPP)

```bash
# Ensure MySQL is running in XAMPP
# Then create database:
mysql -u root

CREATE DATABASE keris_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Clone & Install Backend

```bash
cd KERIS-Backend
npm install
```

### 3. Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env (Linux/macOS)
# or edit .env directly (Windows)

# Update if needed:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=           # Empty for XAMPP default
DB_NAME=keris_db
```

### 4. Start Backend Server

```bash
npm run dev
# Watch console for:
# ✅ MySQL connected successfully
# ✅ Database models synchronized
# ✅ KERIS Backend Server Started on Port: 5000
```

### 5. Test API

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "nama_lengkap": "Test User",
    "no_hp": "081234567890"
  }'
```

## 📋 Full Setup Steps

### Prerequisites
- MySQL 5.7+ (or XAMPP)
- Node.js 18+
- npm

### Step 1: MySQL Setup

**Windows with XAMPP:**
1. Download XAMPP from https://www.apachefriends.org/
2. Install and run XAMPP
3. Start Apache & MySQL services
4. Or follow detailed guide in `MYSQL_SETUP.md`

### Step 2: Backend Installation

```bash
# Navigate to backend folder
cd KERIS-Backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Or run in development with hot reload
npm run dev
```

### Step 3: Database Setup

**Option A: Auto-sync (Development)**
```
Sequelize automatically creates tables on startup
Just ensure database exists: keris_db
```

**Option B: Manual SQL**
```bash
mysql -u root -p keris_db < database_schema.sql
```

See `DATABASE_SCHEMA.md` for SQL statements.

### Step 4: Start Backend

```bash
# Development (recommended)
npm run dev

# Production
npm run build
npm start
```

### Step 5: Connect Frontend

Update frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Install API client:
```bash
cd ../KERIS
npm install axios
```

Create `src/services/api.ts` (see `INTEGRATION_GUIDE.md`)

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| `README.md` | Complete API documentation & endpoints |
| `PROJECT_STRUCTURE.md` | Folder structure & file organization |
| `DATABASE_SCHEMA.md` | Database tables & relationships |
| `MYSQL_SETUP.md` | MySQL installation & troubleshooting |
| `INTEGRATION_GUIDE.md` | Frontend integration with backend |
| `QUICK_START.md` | This file - quick reference |

## 🔧 NPM Scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled production code
npm run lint     # Run ESLint validation
```

## 🌍 API Base URL

- Development: `http://localhost:5000/api`
- Production: Update to your server URL

## 📍 Main Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Course details
- `GET /api/courses/:id/progress` - User progress

### Mentors
- `GET /api/mentors` - List mentors
- `POST /api/mentors/enroll-track` - Enroll in track

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects/:id/submit` - Submit project

### Community
- `GET /api/community/threads` - Forum threads
- `POST /api/community/threads` - Create thread
- `POST /api/community/threads/:id/replies` - Reply to thread

### Dashboard
- `GET /api/dashboard` - User dashboard overview

## 🔑 Authentication

All protected endpoints require JWT token:

```
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

Get token from login response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 🗄️ Database Tables

- `users` - User accounts
- `courses` - Course information
- `modules` - Course modules
- `projects` - Project challenges
- `submissions` - Project submissions
- `threads` - Forum discussions
- `replies` - Thread replies
- `mentors` - Mentor profiles
- `enrollments` - Mentor enrollments
- `course_enrollments` - Course enrollments

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: PROTOCOL_CONNECTION_LOST
Solution:
1. Ensure MySQL is running
2. Check DB credentials in .env
3. Create database: CREATE DATABASE keris_db;
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
Solution:
1. Kill process: npx fkill :5000
2. Or change PORT in .env
```

### TypeScript Compile Error
```
Error: src/models/index.ts not found
Solution:
rm -rf dist
npm run build
npm run dev
```

### Dependency Issues
```
npm install
npm audit fix
npm run dev
```

## 🚀 Deployment (Basic)

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-password
# ... set other variables

# Deploy
git push heroku main
```

### Deploy to VPS (Ubuntu)

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js & MySQL
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mysql-server

# Clone repository
git clone your-repo-url
cd KERIS-Backend

# Install & build
npm install
npm run build

# Run with PM2 (process manager)
npm install -g pm2
pm2 start dist/server.js --name keris-api
pm2 save
```

## 📞 Support & Resources

- **API Docs**: See `README.md`
- **Database**: See `DATABASE_SCHEMA.md`
- **MySQL**: See `MYSQL_SETUP.md`
- **Frontend Integration**: See `INTEGRATION_GUIDE.md`

## ✅ Checklist

- [ ] MySQL installed & running
- [ ] Database `keris_db` created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured
- [ ] Backend server running (`npm run dev`)
- [ ] API responding to requests
- [ ] Frontend `.env` configured
- [ ] Frontend API client created
- [ ] Ready to test!

## 🎓 Learning Path

1. **Understand the structure** → Read `PROJECT_STRUCTURE.md`
2. **Setup MySQL** → Follow `MYSQL_SETUP.md`
3. **Run backend** → `npm run dev`
4. **Test endpoints** → Use Postman or curl
5. **Integrate frontend** → Follow `INTEGRATION_GUIDE.md`
6. **Deploy** → Follow deployment section above

---

**Happy coding! 🚀**

For detailed information, refer to specific documentation files.
