# 🗄️ MySQL Setup Guide for KERIS Backend

## Prerequisites

- MySQL 5.7 atau lebih tinggi
- Node.js 18+
- npm atau yarn

## Installation & Setup

### Option 1: Windows

#### 1. Install MySQL

**Menggunakan MySQL Installer:**
1. Download MySQL Installer dari https://dev.mysql.com/downloads/windows/installer/
2. Jalankan installer dan pilih "Developer Default"
3. Ikuti setup wizard
4. Catat username (biasanya `root`) dan password

**Menggunakan XAMPP (Lebih mudah):**
1. Download XAMPP dari https://www.apachefriends.org/
2. Install dan jalankan XAMPP
3. Klik "Start" untuk Apache dan MySQL
4. Default: username=`root`, password=``(kosong)

#### 2. Verify MySQL Installation

```bash
# Buka Command Prompt atau PowerShell
mysql --version

# Test connection (ganti password dengan password Anda, kosong jika tidak ada)
mysql -u root -p
# Enter password ketika diminta

# Di MySQL prompt, ketik:
SHOW DATABASES;
EXIT;
```

### Option 2: macOS

```bash
# Install menggunakan Homebrew
brew install mysql

# Start MySQL
brew services start mysql

# Setup MySQL user dan password
mysql_secure_installation
```

### Option 3: Linux (Ubuntu/Debian)

```bash
# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Start MySQL
sudo systemctl start mysql

# Secure installation
sudo mysql_secure_installation
```

## Create Database

### Method 1: Command Line

```bash
# Login ke MySQL
mysql -u root -p

# Di MySQL prompt, jalankan:
CREATE DATABASE keris_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify
SHOW DATABASES;

# Exit
EXIT;
```

### Method 2: GUI (MySQL Workbench)

1. Download MySQL Workbench dari https://www.mysql.com/products/workbench/
2. Open MySQL Workbench
3. Connect ke local MySQL
4. Buat schema baru:
   - Klik kanan di Schemas panel
   - Create Schema
   - Nama: `keris_db`
   - Charset: `utf8mb4`
   - Collation: `utf8mb4_unicode_ci`
   - Klik Apply

### Method 3: phpMyAdmin

Jika menggunakan XAMPP:
1. Buka http://localhost/phpmyadmin
2. Klik "New" di sidebar
3. Database name: `keris_db`
4. Charset: `utf8mb4_unicode_ci`
5. Create

## Configure Backend

### 1. Update .env

Edit file `KERIS-Backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=              # Kosong jika tidak ada password
DB_NAME=keris_db

# Untuk XAMPP gunakan ini:
# DB_PASSWORD=            # Kosong
```

### 2. Install Dependencies

```bash
cd KERIS-Backend
npm install
```

### 3. Test Database Connection

```bash
# Start development server
npm run dev

# Check console untuk pesan:
# ✅ MySQL connected successfully
# ✅ Database models synchronized
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Login tanpa password
mysql -u root

# Atau dengan password
mysql -u root -p
```

Jika masih error, reset password:

**Windows (XAMPP):**
```bash
# Buka command prompt di folder XAMPP
cd C:\xampp\mysql\bin
mysql -u root
# Langsung masuk tanpa password
```

**macOS/Linux:**
```bash
# Stop MySQL
sudo systemctl stop mysql

# Restart tanpa validasi password
sudo mysqld_safe --skip-grant-tables &

# Login
mysql -u root

# Di MySQL prompt:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
EXIT;

# Restart MySQL normally
sudo systemctl start mysql
```

### Error: "Database 'keris_db' doesn't exist"

```bash
# Login ke MySQL
mysql -u root -p

# Create database
CREATE DATABASE keris_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify
SHOW DATABASES;
EXIT;
```

### Error: "Port 3306 already in use"

```bash
# Find process using port 3306 (Windows)
netstat -ano | findstr :3306

# Kill process
taskkill /PID <PID> /F

# Or change port in .env
DB_PORT=3307
```

### Error: "Can't connect to MySQL server"

1. Check MySQL is running:
   - **Windows:** Services > MySQL80 should be "Running"
   - **macOS:** `brew services list`
   - **Linux:** `sudo systemctl status mysql`

2. Start MySQL if not running:
   ```bash
   # Windows (Admin Command Prompt)
   net start MySQL80
   
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

## Database Seeding (Optional)

Untuk test dengan data sample:

```bash
# Login ke MySQL
mysql -u root -p keris_db

# Copy dan paste SQL dari DATABASE_SCHEMA.md untuk create tables

# Insert sample data
INSERT INTO users (email, password, nama_lengkap, no_hp, bio, level, points, role)
VALUES ('user@example.com', 'hashed_password', 'John Doe', '081234567890', 'Student', 1, 0, 'user');

INSERT INTO courses (title, description, category, level, instructorId, rating, duration, price)
VALUES ('React Fundamentals', 'Learn React basics', 'Web Development', 'beginner', 1, 4.5, '4 weeks', 49999);
```

## Useful MySQL Commands

```bash
# Login
mysql -u root -p

# Show all databases
SHOW DATABASES;

# Use specific database
USE keris_db;

# Show tables
SHOW TABLES;

# Show table structure
DESCRIBE users;

# Count records
SELECT COUNT(*) FROM users;

# Backup database
mysqldump -u root -p keris_db > backup.sql

# Restore database
mysql -u root -p keris_db < backup.sql
```

## Performance Tips

### 1. Create Indexes (already in models)

Indexes yang sudah dibuat:
- `users`: email (unique)
- `courses`: category, level, instructorId
- `modules`: courseId, order
- `projects`: difficulty, status, category
- `submissions`: projectId, userId (unique), status
- `threads`: category, authorId, createdAt
- `replies`: threadId, authorId

### 2. Enable Query Caching

Edit MySQL config file:

**Windows (XAMPP):**
```bash
C:\xampp\mysql\bin\my.ini

# Add atau uncomment:
query_cache_size=64M
query_cache_type=1
```

**macOS/Linux:**
```bash
/etc/mysql/mysql.conf.d/mysqld.cnf

# Add:
query_cache_size=64M
query_cache_type=1
```

### 3. Connection Pooling

Sudah dikonfigurasi di `src/config/database.ts`:
```typescript
pool: {
  max: 10,      // Max connections
  min: 0,       // Min connections
  acquire: 30000,   // Acquire timeout (30s)
  idle: 10000,      // Idle timeout (10s)
}
```

## Next Steps

1. ✅ Install & Configure MySQL
2. ✅ Create Database
3. ✅ Configure Backend .env
4. ✅ Run `npm install`
5. ✅ Run `npm run dev`
6. ✅ Verify backend running on http://localhost:5000
7. → Continue dengan INTEGRATION_GUIDE.md

## Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- Sequelize ORM: https://sequelize.org/
- MySQL Workbench: https://www.mysql.com/products/workbench/
- XAMPP: https://www.apachefriends.org/
