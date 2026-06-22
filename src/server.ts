import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "@config/database";
import { config } from "@config/env";
import { errorHandler } from "@utils/errorHandler";
import { corsMiddleware } from "@middleware/cors";
import apiRoutes from "@routes/index";

// Load and configure environment variables on startup
dotenv.config();

const app = express();
const PORT = config.PORT;

// Logging
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));

// CORS — satu middleware saja, baca dari CORS_ORIGIN di .env
app.use(corsMiddleware);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to database
connectDB();

// Health check (SEBELUM /api routes)
app.get("/health", (_req, res) => {
  res.json({ 
    status: "OK", 
    message: "Backend is running",
    timestamp: new Date(), 
    env: config.NODE_ENV 
  });
});

// API Routes
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    error: "NOT_FOUND",
  });
});

// Error handling middleware (harus paling bawah)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    KERIS Backend Server Started        ║
║    Port    : ${PORT}                       ║
║    Env     : ${config.NODE_ENV}              ║
║    DB      : ${process.env.DB_NAME}           ║
╚════════════════════════════════════════╝
  `);
});

export default app;