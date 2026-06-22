import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import { FaqLog } from "@models/FaqLog";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";

/**
 * POST /api/log-faq
 * Menyimpan pertanyaan yang gagal dijawab oleh AI ke tabel log_pertanyaan_gagal.
 * Dipanggil secara diam-diam (fire-and-forget) oleh Frontend Flutter.
 */
export const simpanLogPertanyaan = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { pertanyaan } = req.body;
    const userId = req.user?.id ?? null;

    if (!pertanyaan || typeof pertanyaan !== "string" || pertanyaan.trim() === "") {
      sendError(res, "Teks pertanyaan wajib dikirim.", "VALIDATION_ERROR", 400);
      return;
    }

    await FaqLog.create({
      pertanyaan: pertanyaan.trim(),
      userId: userId ? Number(userId) : null,
    });

    sendSuccess(res, "Log pertanyaan gagal berhasil dicatat.", {}, 201);
  }
);

export default { simpanLogPertanyaan };
