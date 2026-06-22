import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import { Thread, Reply } from "@models/Community";
import User from "@models/User";

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");

    const { count, rows } = await Thread.findAndCountAll({
      include: [
        { model: User, as: "author", attributes: ["id", "nama_lengkap", "avatar"] },
        { model: Reply, attributes: ["id"] },
      ],
      distinct: true,
    });

    console.log("Query success, total threads count:", count);
    console.log("Rows count:", rows.length);
    if (rows.length > 0) {
      console.log("Sample tags value:", rows[0].tags);
      console.log("Sample tags type:", typeof rows[0].tags);
    }
  } catch (error) {
    console.error("Query failed with error:", error);
  } finally {
    process.exit(0);
  }
}

test();
