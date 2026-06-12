const express = require("express");

const router = express.Router();

const loaiPhongController = require("../controllers/loaiPhongController");

const { protect, authorize } = require("../middlewares/auth");

// =========================
// Public
// =========================

// Khách xem được danh sách loại phòng
router.get("/", loaiPhongController.getAllLoaiPhong);

// Khách xem chi tiết loại phòng
router.get("/:id", loaiPhongController.getLoaiPhongById);

// =========================
// Manager + SuperAdmin
// =========================

// Thêm loại phòng
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  loaiPhongController.createLoaiPhong,
);

// Cập nhật loại phòng
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  loaiPhongController.updateLoaiPhong,
);

// Ngừng sử dụng loại phòng
router.put(
  "/:id/deactivate",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  loaiPhongController.deactivateLoaiPhong,
);

// Kích hoạt lại loại phòng
router.put(
  "/:id/activate",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  loaiPhongController.activateLoaiPhong,
);

module.exports = router;
