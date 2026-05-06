import mongoose from "mongoose";

const hopDongSchema = new mongoose.Schema(
  {
    maHD: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sinhVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SinhVien",
      required: true,
    },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: true,
    },
    ngayBatDau: {
      type: Date,
      required: true,
    },
    ngayKetThuc: {
      type: Date,
      required: true,
    },
    tienCoc: {
      type: Number,
      required: true,
      min: 0,
    },

    giaPhongTaiThoiDiemKy: {
      type: Number,
      required: true,
      min: 0,
    },
    trangThai: {
      type: String,
      enum: ["Có hiệu lực", "Hết hạn", "Đã thanh lý"],
      default: "Có hiệu lực",
    },
    daDongTien: {
      type: Boolean,
      default: false,
    },
    ghiChu: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("HopDong", hopDongSchema);
