// backend/routes/phongRoutes.js
import express from "express";
import {
  layDanhSachPhong,
  themPhongMoi,
  capNhatPhong,
  xoaPhong,
} from "../controllers/phongController.js";

const router = express.Router();

// GET: /api/phong -> Lấy danh sách phòng
router.get("/", layDanhSachPhong);

// POST: /api/phong -> Thêm phòng mới
router.post("/", themPhongMoi);

// PUT: /api/phong/:id -> Cập nhật phòng theo ID
router.put("/:id", capNhatPhong);

//DELETE: /api/phong/:id -> Xóa phòng theo ID (nếu cần, chưa có trong controller)
router.delete("/:id", xoaPhong);

export default router;
