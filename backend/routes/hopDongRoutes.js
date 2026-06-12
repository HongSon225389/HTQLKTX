const express = require("express");
const router = express.Router();

const hopdongController = require("../controllers/hopDongController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

router.get(
  "/me",
  authMiddleware.authorize("STUDENT"),
  hopdongController.getMyHopDong,
);

// 1. Lấy danh sách hợp đồng
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hopdongController.getDanhSachHopDong,
);

// 2. Lấy chi tiết hợp đồng
router.get(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hopdongController.getHopDongById,
);

// 3. Gia hạn hợp đồng
router.put(
  "/:id/giahan",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hopdongController.giaHanHopDong,
);

// 4. Tạo hợp đồng mới
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hopdongController.taoHopDong,
);

// 5. Thanh lý hợp đồng
router.put(
  "/:id/thanhly",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  hopdongController.thanhLyHopDong,
);

// 6. Xóa hẳn hợp đồng
router.delete(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN"),
  hopdongController.xoaHopDong,
);

module.exports = router;
