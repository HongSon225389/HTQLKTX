import express from "express";
import {
  layDanhSachSV,
  dangKyKtx,
  xoaSV,
  layHopDongSV,
  capNhatSV,
} from "../controllers/sinhVienController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", xacThucToken, layDanhSachSV);
router.post("/dang-ky", xacThucToken, dangKyKtx);
router.delete("/:id", xacThucToken, xoaSV);
router.get("/hop-dong/:id", xacThucToken, layHopDongSV);
router.put("/:id", xacThucToken, capNhatSV);
export default router;
