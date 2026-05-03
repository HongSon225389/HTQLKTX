// backend/routes/sinhVienRoutes.js
import express from "express";
import { dangKyKtx } from "../controllers/sinhVienController.js";

const router = express.Router();

// POST: /api/sinhvien/dang-ky -> Đăng ký sinh viên mới vào KTX
router.post("/dang-ky", dangKyKtx);

export default router;
