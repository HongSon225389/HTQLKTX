// backend/routes/hoaDonRoutes.js
import express from "express";
import {
  layDanhSachHoaDon,
  thanhToanHoaDon,
} from "../controllers/hoaDonController.js";

const router = express.Router();

// GET: /api/hoadon -> Lấy danh sách
router.get("/", layDanhSachHoaDon);

// PUT: /api/hoadon/:id/thanh-toan -> Cập nhật trạng thái thanh toán
router.put("/:id/thanh-toan", thanhToanHoaDon);

export default router;
