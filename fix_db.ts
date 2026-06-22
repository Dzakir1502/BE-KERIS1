import sequelize from "./src/config/database";

async function fixDatabase() {
  console.log("Starting database fix...");
  try {
    // Disable foreign key checks temporarily
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    
    // Make mentorId nullable in enrollments table
    await sequelize.query("ALTER TABLE enrollments MODIFY mentorId INT NULL;");
    
    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    
    console.log("Database fixed successfully! mentorId is now optional.");
  } catch (error) {
    console.error("Error fixing database:", error);
  } finally {
    process.exit(0);
  }
}

fixDatabase();
