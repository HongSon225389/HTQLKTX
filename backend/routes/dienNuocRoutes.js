import express from "express";
// Import các hàm từ controller
import {
  layDanhSachDN,
  chotChiSoDienNuoc,
  xoaDN,
  layChiSoMoiNhat,
} from "../controllers/dienNuocController.js";
// Import middleware xác thực (để bảo mật API)
import { xacThucToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- ĐỊNH NGHĨA ROUTE API ĐIỆN NƯỚC ---

// 1. Lấy toàn bộ danh sách chốt số (GET /api/diennuoc)
// Dùng để hiển thị lên bảng ở Frontend

router.get("/", xacThucToken, layDanhSachDN);

// 2. Chốt chỉ số mới & Tự động tạo hóa đơn (POST /api/diennuoc/ghi-so)
// Khớp với gọi axios ở Frontend: axios.post(".../api/diennuoc/ghi-so", formData, ...)
router.post("/ghi-so", xacThucToken, chotChiSoDienNuoc);

// 3. Xóa bản ghi chốt số (DELETE /api/diennuoc/:id)
// Dùng khi nhập sai nghiêm trọng cần xóa đi chốt lại
router.delete("/:id", xacThucToken, xoaDN);

// 4. Lấy chỉ số cuối cùng của một phòng
router.get("/latest/:phongId", xacThucToken, layChiSoMoiNhat);

export default router;
