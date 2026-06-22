import dotenv from "dotenv";
dotenv.config({ override: true });

import User from "@models/User";
import { generateToken } from "@utils/jwt";
import sequelize from "@config/database";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Database connection OK.");

    const users = await User.findAll();
    if (users.length === 0) {
      console.log("No users found in database.");
      // Generate a mock token for testing
      const mockPayload = { id: "999", email: "mockuser@example.com", role: "user" };
      const mockAdminPayload = { id: "888", email: "mockadmin@example.com", role: "admin" };
      console.log("\nMock JWT Tokens for testing:");
      console.log(`Mock User (id: 999, user@example.com):\n${generateToken(mockPayload)}`);
      console.log(`Mock Admin (id: 888, admin@example.com):\n${generateToken(mockAdminPayload)}`);
      return;
    }

    console.log(`\nFound ${users.length} users in database. Generating JWT tokens:\n`);
    for (const user of users) {
      const token = generateToken({
        id: user.id.toString(),
        email: user.email,
        role: user.role,
      });

      console.log(`==================================================`);
      console.log(`Nama   : ${user.nama_lengkap}`);
      console.log(`Email  : ${user.email}`);
      console.log(`Role   : ${user.role}`);
      console.log(`ID     : ${user.id}`);
      console.log(`JWT    :\n${token}\n`);
    }
  } catch (error) {
    console.error("Error generating JWT:", error);
  } finally {
    await sequelize.close();
  }
}

main();
