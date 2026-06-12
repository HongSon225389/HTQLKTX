const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const { protect, authorize } = require("../middlewares/auth");

router.post("/login", authController.login);

router.get("/me", protect, authController.getMe);

router.put("/change-password", protect, authController.changePassword);

router.post(
  "/create-user",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  authController.createUser,
);

router.put(
  "/lock/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  authController.lockUser,
);

router.put(
  "/unlock/:id",
  protect,
  authorize("SUPER_ADMIN"),
  authController.unlockUser,
);

module.exports = router;
