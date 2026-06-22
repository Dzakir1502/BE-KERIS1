import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import { FaqLog } from "@models/FaqLog";
import EnrollmentCode from "@models/EnrollmentCode";
import { config } from "@config/env";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";

/**
 * POST /api/ai/chat
 * Sends a message to the KeBot AI faq-chatbot, and logs failed questions automatically.
 */
export const chatWithAI = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { pertanyaan } = req.body;
    const userId = req.user?.id ?? null;

    if (!userId) {
      sendError(res, "Unauthorized", "UNAUTHORIZED", 401);
      return;
    }

    // Check if user already has an enrollment or a generated code
    const existingCode = await EnrollmentCode.findOne({
      where: { usedByUserId: Number(userId) },
    });

    const { Enrollment } = await import("@models/Enrollment");
    const existingEnrollment = await Enrollment.findOne({
      where: { userId: Number(userId) },
    });

    if (existingCode || existingEnrollment) {
      sendError(res, "AI has been locked as you already obtained an access code.", "AI_LOCKED", 400);
      return;
    }

    if (!pertanyaan || typeof pertanyaan !== "string" || pertanyaan.trim() === "") {
      sendError(res, "Pertanyaan wajib diisi.", "VALIDATION_ERROR", 400);
      return;
    }

    try {
      const response = await fetch(`${config.AI_API_URL}/api/faq-chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pertanyaan: pertanyaan.trim() }),
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data: any = await response.json();

      // Jika action adalah LOG_FAILED_QUESTION atau confidence sangat rendah,
      // simpan ke tabel log_pertanyaan_gagal
      if (data.action === "LOG_FAILED_QUESTION" || data.confidence === 0) {
        await FaqLog.create({
          pertanyaan: pertanyaan.trim(),
          userId: userId ? Number(userId) : null,
        });
      }

      sendSuccess(res, "AI response retrieved successfully", {
        jawaban: data.jawaban,
        action: data.action,
        confidence: data.confidence,
      });
    } catch (error: any) {
      console.error("AI Chatbot Error:", error);
      sendError(res, "Gagal menghubungi AI Server.", "AI_API_ERROR", 502);
    }
  }
);

/**
 * POST /api/ai/talent-scout
 * Evaluates quest/kuesioner data to recommend a track and generate workspace code.
 */
export const evaluateTalent = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { kuesioner } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendError(res, "Unauthorized", "UNAUTHORIZED", 401);
      return;
    }

    // Check if user already has an enrollment or a generated code
    const existingCode = await EnrollmentCode.findOne({
      where: { usedByUserId: Number(userId) },
    });

    const { Enrollment } = await import("@models/Enrollment");
    const existingEnrollment = await Enrollment.findOne({
      where: { userId: Number(userId) },
    });

    if (existingCode || existingEnrollment) {
      sendError(res, "AI has been locked as you already obtained an access code.", "AI_LOCKED", 400);
      return;
    }

    try {
      const response = await fetch(`${config.AI_API_URL}/api/talent-scout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kuesioner: kuesioner || {} }),
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data: any = await response.json();

      // Automatically register the generated workspace code in the database
      if (data && data.status === "success" && data.workspace_code) {
        // Map jurusan/track to database trackName
        let dbTrackName = "Web Development";
        let prefix = "WEB";
        const aiJurusan = data.jurusan || "";
        
        if (aiJurusan.toLowerCase().includes("ai") || aiJurusan.toLowerCase().includes("artificial") || aiJurusan.toLowerCase().includes("kecerdasan")) {
          dbTrackName = "Artificial Intelligence";
          prefix = "AI";
        } else if (aiJurusan.toLowerCase().includes("mobile") || aiJurusan.toLowerCase().includes("android") || aiJurusan.toLowerCase().includes("ios")) {
          dbTrackName = "Mobile Development";
          prefix = "MOB";
        } else {
          dbTrackName = "Web Development";
          prefix = "WEB";
        }

        // Format code prefix as requested (AI-XXXX, WEB-XXXX, MOB-XXXX)
        let suffix = "CODE";
        if (typeof data.workspace_code === "string") {
          const parts = data.workspace_code.split("-");
          suffix = parts[parts.length - 1].toUpperCase();
        }
        
        const formattedCode = `${prefix}-${suffix}`;
        
        // Override returned payload to client with formatted code
        data.workspace_code = formattedCode;
        data.pesan = `Gunakan kode unik ${formattedCode} untuk membuka Project Workspace & Micro Learning ${dbTrackName}.`;

        await EnrollmentCode.findOrCreate({
          where: { code: formattedCode },
          defaults: {
            code: formattedCode,
            trackName: dbTrackName,
            isUsed: false,
            usedByUserId: Number(userId),
          }
        });
      }

      sendSuccess(res, "Talent scout evaluation completed", data);
    } catch (error: any) {
      console.error("AI Talent Scout Error:", error);
      sendError(res, "Gagal menghubungi AI Server.", "AI_API_ERROR", 502);
    }
  }
);

/**
 * GET /api/ai/status
 * Check if the current authenticated user already has an active access code or enrollment.
 */
export const getAIStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, "Unauthorized", "UNAUTHORIZED", 401);
      return;
    }

    const codeRecord = await EnrollmentCode.findOne({
      where: { usedByUserId: Number(userId) },
    });

    const { Enrollment } = await import("@models/Enrollment");
    const enrollmentRecord = await Enrollment.findOne({
      where: { userId: Number(userId) },
    });

    if (codeRecord || enrollmentRecord) {
      const code = codeRecord?.code || "ALREADY_ENROLLED";
      const trackName = codeRecord?.trackName || enrollmentRecord?.trackName || "";
      sendSuccess(res, "AI Status retrieved", {
        hasCode: true,
        code,
        trackName,
        isUsed: codeRecord ? codeRecord.isUsed : true,
      });
    } else {
      sendSuccess(res, "AI Status retrieved", {
        hasCode: false,
      });
    }
  }
);

export default {
  chatWithAI,
  evaluateTalent,
  getAIStatus,
};
