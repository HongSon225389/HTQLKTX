import express from "express";
import { dangNhap } from "../controllers/authController.js";

const router = express.Router();

router.post("/dang-nhap", dangNhap);

export default router;
