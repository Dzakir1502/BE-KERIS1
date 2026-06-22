import dotenv from "dotenv";
dotenv.config();

import * as communityController from "@controllers/communityController";
import defaultController from "@controllers/communityController";

console.log("Named export deleteThread:", typeof communityController.deleteThread);
console.log("Default export deleteThread:", typeof defaultController.deleteThread);
process.exit(0);
