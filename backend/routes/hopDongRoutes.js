import express from "express";
import {
  taoHopDongMoi,
  layDanhSachHopDong,
  thanhLyHopDong,
  layChiTietHopDong,
  giaHanHopDong,
} from "../controllers/hopDongController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", xacThucToken, layDanhSachHopDong);

router.get("/:id", xacThucToken, layChiTietHopDong);

router.post("/tao", xacThucToken, taoHopDongMoi);

router.put("/thanh-ly/:id", xacThucToken, thanhLyHopDong);

router.put("/gia-han/:id", xacThucToken, giaHanHopDong);

export default router;
