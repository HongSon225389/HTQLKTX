// backend/routes/phongRoutes.js
import express from "express";
import {
  layDanhSachPhong,
  themPhongMoi,
  capNhatPhong,
} from "../controllers/phongController.js";

const router = express.Router();

// GET: /api/phong -> Lấy danh sách phòng
router.get("/", layDanhSachPhong);

// POST: /api/phong -> Thêm phòng mới
router.post("/", themPhongMoi);

// PUT: /api/phong/:id -> Cập nhật phòng theo ID
router.put("/:id", capNhatPhong);

export default router;
