import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Nạp các biến môi trường từ file .env
dotenv.config();

// Kích hoạt kết nối đến MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Xử lý lỗi bảo mật CORS khi gọi API chéo domain
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ body của request

// Route cơ sở để kiểm tra server
app.get("/", (req, res) => {
  res.send("API Quản lý Ký túc xá đang hoạt động ổn định!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
