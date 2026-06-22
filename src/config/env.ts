import dotenv from "dotenv";

dotenv.config({ override: true });

// Validasi env wajib saat startup
const hasDbUrl = !!(process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PRIVATE_URL);
const hasDbHost = !!(process.env.DB_HOST || process.env.MYSQLHOST);
const hasDbUser = !!(process.env.DB_USER || process.env.MYSQLUSER);
const hasDbName = !!(process.env.DB_NAME || process.env.MYSQLDATABASE);

if (!hasDbUrl && (!hasDbHost || !hasDbUser || !hasDbName)) {
  console.error("❌ Missing required database environment variables.");
  console.error("Please provide either DATABASE_URL/MYSQL_URL/MYSQL_PRIVATE_URL, or DB_HOST/MYSQLHOST, DB_USER/MYSQLUSER, and DB_NAME/MYSQLDATABASE.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variable: JWT_SECRET");
  process.exit(1);
}

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DB_URL: process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PRIVATE_URL || null,
  DB_HOST: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || "3306", 10),
  DB_USER: process.env.DB_USER || process.env.MYSQLUSER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
  DB_NAME: process.env.DB_NAME || process.env.MYSQLDATABASE || "keris_db",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),

  // Email (opsional)
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // AI Configuration
  AI_API_URL: process.env.AI_API_URL || "https://cindipretty02-keris-kebot.hf.space",
};

export default config;