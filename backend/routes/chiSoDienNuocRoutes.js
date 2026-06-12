const express = require("express");
const router = express.Router();

const ChiSoDienNuocController = require("../controllers/ChiSoDienNuocController");
const authMiddleware = require("../middlewares/auth");

// Bật màng lọc bảo vệ
router.use(authMiddleware.protect);

// 1. Lấy danh sách chốt số
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.getDanhSachDienNuoc,
);

// SỬA: Đổi :phongId thành :phong VÀ bổ sung middleware authorize
router.get(
  "/moinhat/:phong",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.getChiSoMoiNhatCuaPhong,
);

// 2. Chốt số mới
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.chotSoDienNuoc,
);

// 3. Sửa chỉ số bị sai
router.put(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.capNhatChiSo,
);

// 4. Xóa bản ghi
router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  ChiSoDienNuocController.xoaChiSo,
);

module.exports = router;
