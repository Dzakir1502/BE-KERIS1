import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import { Thread, Reply } from "@models/Community";
import User from "@models/User";
import sequelize from "@config/database";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";
import { Op } from "sequelize";

export const getAllThreads = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, category, sort = "latest", mine } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (category) where.category = category;
    // Filter "Postingan Saya" – hanya thread milik user yang sedang login
    if (mine === "true") {
      where.authorId = req.user?.id;
    }

    let order: any[] = [["createdAt", "DESC"]];
    if (sort === "trending") {
      // Urutkan berdasarkan jumlah Reply terbanyak, lalu likes
      order = [
        [sequelize.literal("(SELECT COUNT(*) FROM replies WHERE replies.threadId = Thread.id)"), "DESC"],
        ["likes", "DESC"],
      ];
    }

    const { count, rows } = await Thread.findAndCountAll({
      where,
      include: [
        { model: User, as: "author", attributes: ["id", "nama_lengkap", "avatar"] },
        // Sertakan Replies agar Flutter bisa menghitung jumlahnya
        { model: Reply, attributes: ["id"] },
      ],
      offset,
      limit: Number(limit),
      order,
      distinct: true, // Penting agar count tidak double akibat JOIN
    });

    sendSuccess(res, "Threads retrieved successfully", {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  }
);

export const getThreadDetail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { threadId } = req.params;

    const thread = await Thread.findByPk(threadId, {
      include: [
        { model: User, as: "author", attributes: ["id", "nama_lengkap", "avatar"] },
        {
          model: Reply,
          include: [{ model: User, as: "author", attributes: ["id", "nama_lengkap", "avatar"] }],
        },
      ],
    });

    if (!thread) {
      sendError(res, "Thread not found", "THREAD_NOT_FOUND", 404);
      return;
    }

    // Increment views
    thread.views += 1;
    await thread.save();

    sendSuccess(res, "Thread detail retrieved successfully", thread);
  }
);

export const createThread = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { title, content, category, tags } = req.body;

    const thread = await Thread.create({
      title,
      content,
      category,
      authorId: Number(userId),
      tags: JSON.stringify(tags),
      views: 0,
      likes: 0,
      lastActivity: new Date(),
    });

    sendSuccess(res, "Thread created successfully", thread, 201);
  }
);

export const replyToThread = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { threadId } = req.params;
    const { content } = req.body;

    const thread = await Thread.findByPk(Number(threadId));
    if (!thread) {
      sendError(res, "Thread not found", "THREAD_NOT_FOUND", 404);
      return;
    }

    const reply = await Reply.create({
      threadId: Number(threadId),
      authorId: Number(userId),
      content,
    });

    // Update thread's last activity
    thread.lastActivity = new Date();
    await thread.save();

    sendSuccess(res, "Reply created successfully", reply, 201);
  }
);

export const likeThread = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { threadId } = req.params;

    const thread = await Thread.findByPk(Number(threadId));
    if (!thread) {
      sendError(res, "Thread not found", "THREAD_NOT_FOUND", 404);
      return;
    }

    thread.likes += 1;
    await thread.save();

    sendSuccess(res, "Liked successfully", {
      liked: true,
      totalLikes: thread.likes,
    });
  }
);

export const deleteThread = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { threadId } = req.params;
    const userId = req.user?.id;

    const thread = await Thread.findByPk(Number(threadId));
    if (!thread) {
      sendError(res, "Thread not found", "THREAD_NOT_FOUND", 404);
      return;
    }

    // Periksa kepemilikan thread
    if (Number(thread.authorId) !== Number(userId)) {
      sendError(res, "You are not authorized to delete this thread", "FORBIDDEN", 403);
      return;
    }

    // Hapus balasan/replies terkait terlebih dahulu secara manual untuk mencegah error foreign key constraint
    await Reply.destroy({ where: { threadId: Number(threadId) } });

    // Hapus thread
    await thread.destroy();

    sendSuccess(res, "Thread deleted successfully", null);
  }
);

export default {
  getAllThreads,
  getThreadDetail,
  createThread,
  replyToThread,
  likeThread,
  deleteThread,
};
