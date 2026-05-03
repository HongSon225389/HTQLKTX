// backend/models/SinhVien.js
import mongoose from "mongoose";

const sinhVienSchema = new mongoose.Schema(
  {
    maSV: {
      type: String,
      required: true,
      unique: true,
      trim: true, // VD: '20201234'
    },
    hoTen: {
      type: String,
      required: true,
      trim: true,
    },
    ngaySinh: {
      type: Date,
    },
    gioiTinh: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Nam",
    },
    queQuan: {
      type: String,
    },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong", // Khóa ngoại liên kết tới Phòng
      default: null, // Có thể null nếu sinh viên vừa đăng ký nhưng chưa xếp phòng
    },
  },
  { timestamps: true },
);

export default mongoose.model("SinhVien", sinhVienSchema);
