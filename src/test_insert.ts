import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import { Thread } from "@models/Community";

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");

    // Make a fake base64 image string (approx 50kb)
    const fakeBase64 = "data:image/png;base64," + "A".repeat(50000);

    const thread = await Thread.create({
      title: "Test Insert Base64 Image",
      content: JSON.stringify({
        message: "Testing if this fails.",
        code: "const x = 1;",
        language: "javascript"
      }),
      category: "Web Dev",
      authorId: 1, // Admin user ID
      tags: JSON.stringify(["Test", fakeBase64]),
      views: 0,
      likes: 0,
      lastActivity: new Date(),
    });

    console.log("Insert success! Created thread ID:", thread.id);
  } catch (error) {
    console.error("Insert failed with error:", error);
  } finally {
    process.exit(0);
  }
}

test();
