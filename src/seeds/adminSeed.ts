import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import User from "@models/User";
import Quest from "@models/Quest";
import Clue from "@models/Clue";
import Course from "@models/Course";
import Module from "@models/Module";
import Project from "@models/Project";
import Submission from "@models/Submission";
import Mentor from "@models/Mentor";
import Enrollment from "@models/Enrollment";
import EnrollmentCode from "@models/EnrollmentCode";
import FaqLog from "@models/FaqLog";
import { Thread, Reply } from "@models/Community";
import { hashPassword } from "@utils/password";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    // Ensure all models are registered (prevents tree-shaking)
    const _models = [Course, Module, Project, Submission, Mentor, Enrollment, EnrollmentCode, FaqLog, Thread, Reply];
    console.log(`Registered ${_models.length} extra models for syncing.`);

    // Sync models so tables exist
    await sequelize.sync({ alter: true });

    // Create admin user
    const existing = await User.findOne({ where: { email: "Admin@gmail.com" } });
    if (!existing) {
      const hashed = await hashPassword("admin123");
      await User.create({
        email: "Admin@gmail.com",
        nama_lengkap: "Administrator",
        password: hashed,
        no_hp: "",
        role: "admin",
        level: 99,
        points: 0,
        isMentor: false,
      });
      console.log("✅ Admin user created: Admin@gmail.com / admin123");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Seed sample quests
    const questCount = await Quest.count();
    if (questCount === 0) {
      const q1 = await Quest.create({
        title: "Kenalan dengan Python",
        description: "Pelajari dasar-dasar Python untuk analisis data",
        xp: 500,
        status: "active",
        level: 1,
        order: 1,
      });

      const q2 = await Quest.create({
        title: "Eksplorasi Data dengan Pandas",
        description: "Gunakan library Pandas untuk manipulasi dan eksplorasi dataset",
        xp: 750,
        status: "active",
        level: 1,
        order: 2,
      });

      // Seed sample clues for quest 1
      await Clue.bulkCreate([
        {
          questId: q1.id,
          clueCode: "882",
          type: "CORE CONCEPT",
          title: "Python List Comprehension",
          description: "List comprehension adalah cara singkat untuk membuat list baru dari iterable.",
          codeSnippet: "squares = [x**2 for x in range(10)]",
          isLocked: false,
        },
        {
          questId: q1.id,
          clueCode: "441",
          type: "EVIDENCE",
          title: "Import Library",
          description: "Gunakan import untuk memanggil library eksternal seperti pandas dan numpy.",
          codeSnippet: "import pandas as pd\nimport numpy as np",
          isLocked: false,
        },
        {
          questId: q2.id,
          clueCode: "773",
          type: "RARE TOOL",
          title: "DataFrame.describe()",
          description: "Method describe() memberikan ringkasan statistik dari DataFrame secara instan.",
          codeSnippet: "df.describe()",
          isLocked: true,
        },
      ]);

      console.log("✅ Sample quests and clues created");
    } else {
      console.log("ℹ️  Quests already exist, skipping");
    }

    // Seed sample threads
    const threadCount = await Thread.count();
    if (threadCount === 0) {
      const adminUser = await User.findOne({ where: { email: "Admin@gmail.com" } });
      const adminId = adminUser ? adminUser.id : 1;

      const t1 = await Thread.create({
        title: "Best Practice React 19 Compiler",
        content: "Vite 8 dan React 19 sudah rilis! Bagaimana pendapat kalian tentang React Compiler? Apakah kinerjanya benar-benar meniadakan kebutuhan useMemo dan useCallback secara menyeluruh?",
        category: "Web Dev",
        authorId: adminId,
        tags: JSON.stringify(["React 19", "Vite"]),
        views: 120,
        likes: 25,
        lastActivity: new Date(),
      });

      const t2 = await Thread.create({
        title: "Flutter 3.24 vs React Native di 2026",
        content: "Untuk pengembangan aplikasi mobile cross-platform, manakah yang lebih efisien untuk aplikasi berskala besar? Mari diskusikan performa rendering engine Impeller vs Architecture baru React RN.",
        category: "Mobile Dev",
        authorId: adminId,
        tags: JSON.stringify(["Flutter", "React Native"]),
        views: 85,
        likes: 18,
        lastActivity: new Date(),
      });

      const t3 = await Thread.create({
        title: "Integrasi LLM Lokal dengan Ollama & LangChain",
        content: "Sedang mencoba mendeploy DeepSeek-R1 secara lokal untuk asisten IT internal. Ada yang punya tips optimasi prompt agar response time di bawah 1 detik?",
        category: "AI",
        authorId: adminId,
        tags: JSON.stringify(["LLM", "Ollama", "AI"]),
        views: 210,
        likes: 42,
        lastActivity: new Date(),
      });

      // Seed some sample replies for thread 1
      await Reply.bulkCreate([
        {
          threadId: t1.id,
          authorId: adminId,
          content: "Menurut saya React Compiler sangat membantu mempercepat development, tapi untuk project legacy kita masih perlu review manual agar tidak ada behavior hook yang rusak.",
          likes: 5,
        },
        {
          threadId: t1.id,
          authorId: adminId,
          content: "Setuju! Terutama jika dependencies array-nya tidak terdefinisi dengan jelas di kode lama.",
          likes: 2,
        }
      ]);

      console.log("✅ Sample threads and replies created");
    } else {
      console.log("ℹ️  Threads already exist, skipping");
    }

    console.log("✅ Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
