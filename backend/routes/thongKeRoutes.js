const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongKeController");
const authMiddleware = require("../middlewares/auth");

// Route lấy dữ liệu Dashboard (Chỉ Admin và Manager được xem)
router.get(
  "/tong-quan",
  authMiddleware.protect,
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  thongKeController.getDashboardData,
);

module.exports = router;
