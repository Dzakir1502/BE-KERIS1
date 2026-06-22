import { Response } from "express";
import { AuthRequest } from "@middleware/auth";
import User from "@models/User";
import Quest from "@models/Quest";
import Clue from "@models/Clue";
import { Submission } from "@models/Submission";
import { Project } from "@models/Project";
import { hashPassword } from "@utils/password";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";

// ─── Overview ────────────────────────────────────────────────────────────────

export const getOverview = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const totalUsers = await User.count({ where: { role: "user" } });
  const totalProjects = await Project.count();
  const totalSubmissions = await Submission.count();
  const totalQuests = await Quest.count();
  const pendingSubmissions = await Submission.count({ where: { status: "pending" } });
  const approvedSubmissions = await Submission.count({ where: { status: "approved" } });

  sendSuccess(res, "Overview retrieved", {
    totalUsers,
    totalProjects,
    totalSubmissions,
    totalQuests,
    pendingSubmissions,
    approvedSubmissions,
  });
});

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.findAll({
    attributes: ["id", "email", "nama_lengkap", "no_hp", "role", "level", "points", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  sendSuccess(res, "Users retrieved", users);
});

export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, nama_lengkap, password, no_hp, role } = req.body;

  if (!email || !nama_lengkap || !password) {
    sendError(res, "email, nama_lengkap, and password are required", "VALIDATION_ERROR", 400);
    return;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    sendError(res, "Email already in use", "DUPLICATE_EMAIL", 409);
    return;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    email,
    nama_lengkap,
    password: hashed,
    no_hp: no_hp || "",
    role: role || "user",
    level: 1,
    points: 0,
    isMentor: false,
  });

  sendSuccess(res, "User created", { id: user.id, email: user.email, nama_lengkap: user.nama_lengkap, role: user.role }, 201);
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { email, nama_lengkap, no_hp, role, level, points } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    sendError(res, "User not found", "USER_NOT_FOUND", 404);
    return;
  }

  if (email) user.email = email;
  if (nama_lengkap) user.nama_lengkap = nama_lengkap;
  if (no_hp !== undefined) user.no_hp = no_hp;
  if (role) user.role = role;
  if (level !== undefined) user.level = level;
  if (points !== undefined) user.points = points;

  await user.save();
  sendSuccess(res, "User updated", { id: user.id, email: user.email, nama_lengkap: user.nama_lengkap, role: user.role });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    sendError(res, "User not found", "USER_NOT_FOUND", 404);
    return;
  }
  await user.destroy();
  sendSuccess(res, "User deleted");
});

// ─── Projects ─────────────────────────────────────────────────────────────────

export const adminGetAllProjects = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const projects = await Project.findAll({ order: [["createdAt", "DESC"]] });
  sendSuccess(res, "Projects retrieved", projects);
});

export const adminCreateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, fullDescription, category, difficulty, tags, status, deadline, reward } = req.body;
  if (!title || !description || !category || !difficulty || !deadline) {
    sendError(res, "title, description, category, difficulty, and deadline are required", "VALIDATION_ERROR", 400);
    return;
  }
  const project = await Project.create({
    title,
    description,
    fullDescription: fullDescription || description,
    category,
    difficulty,
    tags: tags || [],
    status: status || "active",
    deadline: new Date(deadline),
    reward: reward || { points: 500, badge: "Participant" },
    participants: 0,
    completions: 0,
    thumbnail: "",
    banner: "",
    requirements: "",
    resources: "",
  });
  sendSuccess(res, "Project created", project, 201);
});

export const adminUpdateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const project = await Project.findByPk(id);
  if (!project) {
    sendError(res, "Project not found", "NOT_FOUND", 404);
    return;
  }
  const { title, description, fullDescription, category, difficulty, tags, status, deadline, reward } = req.body;
  if (title) project.title = title;
  if (description) project.description = description;
  if (fullDescription) project.fullDescription = fullDescription;
  if (category) project.category = category;
  if (difficulty) project.difficulty = difficulty;
  if (tags) project.tags = tags;
  if (status) project.status = status;
  if (deadline) project.deadline = new Date(deadline);
  if (reward) project.reward = reward;
  await project.save();
  sendSuccess(res, "Project updated", project);
});

