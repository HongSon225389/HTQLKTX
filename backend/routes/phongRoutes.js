import express from "express";
import {
  layDanhSachPhong,
  themPhongMoi,
  capNhatPhong,
  xoaPhong,
} from "../controllers/phongController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", xacThucToken, layDanhSachPhong);

router.post("/", xacThucToken, themPhongMoi);

router.put("/:id", xacThucToken, capNhatPhong);

router.delete("/:id", xacThucToken, xoaPhong);

export default router;
