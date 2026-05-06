import express from "express";
import {
  layDanhSachLog,
  taoLogNgauNhien,
  xoaTatCaLog,
} from "../controllers/logRaVaoController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", xacThucToken, layDanhSachLog);
router.post("/random", xacThucToken, taoLogNgauNhien);
router.delete("/clear", xacThucToken, xoaTatCaLog);

export default router;
