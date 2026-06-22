import dotenv from "dotenv";

dotenv.config();

// Validasi env wajib saat startup
const requiredEnvVars = ["DB_HOST", "DB_NAME", "DB_USER", "JWT_SECRET"];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database (MySQL only)
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME!,

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
};

export default config;