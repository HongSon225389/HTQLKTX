import express from "express";
import {
  layDanhSachHoaDon,
  thanhToanHoaDon,
  taoHoaDon,
} from "../controllers/hoaDonController.js";

const router = express.Router();

router.get("/", layDanhSachHoaDon);

router.put("/pay/:id", thanhToanHoaDon);

router.post("/tao", taoHoaDon); //
export default router;
