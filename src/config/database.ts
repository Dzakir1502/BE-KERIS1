import { Sequelize } from "sequelize";
import config from "./env";

const isDev = config.NODE_ENV === "development";

let sequelize: Sequelize;

if (config.DB_URL) {
  sequelize = new Sequelize(config.DB_URL, {
    dialect: "mysql",
    logging: isDev ? console.log : false,
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
} else {
  sequelize = new Sequelize({
    dialect: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    logging: isDev ? console.log : false,
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
}

// Set session sort_buffer_size to 16MB for every connection to prevent ER_OUT_OF_SORTMEMORY
sequelize.addHook("afterConnect", (connection: any) => {
  connection.query("SET SESSION sort_buffer_size = 1048576 * 16;", (err: any) => {
    if (err) {
      console.error("❌ Failed to set session sort_buffer_size:", err);
    }
  });
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");

    // JANGAN pakai alter:true di production — bisa mengubah kolom secara destruktif
    // Schema dikelola via keris_db.sql / migrasi manual
    if (config.NODE_ENV === "development") {
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