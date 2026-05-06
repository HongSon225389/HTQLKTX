import express from "express";
import {
  layDanhSachHoaDon,
  thanhToanHoaDon,
  taoHoaDon,
} from "../controllers/hoaDonController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", xacThucToken, layDanhSachHoaDon);

router.put("/pay/:id", xacThucToken, thanhToanHoaDon);

router.post("/tao", xacThucToken, taoHoaDon);
export default router;
