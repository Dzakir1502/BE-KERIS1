# KERIS Backend - Integration Guide

## 📌 Cara Menghubungkan Frontend dengan Backend

### 1. Install Dependencies di Frontend

```bash
cd KERIS
npm install axios
```

### 2. Buat API Client Service

Buat file `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Update .env di Frontend

Buat file `.env` di root frontend:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Contoh Implementasi di Component

#### Login Component

```typescript
import api from '@/services/api';

export const LoginPage = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.data.token);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    // Your login form JSX
  );
};
```

#### Dashboard Component

```typescript
import api from '@/services/api';
import { useEffect, useState } from 'react';

export const DashboardHomePage = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboard(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      {dashboard && (
        <>
          <h1>Welcome, {dashboard.user.name}!</h1>
          <div>Level: {dashboard.user.level}</div>
          <div>Points: {dashboard.user.points}</div>
        </>
      )}
    </div>
  );
};
```

#### Course Component

```typescript
import api from '@/services/api';
import { useEffect, useState } from 'react';

export const MicroLearningPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {courses.map((course: any) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
};
```

#### Project Submission

```typescript
const submitProject = async (projectId: string, formData: any) => {
  try {
    const response = await api.post(`/projects/${projectId}/submit`, {
      projectLink: formData.projectLink,
      demoLink: formData.demoLink,
      description: formData.description,
      technologies: formData.technologies,
    });
    
    // Success - show confirmation
    toast.success('Project submitted successfully!');
  } catch (error) {
    toast.error('Error submitting project');
  }
};
```

## 🚀 Running Both Frontend & Backend

### Terminal 1 - Backend
```bash
cd KERIS-Backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd KERIS
npm install
npm run dev
# App runs on http://localhost:5173
```

## 📚 Testing Endpoints with Postman

1. Download and open Postman
2. Create a new collection "KERIS API"
3. Add requests:

### Auth Endpoints
- POST `http://localhost:5000/api/auth/register`
- POST `http://localhost:5000/api/auth/login`
- POST `http://localhost:5000/api/auth/logout`

### User Endpoints
- GET `http://localhost:5000/api/users/profile` (Requires Token)
- PUT `http://localhost:5000/api/users/profile` (Requires Token)
- PUT `http://localhost:5000/api/users/change-password` (Requires Token)

### Course Endpoints
- GET `http://localhost:5000/api/courses`
- GET `http://localhost:5000/api/courses/:courseId`
- GET `http://localhost:5000/api/courses/:courseId/modules/:moduleId`
- GET `http://localhost:5000/api/courses/:courseId/progress` (Requires Token)
- POST `http://localhost:5000/api/courses/:courseId/lessons/:lessonId/complete` (Requires Token)

### Mentor Endpoints
- GET `http://localhost:5000/api/mentors`
- GET `http://localhost:5000/api/mentors/:mentorId`
- POST `http://localhost:5000/api/mentors/enroll-track` (Requires Token)
- POST `http://localhost:5000/api/mentors/:mentorId/contact` (Requires Token)

### Project Endpoints
- GET `http://localhost:5000/api/projects`
- GET `http://localhost:5000/api/projects/:projectId`
- POST `http://localhost:5000/api/projects/:projectId/submit` (Requires Token)
- GET `http://localhost:5000/api/projects/:projectId/submission` (Requires Token)

### Community Endpoints
- GET `http://localhost:5000/api/community/threads`
- GET `http://localhost:5000/api/community/threads/:threadId`
- POST `http://localhost:5000/api/community/threads` (Requires Token)
- POST `http://localhost:5000/api/community/threads/:threadId/replies` (Requires Token)
- POST `http://localhost:5000/api/community/threads/:threadId/like` (Requires Token)

### Dashboard Endpoint
- GET `http://localhost:5000/api/dashboard` (Requires Token)

## 🔑 Token Usage in Postman

1. First, login to get a token
2. Copy the token from response
3. In Postman, go to the request that needs authentication
4. Go to "Headers" tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## 🐛 Troubleshooting

### CORS Error
- Make sure backend is running on port 5000
- Check CORS_ORIGIN in `.env`

### Token Invalid
- Token expires after 7 days by default
- Need to login again to get new token
- Check that token is being sent correctly in header

### Database Connection Error
- Make sure MySQL is running
- Check DB credentials in `.env`
- Create database: `CREATE DATABASE keris_db;`

### Port Already in Use
- Change PORT in `.env` file
- Or kill process using the port

## 📞 Support

For issues or questions, refer to the README.md in KERIS-Backend folder.
