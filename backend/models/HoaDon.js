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
      enum: ["Tiền phòng", "Điện nước", "Bồi thường", "Khác"],
    },
    kyThanhToan: { type: String, required: true },

    // --- CÁC TRƯỜNG BỔ SUNG ĐỂ LƯU CHI TIẾT CHỈ SỐ ---
    dienCu: { type: Number, default: 0 },
    dienMoi: { type: Number, default: 0 },
    tienDien: { type: Number, default: 0 },

    nuocCu: { type: Number, default: 0 },
    nuocMoi: { type: Number, default: 0 },
    tienNuoc: { type: Number, default: 0 },

    tienPhong: { type: Number, default: 0 },
    // ----------------------------------------------

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
