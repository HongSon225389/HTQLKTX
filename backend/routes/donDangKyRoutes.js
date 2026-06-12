const express = require("express");

const router = express.Router();

const donDangKyController = require("../controllers/donDangKyController");

const { protect, authorize } = require("../middlewares/auth");

// =============================
// PUBLIC
// =============================

// khách đăng ký nội trú
router.post("/", donDangKyController.createDonDangKy);

// =============================
// ADMIN + MANAGER
// =============================

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  donDangKyController.getAllDonDangKy,
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  donDangKyController.getDonDangKyById,
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  donDangKyController.updateDonDangKy,
);

router.put(
  "/:id/approve",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  donDangKyController.approveDonDangKy,
);

router.put(
  "/:id/reject",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  donDangKyController.rejectDonDangKy,
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  donDangKyController.deleteDonDangKy,
);

module.exports = router;
