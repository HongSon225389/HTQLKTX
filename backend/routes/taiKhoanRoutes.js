// const express = require("express");
// const router = express.Router();
// const taiKhoanController = require("../controllers/taiKhoanController");
// const authMiddleware = require("../middlewares/auth");

// // 1. Phải đăng nhập
// router.use(authMiddleware.protect);

// // 2. ÉP BUỘC ROLE: Chỉ duy nhất SUPER_ADMIN mới được thao tác với các API này
// router.use(authMiddleware.authorize("SUPER_ADMIN"));

// // Các endpoint
// router.get("/", taiKhoanController.getDanhSachNhanVien);
// router.post("/", taiKhoanController.taoTaiKhoan);
// router.put("/:id/toggle-status", taiKhoanController.toggleTrangThaiTaiKhoan);
// router.delete("/:id", taiKhoanController.xoaTaiKhoan);

// module.exports = router;
const express = require("express");
const router = express.Router();
const taiKhoanController = require("../controllers/taiKhoanController");
const authMiddleware = require("../middlewares/auth");

// 1. Phải đăng nhập
router.use(authMiddleware.protect);

// (ĐÃ XÓA/COMMENT DÒNG router.use... Ở ĐÂY ĐỂ PHÂN QUYỀN RIÊNG BÊN DƯỚI)

// ==========================================
// 2. CÁC ENDPOINT LẤY DANH SÁCH (Admin và Manager đều được xem)
// ==========================================
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"), // 👉 Mở khóa cho Manager ở đây
  taiKhoanController.getDanhSachNhanVien,
);

// ==========================================
// 3. CÁC ENDPOINT QUẢN TRỊ (Chỉ Admin mới được thao tác)
// ==========================================
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
