const express = require("express");

const router = express.Router();

const sinhVienController = require("../controllers/sinhVienController");

const { protect, authorize } = require("../middlewares/auth");

router.get("/me", protect, authorize("STUDENT"), sinhVienController.getMe);

// =========================
// MANAGER + ADMIN
// =========================

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  sinhVienController.getAllSinhVien,
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  sinhVienController.getSinhVienById,
);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  sinhVienController.createSinhVien,
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  sinhVienController.updateSinhVien,
);

router.put(
  "/:id/chuyen-phong",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  sinhVienController.chuyenPhong,
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  sinhVienController.deleteSinhVien,
);

module.exports = router;
