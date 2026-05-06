import express from "express";

import {
  layDanhSachDN,
  chotChiSoDienNuoc,
  xoaDN,
  layChiSoMoiNhat,
} from "../controllers/dienNuocController.js";

import { xacThucToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", xacThucToken, layDanhSachDN);

router.post("/ghi-so", xacThucToken, chotChiSoDienNuoc);

router.delete("/:id", xacThucToken, xoaDN);

router.get("/latest/:phongId", xacThucToken, layChiSoMoiNhat);

export default router;
