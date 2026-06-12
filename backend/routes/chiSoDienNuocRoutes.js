const express = require("express");
const router = express.Router();

const ChiSoDienNuocController = require("../controllers/chiSoDienNuocController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.getDanhSachDienNuoc,
);

router.get(
  "/moinhat/:phong",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.getChiSoMoiNhatCuaPhong,
);

router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.chotSoDienNuoc,
);

router.put(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.capNhatChiSo,
);

router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.xoaChiSo,
);

module.exports = router;
