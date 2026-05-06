import express from "express";
import {
  layDanhSachPhong,
  themPhongMoi,
  capNhatPhong,
  xoaPhong,
} from "../controllers/phongController.js";

const router = express.Router();

router.get("/", layDanhSachPhong);

router.post("/", themPhongMoi);

router.put("/:id", capNhatPhong);

router.delete("/:id", xoaPhong);

export default router;
