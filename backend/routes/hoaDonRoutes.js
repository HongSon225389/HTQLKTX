const express = require("express");
const router = express.Router();

const hoadonController = require("../controllers/hoadonController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "STUDENT"),
  hoadonController.getDanhSachHoaDon,
);

router.get(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "STUDENT"),
  hoadonController.getHoaDonById,
);

// 1. Lập hóa đơn mới (Chỉ Admin/Manager)
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hoadonController.taoHoaDon,
);

// 2. Xác nhận thu tiền (Chỉ Admin/Manager)
router.put(
  "/:id/thanhtoan",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hoadonController.xacNhanThanhToan,
);

// 3. Xóa hóa đơn (Chỉ Admin cấp cao)
router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN"),
  hoadonController.xoaHoaDon,
);

module.exports = router;
