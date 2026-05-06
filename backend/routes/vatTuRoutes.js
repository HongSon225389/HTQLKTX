import express from "express";
import {
  layDanhSachVatTu,
  themVatTu,
  capNhatTinhTrang,
  xoaVatTu,
} from "../controllers/vatTuController.js";

const router = express.Router();

router.get("/", layDanhSachVatTu);

router.post("/tao", themVatTu);

router.put("/sua/:id", capNhatTinhTrang);

router.delete("/xoa/:id", xoaVatTu);

export default router;
