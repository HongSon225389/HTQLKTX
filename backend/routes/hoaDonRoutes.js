const express = require("express");
const router = express.Router();

const hoadonController = require("../controllers/hoadonController");
const authMiddleware = require("../middlewares/auth");

// Bật màng lọc bảo vệ cho tất cả các route bên dưới
router.use(authMiddleware.protect);

// 1. Lấy danh sách hóa đơn
// (Cả Sinh viên và Admin đều dùng route này, Controller sẽ tự động bóc tách data theo Role)
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "STUDENT"),
  hoadonController.getDanhSachHoaDon,
);

// 2. Lấy chi tiết hóa đơn
router.get(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "STUDENT"),
  hoadonController.getHoaDonById,
);

// 3. Lập hóa đơn mới (Chỉ Admin/Manager)
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hoadonController.taoHoaDon,
);

// 4. Xác nhận thu tiền (Chỉ Admin/Manager)
router.put(
  "/:id/thanhtoan",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hoadonController.xacNhanThanhToan,
);

// 5. Xóa hóa đơn (Chỉ Admin cấp cao)
router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN"),
  hoadonController.xoaHoaDon,
);

module.exports = router;

//=================================

// const express = require("express");
// const router = express.Router();

// const hoadonController = require("../controllers/hoadonController");
// const authMiddleware = require("../middlewares/auth");

// // Bật màng lọc bảo vệ
// router.use(authMiddleware.protect);

// // 1. Lấy danh sách hóa đơn (Sinh viên được phép xem danh sách để lọc hóa đơn của mình)
// router.get(
//   "/",
//   authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "STUDENT"),
//   hoadonController.getDanhSachHoaDon,
// );

// // 2. Lấy chi tiết hóa đơn
// router.get(
//   "/:id",
//   authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "STUDENT"),
//   hoadonController.getHoaDonById,
// );

// // 3. Lập hóa đơn mới
// router.post(
//   "/",
//   authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
//   hoadonController.taoHoaDon,
// );

// // 4. Xác nhận thu tiền
// router.put(
//   "/:id/thanhtoan",
//   authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
//   hoadonController.xacNhanThanhToan,
// );

// // 5. Xóa hóa đơn
// router.delete(
//   "/:id",
//   authMiddleware.authorize("SUPER_ADMIN"),
//   hoadonController.xoaHoaDon,
// );

// module.exports = router;
