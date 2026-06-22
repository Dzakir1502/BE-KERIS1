import dotenv from "dotenv";
dotenv.config();

import sequelize from "@config/database";
import User from "@models/User";
import Quest from "@models/Quest";
import Clue from "@models/Clue";
import { hashPassword } from "@utils/password";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

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

    console.log("✅ Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
