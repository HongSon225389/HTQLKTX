const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 1. Khởi tạo biến môi trường từ file .env
dotenv.config();

// 2. Kết nối Database
connectDB();

// 3. Khởi tạo app Express
const app = express();

// 4. Cài đặt Middlewares
app.use(cors()); // Cho phép Frontend (React/Vue) gọi API ở port khác
app.use(express.json()); // Phân tích body request định dạng JSON
app.use(express.urlencoded({ extended: true })); // Phân tích body x-www-form-urlencoded

// 5. Import các Routes
const authRoutes = require("./routes/authRoutes");
const loaiPhongRoutes = require("./routes/loaiPhongRoutes");
const phongRoutes = require("./routes/phongRoutes");
const sinhVienRoutes = require("./routes/sinhVienRoutes");
const nhanVienRoutes = require("./routes/nhanVienRoutes");
const donDangKyRoutes = require("./routes/donDangKyRoutes");
const hopDongRoutes = require("./routes/hopDongRoutes");
const dienNuocRoutes = require("./routes/chiSoDienNuocRoutes");
const hoaDonRoutes = require("./routes/hoaDonRoutes");
const taiSanRoutes = require("./routes/taiSanRoutes");
const yeuCauHoTroRoutes = require("./routes/yeuCauHoTroRoutes");
const cauHinhRoutes = require("./routes/cauHinhRoutes");
const thongkeRoutes = require("./routes/thongkeRoutes");
const taiKhoanRoutes = require("./routes/taiKhoanRoutes");
const initCronJobs = require("./cron/cleanUpAccounts");
initCronJobs();
// 6. Gắn Routes vào API (Mounting Routes)
app.use("/api/auth", authRoutes);
app.use("/api/loai-phong", loaiPhongRoutes);
app.use("/api/phong", phongRoutes);
app.use("/api/sinh-vien", sinhVienRoutes);
app.use("/api/nhan-vien", nhanVienRoutes);
app.use("/api/don-dang-ky", donDangKyRoutes);
app.use("/api/hop-dong", hopDongRoutes);
app.use("/api/dien-nuoc", dienNuocRoutes);
app.use("/api/hoa-don", hoaDonRoutes);
app.use("/api/tai-san", taiSanRoutes);
app.use("/api/yeu-cau-ho-tro", yeuCauHoTroRoutes);
app.use("/api/cau-hinh", cauHinhRoutes);
app.use("/api/thong-ke", thongkeRoutes);
app.use("/api/tai-khoan", taiKhoanRoutes);
// 7. Middleware xử lý Route không tồn tại (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint này không tồn tại trên server!",
  });
});

// 8. Middleware bắt lỗi Global (500 Internal Server Error)
app.use((err, req, res, next) => {
  console.error("Lỗi Server:", err.stack);
  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau!",
  });
});

// 9. Lắng nghe Port và khởi chạy Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
