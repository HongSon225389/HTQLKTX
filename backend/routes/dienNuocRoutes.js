// backend/routes/dienNuocRoutes.js
import express from "express";
import { chotChiSoDienNuoc } from "../controllers/dienNuocController.js";

const router = express.Router();

router.post("/chot", chotChiSoDienNuoc);

export default router;
