import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "keris_db",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");

    // JANGAN pakai alter:true di production — bisa mengubah kolom secara destruktif
    // Schema dikelola via keris_db.sql / migrasi manual
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
    }
    console.log("✅ Database models synchronized");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await sequelize.close();
    console.log("✅ MySQL disconnected");
  } catch (error) {
    console.error("❌ Database disconnection error:", error);
  }
};

export default sequelize;