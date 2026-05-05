// backend/routes/hoaDonRoutes.js
import express from "express";
import {
  layDanhSachHoaDon,
  thanhToanHoaDon,
  taoHoaDon,
} from "../controllers/hoaDonController.js";

const router = express.Router();

// GET: /api/hoadon -> Lấy danh sách
router.get("/", layDanhSachHoaDon);

// PUT: /api/hoadon/:id/thanh-toan -> Cập nhật trạng thái thanh toán
router.put("/pay/:id", thanhToanHoaDon);

// POST: /api/hoadon/tao -> Tạo mới hóa đơn
router.post("/tao", taoHoaDon); //
export default router;
