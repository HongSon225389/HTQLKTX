// backend/models/LogRaVao.js
import mongoose from "mongoose";

const logRaVaoSchema = new mongoose.Schema(
  {
    sinhVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SinhVien",
      default: null,
    },
    tenHienThi: { type: String, required: true },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      default: null,
    },
    thoiGianRa: { type: Date, required: true },
    thoiGianVao: { type: Date, default: null }, // Null = Chưa về
    ghiChu: {
      type: String,
      enum: ["Bình thường", "Về muộn", "Người lạ", "Chưa về"],
      default: "Bình thường",
    },
  },
  { timestamps: true },
);

export default mongoose.model("LogRaVao", logRaVaoSchema);
