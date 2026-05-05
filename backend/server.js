import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import phongRoutes from "./routes/phongRoutes.js";
import sinhVienRoutes from "./routes/sinhVienRoutes.js";
import dienNuocRoutes from "./routes/dienNuocRoutes.js";
import hoaDonRoutes from "./routes/hoaDonRoutes.js";
import vatTuRoutes from "./routes/vatTuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { xacThucToken } from "./middlewares/authMiddleware.js";
import taoAdminMacDinh from "./config/setupAdmin.js";
import hopDongRoutes from "./routes/hopDongRoutes.js";
import thongKeRoutes from "./routes/thongKeRoutes.js";
import loaiPhongRoutes from "./routes/loaiPhongRoutes.js";
import logRaVaoRoutes from "./routes/logRaVaoRoutes.js";

// Nạp các biến môi trường từ file .env
dotenv.config();

// Kích hoạt kết nối đến MongoDB
connectDB();

// Tự động tạo tài khoản Admin mặc định nếu chưa có ai trong DB
taoAdminMacDinh();

const app = express();

// Middlewares
app.use(cors()); // Xử lý lỗi bảo mật CORS khi gọi API chéo domain
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ body của request

// Gắn route API đăng nhập (đăng nhập, tạo admin)
app.use("/api/auth", authRoutes);

// Gắn route API quản lý phòng
app.use("/api/phong", xacThucToken, phongRoutes);
// Gắn route API quản lý sinh viên
app.use("/api/sinhvien", xacThucToken, sinhVienRoutes);
// Gắn route API quản lý điện nước
app.use("/api/dien-nuoc", xacThucToken, dienNuocRoutes);
// Gắn route API quản lý hóa đơn
app.use("/api/hoadon", xacThucToken, hoaDonRoutes);
// Gắn route API quản lý vật tư
app.use("/api/vattu", xacThucToken, vatTuRoutes);

// Gắn route API quản lý hợp đồng
app.use("/api/hopdong", xacThucToken, hopDongRoutes);

// Gắn route API thống kê dashboard
app.use("/api/thong-ke", xacThucToken, thongKeRoutes);

// Gắn route API quản lý loại phòng
app.use("/api/loaiphong", xacThucToken, loaiPhongRoutes);

// Gắn route API quản lý log ra vào
app.use("/api/log-ra-vao", logRaVaoRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
