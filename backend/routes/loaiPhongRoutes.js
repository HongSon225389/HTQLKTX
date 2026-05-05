import express from "express";
import { layDanhSachLoaiPhong } from "../controllers/loaiPhongController.js";

const router = express.Router();

router.get("/", layDanhSachLoaiPhong);

export default router;