export const adminDeleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const project = await Project.findByPk(id);
  if (!project) {
    sendError(res, "Project not found", "NOT_FOUND", 404);
    return;
  }
  await project.destroy();
  sendSuccess(res, "Project deleted");
});

// ─── Quests ───────────────────────────────────────────────────────────────────

export const getAllQuests = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const quests = await Quest.findAll({
    include: [{ model: Clue, as: "clues" }],
    order: [["order", "ASC"]],
  });
  sendSuccess(res, "Quests retrieved", quests);
});

export const createQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, xp, status, level, order } = req.body;
  if (!title || !description) {
    sendError(res, "title and description are required", "VALIDATION_ERROR", 400);
    return;
  }
  const quest = await Quest.create({ title, description, xp: xp || 500, status: status || "active", level: level || 1, order: order || 1 });
  sendSuccess(res, "Quest created", quest, 201);
});

export const updateQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const quest = await Quest.findByPk(id);
  if (!quest) {
    sendError(res, "Quest not found", "NOT_FOUND", 404);
    return;
  }
  const { title, description, xp, status, level, order } = req.body;
  if (title) quest.title = title;
  if (description) quest.description = description;
  if (xp !== undefined) quest.xp = xp;
  if (status) quest.status = status;
  if (level !== undefined) quest.level = level;
  if (order !== undefined) quest.order = order;
  await quest.save();
  sendSuccess(res, "Quest updated", quest);
});

export const deleteQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const quest = await Quest.findByPk(id);
  if (!quest) {
    sendError(res, "Quest not found", "NOT_FOUND", 404);
    return;
  }
  await quest.destroy();
  sendSuccess(res, "Quest deleted");
});

// ─── Clues ────────────────────────────────────────────────────────────────────

export const getAllClues = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const clues = await Clue.findAll({ order: [["createdAt", "DESC"]] });
  sendSuccess(res, "Clues retrieved", clues);
});

export const createClue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { questId, clueCode, type, title, description, codeSnippet, isLocked } = req.body;
  if (!clueCode || !title || !description) {
    sendError(res, "clueCode, title, and description are required", "VALIDATION_ERROR", 400);
    return;
  }
  const clue = await Clue.create({ questId: questId || null, clueCode, type: type || "CORE CONCEPT", title, description, codeSnippet: codeSnippet || null, isLocked: isLocked ?? false });
  sendSuccess(res, "Clue created", clue, 201);
});

export const updateClue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const clue = await Clue.findByPk(id);
  if (!clue) {
    sendError(res, "Clue not found", "NOT_FOUND", 404);
    return;
  }
  const { questId, clueCode, type, title, description, codeSnippet, isLocked } = req.body;
  if (questId !== undefined) clue.questId = questId;
  if (clueCode) clue.clueCode = clueCode;
  if (type) clue.type = type;
  if (title) clue.title = title;
  if (description) clue.description = description;
  if (codeSnippet !== undefined) clue.codeSnippet = codeSnippet;
  if (isLocked !== undefined) clue.isLocked = isLocked;
  await clue.save();
  sendSuccess(res, "Clue updated", clue);
});

export const deleteClue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const clue = await Clue.findByPk(id);
  if (!clue) {
    sendError(res, "Clue not found", "NOT_FOUND", 404);
    return;
  }
  await clue.destroy();
  sendSuccess(res, "Clue deleted");
});

export default {
  getOverview,
  getAllUsers, createUser, updateUser, deleteUser,
  adminGetAllProjects, adminCreateProject, adminUpdateProject, adminDeleteProject,
  getAllQuests, createQuest, updateQuest, deleteQuest,
  getAllClues, createClue, updateClue, deleteClue,
};
