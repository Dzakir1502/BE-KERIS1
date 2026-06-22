import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import { deleteThread } from "@controllers/communityController";
import { Thread } from "@models/Community";

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");

    // Insert a temp thread to delete
    const tempThread = await Thread.create({
      title: "Temp Thread",
      content: "Temp content",
      category: "Web Dev",
      authorId: 1,
      tags: "[]",
      views: 0,
      likes: 0,
      lastActivity: new Date(),
    });

    console.log("Created temp thread ID:", tempThread.id);

    // Mock Express Request
    const req: any = {
      params: { threadId: String(tempThread.id) },
      user: { id: 1 } // Owner
    };

    // Mock Express Response
    const res: any = {
      status(code: number) {
        console.log("Response status called with code:", code);
        return this;
      },
      json(data: any) {
        console.log("Response json called with data:", JSON.stringify(data, null, 2));
        return this;
      }
    };

    const next = (err: any) => {
      if (err) {
        console.error("Express next() called with error:", err);
      }
    };

    // Execute the controller function
    await deleteThread(req, res, next);

  } catch (error) {
    console.error("Test execution failed with error:", error);
  }
}

test().then(() => {
  setTimeout(() => process.exit(0), 2000);
}).catch((err) => {
  console.error("Unhandle test error:", err);
  process.exit(1);
});
