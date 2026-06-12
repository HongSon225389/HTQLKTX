const express = require("express");
const router = express.Router();

const taisanController = require("../controllers/taiSanController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

// 1. Lấy danh sách (Kỹ thuật viên cũng được xem để đi sửa chữa)
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN"),
  taisanController.getDanhSachTaiSan,
);

// 2. Lấy chi tiết tài sản
router.get(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN"),
  taisanController.getTaiSanById,
);

// 3. Thêm mới tài sản
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN"),
  taisanController.taoTaiSan,
);

// 4. Cập nhật (Kỹ thuật viên được phép cập nhật để báo "Đã sửa xong" hoặc "Hỏng")
router.put(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN"),
  taisanController.capNhatTaiSan,
);

// 5. Xóa hẳn khỏi hệ thống
router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN"),
  taisanController.xoaTaiSan,
);

module.exports = router;
