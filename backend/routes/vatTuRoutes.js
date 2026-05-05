// backend/routes/vatTuRoutes.js
import express from "express";
import {
  layDanhSachVatTu,
  themVatTu,
  capNhatTinhTrang,
  xoaVatTu,
} from "../controllers/vatTuController.js";

const router = express.Router();

// GET: /api/vattu -> Lấy danh sách (hỗ trợ ?phongId=...)
router.get("/", layDanhSachVatTu);

// POST: /api/vattu/tao -> Thêm mới vật tư
router.post("/tao", themVatTu);

// PUT: /api/vattu/sua/:id -> Cập nhật tình trạng
router.put("/sua/:id", capNhatTinhTrang);

// DELETE: /api/vattu/xoa/:id -> Xóa vật tư
router.delete("/xoa/:id", xoaVatTu);

export default router;
