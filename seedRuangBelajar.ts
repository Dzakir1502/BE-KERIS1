import sequelize from "./src/config/database";
import Course from "./src/models/Course";
import Module from "./src/models/Module";

async function runSeeder() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // Cari atau buat Course Web Development
    let webCourse = await Course.findOne({ where: { title: "Web Development" } });
    if (!webCourse) {
      webCourse = await Course.create({
        title: "Web Development",
        description: "Membangun website modern.",
        fullDescription: "Belajar membuat website dari nol dengan HTML, CSS, dan JS.",
        category: "Web",
        level: "beginner",
        instructorId: 1, // Pastikan user ID 1 ada
        thumbnail: "https://example.com/web.jpg",
      });
      console.log("Course Web Development dibuat.");
    } else {
      // Update category jika kategori lama salah
      webCourse.category = "Web";
      await webCourse.save();
      console.log("Course Web Development diupdate kategorinya ke 'Web'.");
    }

    // Data Modul Level 1
    const level1Lessons = [
      {
        id: "html-fundamentals",
        title: "HTML Fundamentals",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 1,
        questCode: "void main() {\n  String username = 'Alex';\n  bool isLogin = true;\n\n  if(isLogin){\n    print('Welcome ' + username);\n  }\n}",
        questQuestion: "Apa output yang dihasilkan program tersebut?",
        questAnswer: "Welcome Alex",
        cluecardTitle: "Clue Card #1 — First Screen",
        cluecardDesc: "Setiap aplikasi dimulai dari sebuah layar yang menyambut pengguna. Proyekmu akan membutuhkan halaman utama yang mampu menampilkan informasi secara jelas."
      },
      {
        id: "css-fundamentals",
        title: "CSS Fundamentals",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 2,
        questCode: "void main() {\n  int width = 10;\n  int height = 5;\n  int padding = 2;\n  \n  int totalWidth = width + (padding * 2);\n  print(totalWidth);\n}",
        questQuestion: "Berapa total width yang di print?",
        questAnswer: "14",
        cluecardTitle: "Clue Card #2 — The Box Model",
        cluecardDesc: "Setiap elemen web adalah sebuah kotak. Memahami Box Model adalah kunci dari layout yang presisi."
      },
      {
        id: "responsive-design",
        title: "Responsive Design",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 3,
        questCode: "void main() {\n  bool isMobile = true;\n  String layout = isMobile ? 'Column' : 'Row';\n  print(layout);\n}",
        questQuestion: "Layout apa yang digunakan?",
        questAnswer: "Column",
        cluecardTitle: "Clue Card #3 — Flexibility",
        cluecardDesc: "Tampilan yang baik harus bisa beradaptasi di layar sekecil apapun maupun sebesar apapun."
      }
    ];

    // Data Modul Level 2
    const level2Lessons = [
      {
        id: "javascript-basics",
        title: "JavaScript Basics",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 1,
        questCode: "function greet(name) {\n  return 'Hello ' + name;\n}\nconsole.log(greet('Keris'));",
        questQuestion: "Apa hasil dari console.log tersebut?",
        questAnswer: "Hello Keris",
        cluecardTitle: "Clue Card #4 — Interactive Brain",
        cluecardDesc: "HTML adalah kerangka, CSS adalah kulit, dan JavaScript adalah otak yang membuat web menjadi hidup."
      },
      {
        id: "dom-manipulation",
        title: "DOM Manipulation",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 2,
        questCode: "const title = document.getElementById('title');\ntitle.innerText = 'New Title';\n// Apa innerText dari title sekarang?",
        questQuestion: "Sebutkan isi textnya!",
        questAnswer: "New Title",
        cluecardTitle: "Clue Card #5 — Magic Wand",
        cluecardDesc: "DOM API memungkinkan kamu mengubah halaman web secara langsung tanpa harus me-refresh browser."
      },
      {
        id: "api-integration",
        title: "API Integration",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 3,
        questCode: "fetch('/api/data')\n  .then(res => res.json())\n  .then(data => console.log(data.status));\n// Asumsikan backend mengembalikan {status: 'ok'}",
        questQuestion: "Apa yang muncul di log?",
        questAnswer: "ok",
        cluecardTitle: "Clue Card #6 — Data Messenger",
        cluecardDesc: "API adalah kurir yang mengantarkan data antara frontend dan database secara aman."
      }
    ];

    // Data Modul Level 3
    const level3Lessons = [
      {
        id: "backend-fundamentals",
        title: "Backend Fundamentals",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 1,
        questCode: "const express = require('express');\nconst app = express();\napp.get('/', (req, res) => res.send('API Ready'));\napp.listen(3000);",
        questQuestion: "Pada port berapa server berjalan?",
        questAnswer: "3000",
        cluecardTitle: "Clue Card #7 — The Engine Room",
        cluecardDesc: "Backend bekerja di balik layar, menangani logika bisnis, keamanan, dan pengolahan data rahasia."
      },
      {
        id: "database-basics",
        title: "Database Basics",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 2,
        questCode: "SELECT username FROM users WHERE id = 1;",
        questQuestion: "Data kolom apa yang diambil dari tabel users?",
        questAnswer: "username",
        cluecardTitle: "Clue Card #8 — Data Vault",
        cluecardDesc: "Database menyimpan jutaan informasi penting yang bisa diambil hanya dalam hitungan milidetik."
      },
      {
        id: "deployment-basics",
        title: "Deployment Basics",
        type: "video_and_quest",
        videoUrl: "https://drive.google.com/file/d/1FrNS1rkiSeVPIqbIc8srGZ34DyLeaBJ4/view?usp=drive_link",
        videoCredit: "Web Programming Unpas",
        order: 3,
        questCode: "git add .\ngit commit -m 'Initial commit'\ngit push origin main",
        questQuestion: "Apa nama branch tujuan pada perintah push?",
        questAnswer: "main",
        cluecardTitle: "Clue Card #9 — Going Live",
        cluecardDesc: "Saat kodemu naik ke tahap produksi, seluruh dunia bisa mengakses apa yang kamu bangun."
      }
    ];

    const modules = [
      {
        courseId: webCourse.id,
        title: "Level 1 — Web Fundamentals",
        description: "Dasar-dasar HTML dan CSS.",
        order: 1,
        lessons: level1Lessons,
      },
      {
        courseId: webCourse.id,
        title: "Level 2 — Interactive Web Development",
        description: "Membuat web interaktif.",
        order: 2,
        lessons: level2Lessons,
      },
      {
        courseId: webCourse.id,
        title: "Level 3 — Backend & Deployment",
        description: "Backend dan database.",
        order: 3,
        lessons: level3Lessons,
      }
    ];

    for (const mod of modules) {
      let existing = await Module.findOne({ where: { courseId: webCourse.id, title: mod.title } });
      if (existing) {
        existing.lessons = mod.lessons as any;
        await existing.save();
        console.log(`Modul ${mod.title} diupdate.`);
      } else {
        await Module.create(mod);
        console.log(`Modul ${mod.title} dibuat.`);
      }
    }

    console.log("Seeding selesai.");
    process.exit(0);
  } catch (err) {
    console.error("Gagal seeding:", err);
    process.exit(1);
  }
}

runSeeder();
