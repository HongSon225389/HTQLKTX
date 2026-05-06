import express from "express";
import {
  taoHopDongMoi,
  layDanhSachHopDong,
  thanhLyHopDong,
  layChiTietHopDong,
  giaHanHopDong,
} from "../controllers/hopDongController.js";

const router = express.Router();

router.get("/", layDanhSachHopDong);

router.get("/:id", layChiTietHopDong);

router.post("/tao", taoHopDongMoi);

router.put("/thanh-ly/:id", thanhLyHopDong);

router.put("/gia-han/:id", giaHanHopDong);

export default router;
