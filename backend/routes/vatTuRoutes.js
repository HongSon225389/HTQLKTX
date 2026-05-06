import express from "express";
import {
  layDanhSachVatTu,
  themVatTu,
  capNhatTinhTrang,
  xoaVatTu,
} from "../controllers/vatTuController.js";
import { xacThucToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", xacThucToken, layDanhSachVatTu);

router.post("/tao", xacThucToken, themVatTu);

router.put("/sua/:id", xacThucToken, capNhatTinhTrang);

router.delete("/xoa/:id", xacThucToken, xoaVatTu);

export default router;
