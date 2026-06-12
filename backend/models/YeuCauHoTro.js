const mongoose = require("mongoose");

const yeuCauHoTroSchema = new mongoose.Schema(
  {
    maYC: {
      type: String,
      required: [true, "Mã yêu cầu là bắt buộc"],
      unique: true,
      trim: true,
    },

    sinhVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SinhVien",
      required: [true, "Không xác định được người gửi yêu cầu"],
    },

    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      default: null,
    },

    nhomYeuCau: {
      type: String,
      enum: ["Kỹ thuật", "Hành chính", "Khác"],
      required: [true, "Vui lòng phân loại nhóm yêu cầu"],
    },

    loaiYeuCau: {
      type: String,
      required: [true, "Vui lòng chọn loại yêu cầu cụ thể"],
    },

    tieuDe: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề"],
      trim: true,
    },

    noiDung: {
      type: String,
      required: [true, "Vui lòng mô tả chi tiết"],
    },

    mucDo: {
      type: String,
      enum: ["Bình thường", "Khẩn cấp"],
      default: "Bình thường",
    },

    trangThai: {
      type: String,
      enum: ["Chờ xử lý", "Đang xử lý", "Hoàn thành", "Đã hủy"],
      default: "Chờ xử lý",
    },

    nhanVienXuLy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ghiChuXuLy: {
      type: String,
      default: "",
    },

    ngayHoanThanh: {
      type: Date,
      default: null,
    },

    danhGia: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("YeuCauHoTro", yeuCauHoTroSchema);
