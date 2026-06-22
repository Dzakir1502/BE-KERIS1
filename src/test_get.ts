import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import { Thread, Reply } from "@models/Community";
import User from "@models/User";

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");

    const where: any = { category: "Web Dev" };

    const { count, rows } = await Thread.findAndCountAll({
      where,
      include: [
        { model: User, as: "author", attributes: ["id", "nama_lengkap", "avatar"] },
        { model: Reply, attributes: ["id"] },
      ],
      offset: 0,
      limit: 10,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    console.log("Query success, total threads count:", count);
    console.log("Rows count:", rows.length);
    if (rows.length > 0) {
      console.log("Sample row:", JSON.stringify(rows[0], null, 2));
    }
  } catch (error) {
    console.error("Query failed with error:", error);
  } finally {
    process.exit(0);
  }
}

test();
