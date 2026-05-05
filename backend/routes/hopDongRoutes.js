// backend/routes/hopDongRoutes.js
import express from "express";
import {
  taoHopDongMoi,
  layDanhSachHopDong,
  thanhLyHopDong,
  layChiTietHopDong,
  giaHanHopDong,
} from "../controllers/hopDongController.js";

const router = express.Router();

// GET: /api/hopdong
router.get("/", layDanhSachHopDong);

// GET: /api/hopdong/:id
router.get("/:id", layChiTietHopDong);

// POST: /api/hopdong/tao
router.post("/tao", taoHopDongMoi);

// PUT /api/hopdong/thanh-ly/:id
router.put("/thanh-ly/:id", thanhLyHopDong);

// PUT /api/hopdong/gia-han/:id
router.put("/gia-han/:id", giaHanHopDong);

export default router;
