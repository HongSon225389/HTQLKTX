import express from "express";
import {
  layThongKeDashboard,
  layDuLieuBieuDo,
} from "../controllers/thongKeController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", xacThucToken, layThongKeDashboard);
router.get("/bieu-do", xacThucToken, layDuLieuBieuDo);

export default router;
