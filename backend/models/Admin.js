// backend/models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    taiKhoan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    matKhau: {
      type: String,
      required: true,
    },
    hoTen: {
      type: String,
      required: true,
    },
    vaiTro: {
      type: String,
      default: "Quản trị viên", // Có thể mở rộng thêm 'Nhân viên', 'Kế toán'... sau này
    },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
