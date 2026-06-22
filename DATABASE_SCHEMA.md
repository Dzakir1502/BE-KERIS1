# KERIS Backend Database Schema

## Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  no_hp VARCHAR(15) NOT NULL,
  bio LONGTEXT,
  avatar VARCHAR(500),
  level INT DEFAULT 1,
  points INT DEFAULT 0,
  role ENUM('user', 'mentor', 'admin') DEFAULT 'user',
  isMentor BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

## Courses Table
```sql
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  fullDescription LONGTEXT,
  category VARCHAR(100) NOT NULL,
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  thumbnail VARCHAR(500),
  instructorId INT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  students INT DEFAULT 0,
  duration VARCHAR(50) DEFAULT '4 weeks',
  price INT DEFAULT 0,
  learningPoints INT DEFAULT 500,
  prerequisites JSON,
  tags JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructorId) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_level (level)
);
```

## Modules Table
```sql
CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  thumbnail VARCHAR(500),
  order INT NOT NULL,
  lessons JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id),
  INDEX idx_course_order (courseId, order)
);
```

## Projects Table
```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  fullDescription LONGTEXT,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
  category VARCHAR(100) NOT NULL,
  thumbnail VARCHAR(500),
  banner VARCHAR(500),
  reward JSON,
  participants INT DEFAULT 0,
  completions INT DEFAULT 0,
  deadline DATETIME NOT NULL,
  status ENUM('active', 'upcoming', 'closed') DEFAULT 'active',
  requirements JSON,
  resources JSON,
  tags JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_difficulty_status (difficulty, status),
  INDEX idx_category (category)
);
```

## Submissions Table
```sql
CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projectId INT NOT NULL,
  userId INT NOT NULL,
  projectLink VARCHAR(500) NOT NULL,
  demoLink VARCHAR(500) NOT NULL,
  description LONGTEXT NOT NULL,
  technologies JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  feedback LONGTEXT,
  score INT,
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewedAt DATETIME,
  reviewedBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES projects(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (reviewedBy) REFERENCES users(id),
  UNIQUE KEY unique_project_user (projectId, userId),
  INDEX idx_status (status)
);
```

## Threads Table
```sql
CREATE TABLE threads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  authorId INT NOT NULL,
  tags JSON,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  lastActivity DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_author (authorId),
  INDEX idx_created (createdAt)
);
```

## Replies Table
```sql
CREATE TABLE replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  threadId INT NOT NULL,
  authorId INT NOT NULL,
  content LONGTEXT NOT NULL,
  likes INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (threadId) REFERENCES threads(id),
  FOREIGN KEY (authorId) REFERENCES users(id),
  INDEX idx_thread (threadId),
  INDEX idx_author (authorId)
);
```

## Mentors Table
```sql
CREATE TABLE mentors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT UNIQUE NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  bio LONGTEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  hourlyRate INT NOT NULL,
  students INT DEFAULT 0,
  portfolio JSON,
  reviews JSON,
  availability JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_specialty (specialty)
);
```

## Enrollments Table
```sql
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  mentorId INT NOT NULL,
  trackName VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  endDate DATETIME NOT NULL,
  progress INT DEFAULT 0,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (mentorId) REFERENCES mentors(id),
  INDEX idx_user_mentor (userId, mentorId)
);
```

## Course Enrollments Table
```sql
CREATE TABLE course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  courseId INT NOT NULL,
  enrolledDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  progress INT DEFAULT 0,
  completedLessons JSON,
  completedModules JSON,
  status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (courseId) REFERENCES courses(id),
  UNIQUE KEY unique_user_course (userId, courseId)
);
```

## Setup Database

Run this SQL to create the database and tables:

```bash
# Create database
mysql -u root -p
CREATE DATABASE keris_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE keris_db;

# Copy and paste all the SQL CREATE TABLE statements above
```

Or use Sequelize migrations for better version control.
