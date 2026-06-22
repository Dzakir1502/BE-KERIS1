import { Router } from "express";
import { body } from "express-validator";
import * as faqLogController from "@controllers/faqLogController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Semua route di sini memerlukan token login
router.use(authenticateToken);

/**
 * POST /api/log-faq
 * Menerima pertanyaan yang gagal dijawab AI dan menyimpannya ke database.
 * Dipanggil secara diam-diam oleh Flutter setiap kali AI merespons dengan
 * action: "LOG_FAILED_QUESTION"
 */
router.post(
  "/",
  [
    body("pertanyaan")
      .notEmpty().withMessage("Teks pertanyaan wajib dikirim.")
      .isString().withMessage("Pertanyaan harus berupa teks.")
      .trim(),
  ],
  validationMiddleware,
  faqLogController.simpanLogPertanyaan
);

export default router;
