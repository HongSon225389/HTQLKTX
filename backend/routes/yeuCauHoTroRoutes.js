const express = require("express");
const router = express.Router();
const yeuCauController = require("../controllers/yeuCauHoTroController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

// 1. Lấy danh sách (Ai cũng gọi được, Controller tự lo việc phân luồng)
router.get(
  "/",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN", "STUDENT"),
  yeuCauController.getDanhSachYeuCau,
);
router.get(
  "/:id",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN", "STUDENT"),
  yeuCauController.getYeuCauById,
);
router.delete(
  "/:id/huy",
  authMiddleware.authorize("STUDENT"),
  yeuCauController.huyYeuCau,
);
// 2. Tạo yêu cầu mới (Chỉ dành cho Sinh viên)
router.post(
  "/",
  authMiddleware.authorize("STUDENT"),
  yeuCauController.taoYeuCau,
);
router.put(
  "/:id/huy",
  authMiddleware.authorize("STUDENT"),
  yeuCauController.huyYeuCau,
);
// 3. Xử lý yêu cầu (Dành cho khối Nhân sự / Ban quản lý)
router.put(
  "/:id/xu-ly",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER", "TECHNICIAN"),
  yeuCauController.xuLyYeuCau,
);

// 4. Đánh giá chất lượng phục vụ (Dành cho Sinh viên)
router.post(
  "/:id/danh-gia",
  authMiddleware.authorize("STUDENT"),
  yeuCauController.danhGiaYeuCau,
);

module.exports = router;
