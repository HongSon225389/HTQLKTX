// backend/routes/vatTuRoutes.js
import express from "express";
import {
  layDanhSachVatTu,
  themVatTu,
  capNhatTinhTrang,
} from "../controllers/vatTuController.js";

const router = express.Router();

// GET: /api/vattu -> Lấy danh sách (hỗ trợ ?phongId=...)
router.get("/", layDanhSachVatTu);

// POST: /api/vattu -> Thêm mới vật tư
router.post("/", themVatTu);

// PUT: /api/vattu/:id/tinh-trang -> Cập nhật tình trạng
router.put("/:id/tinh-trang", capNhatTinhTrang);

export default router;
