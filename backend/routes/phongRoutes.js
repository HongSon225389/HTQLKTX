const express = require("express");

const router = express.Router();

const phongController = require("../controllers/phongController");

const { protect, authorize } = require("../middlewares/auth");

// ====================================
// Chỉ STUDENT
// =====================================
router.get(
  "/my-room",
  protect,
  authorize("STUDENT"),
  phongController.getMyRoom,
);

// =====================================
// PUBLIC
// =====================================

router.get("/", phongController.getAllPhong);

router.get("/:id", phongController.getPhongById);

// =====================================
// MANAGER + SUPERADMIN
// =====================================

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  phongController.createPhong,
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  phongController.updatePhong,
);

router.put(
  "/:id/maintenance",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  phongController.maintenancePhong,
);

router.put(
  "/:id/open",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  phongController.openPhong,
);

// =====================================
// CHỈ SUPERADMIN
// =====================================

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  phongController.deletePhong,
);

module.exports = router;
