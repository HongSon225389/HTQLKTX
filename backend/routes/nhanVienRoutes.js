const express = require("express");
const router = express.Router();

const nhanvienController = require("../controllers/nhanvienController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

// 1. Lấy danh sách nhân viên
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  nhanvienController.getDanhSachNhanVien,
);

// 2. Lấy chi tiết 1 nhân viên
router.get(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  nhanvienController.getNhanVienById,
);

// 3. Tạo nhân viên
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN"),
  nhanvienController.taoNhanVien,
);

// 4. Sửa thông tin
router.put(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  nhanvienController.capNhatNhanVien,
);

// 5. Xóa hồ sơ
router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  nhanvienController.xoaNhanVien,
);

module.exports = router;
