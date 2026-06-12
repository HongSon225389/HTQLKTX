const express = require("express");
const router = express.Router();
const cauHinhController = require("../controllers/cauHinhController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware.protect);

router.get("/", cauHinhController.getAllCauHinh);

router.put(
  "/:maCauHinh",
  authMiddleware.authorize("SUPER_ADMIN", "MANAGER"),
  cauHinhController.updateCauHinh,
);

router.post(
  "/",
  authMiddleware.authorize("SUPER_ADMIN"),
  cauHinhController.taoCauHinh,
);

module.exports = router;
