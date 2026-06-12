const express = require("express");
const router = express.Router();
const cauHinhController = require("../controllers/cauHinhController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

// Lấy danh sách để hiển thị lên Form cài đặt (Ai cũng xem được giá)
router.get("/", cauHinhController.getAllCauHinh);

// Cập nhật giá điện, giá nước (Chỉ Manager hoặc SuperAdmin)
// Sử dụng maCauHinh thay vì ID để Frontend gọi dễ hơn. VD: PUT /api/cauhinh/GIA_DIEN
router.put(
  "/:maCauHinh",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  cauHinhController.updateCauHinh,
);

// Tạo mới cấu hình (Thường chỉ gọi qua Postman lúc setup dự án)
router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN"),
  cauHinhController.taoCauHinh,
);

module.exports = router;
