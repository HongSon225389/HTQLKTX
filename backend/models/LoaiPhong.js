// backend/models/LoaiPhong.js
import mongoose from "mongoose";

const loaiPhongSchema = new mongoose.Schema(
  {
    tenLoai: {
      type: String,
      required: true,
      unique: true,
      trim: true, // VD: 'Phòng 4 người', 'Phòng 8 người Vip'
    },
    giaTien: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }, // Tự động thêm createdAt và updatedAt
);

export default mongoose.model("LoaiPhong", loaiPhongSchema);
