import { Router } from "express";
import { authenticateToken, authorizeRole } from "@middleware/auth";
import * as adminController from "@controllers/adminController";

const router = Router();

router.use(authenticateToken, authorizeRole("admin"));

router.get("/overview", adminController.getOverview);

router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/projects", adminController.adminGetAllProjects);
router.post("/projects", adminController.adminCreateProject);
router.put("/projects/:id", adminController.adminUpdateProject);
router.delete("/projects/:id", adminController.adminDeleteProject);

router.get("/quests", adminController.getAllQuests);
router.post("/quests", adminController.createQuest);
router.put("/quests/:id", adminController.updateQuest);
router.delete("/quests/:id", adminController.deleteQuest);

router.get("/clues", adminController.getAllClues);
router.post("/clues", adminController.createClue);
router.put("/clues/:id", adminController.updateClue);
router.delete("/clues/:id", adminController.deleteClue);

export default router;
