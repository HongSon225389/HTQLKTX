const express = require("express");
const router = express.Router();
const taiKhoanController = require("../controllers/taiKhoanController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  taiKhoanController.getDanhSachNhanVien,
);

//  CÁC ENDPOINT QUẢN TRỊ (Chỉ Admin mới được thao tác)
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN"),
  taiKhoanController.taoTaiKhoan,
);

router.put(
  "/:id/toggle-status",
  authMiddleware.authorize("SUPER_ADMIN"),
  taiKhoanController.toggleTrangThaiTaiKhoan,
);

router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN"),
  taiKhoanController.xoaTaiKhoan,
);

module.exports = router;
