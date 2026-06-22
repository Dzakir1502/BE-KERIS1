import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import { Thread, Reply } from "@models/Community";

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");

    // Let's find the thread with ID 6 (which we created in test_insert.ts)
    const threadId = 6;
    const thread = await Thread.findByPk(threadId);
    
    if (!thread) {
      console.log(`Thread with ID ${threadId} not found`);
      return;
    }

    console.log("Found thread:", thread.title);
    
    // Try to delete the thread
    await thread.destroy();
    console.log("Thread deleted successfully!");

  } catch (error) {
    console.error("Deletion failed with error:", error);
  } finally {
    process.exit(0);
  }
}

test();
