const mongoose = require("mongoose");

const hopDongSchema = new mongoose.Schema(
  {
    maHD: {
      type: String,
      required: [true, "Mã hợp đồng là bắt buộc"],
      unique: true,
      trim: true,
    },

    sinhVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SinhVien",
      required: [true, "Hợp đồng phải gắn với một sinh viên"],
    },

    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: [true, "Hợp đồng phải chỉ định phòng thuê"],
    },

    ngayBatDau: {
      type: Date,
      required: [true, "Vui lòng chọn ngày bắt đầu hợp đồng"],
    },

    ngayKetThuc: {
      type: Date,
      required: [true, "Vui lòng chọn ngày kết thúc hợp đồng"],
    },

    tienCoc: {
      type: Number,
      required: [true, "Tiền cọc không được để trống"],
      min: [0, "Tiền cọc không thể là số âm"],
    },

    trangThai: {
      type: String,
      enum: ["Hiệu lực", "Hết hạn", "Đã thanh lý"],
      default: "Hiệu lực",
    },

    ghiChu: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("HopDong", hopDongSchema);
