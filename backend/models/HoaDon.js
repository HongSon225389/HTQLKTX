// backend/models/HoaDon.js
import mongoose from "mongoose";

const hoaDonSchema = new mongoose.Schema(
  {
    maHD: { type: String, required: true, unique: true, trim: true },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: true,
    },
    loaiHD: {
      type: String,
      required: true,
      enum: ["Tiền phòng", "Điện nước", "Bồi thường", "Khác"], // Phân loại để dễ báo cáo
    },
    kyThanhToan: { type: String, required: true }, // VD: 'Kỳ tháng 4/2026'
    tongTien: { type: Number, required: true },
    trangThai: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán", "Quá hạn"],
      default: "Chưa thanh toán",
    },
  },
  { timestamps: true },
);

export default mongoose.model("HoaDon", hoaDonSchema);
