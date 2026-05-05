// backend/models/Phong.js
import mongoose from "mongoose";

const phongSchema = new mongoose.Schema(
  {
    tenPhong: {
      type: String,
      required: true,
      unique: true,
      trim: true, // VD: '101A', '202B'
    },
    loaiPhong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoaiPhong", // Khóa ngoại liên kết tới file LoaiPhong.js
      required: true,
    },
    trangThai: {
      type: String,
      enum: ["Trống", "Đang ở", "Đã đầy", "Đang sửa"], // Giới hạn các giá trị hợp lệ
      default: "Trống",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Phong", phongSchema);
