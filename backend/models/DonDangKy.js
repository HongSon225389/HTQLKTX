const mongoose = require("mongoose");

const donDangKySchema = new mongoose.Schema(
  {
    maDon: {
      type: String,
      required: [true, "Mã đơn đăng ký là bắt buộc"],
      unique: true,
      trim: true,
    },

    hoTenKhach: {
      type: String,
      required: [true, "Vui lòng nhập họ tên"],
      trim: true,
    },

    maSV: {
      type: String,
      required: [true, "Mã sinh viên là bắt buộc"],
      trim: true,
    },

    ngaySinh: {
      type: Date,
      required: [true, "Vui lòng nhập ngày sinh"],
    },

    gioiTinh: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      required: [true, "Vui lòng chọn giới tính"],
    },

    cccd: {
      type: String,
      required: [true, "CCCD không được để trống"],
      trim: true,
    },

    sdt: {
      type: String,
      required: [true, "Số điện thoại không được để trống"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    loaiPhong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoaiPhong",
      required: [true, "Vui lòng chọn loại phòng"],
    },
    ngayBatDauDuKien: {
      type: Date,
      required: [true, "Vui lòng chọn ngày dự kiến chuyển vào"],
    },
    soThangDangKy: {
      type: Number,
      required: [true, "Vui lòng chọn thời gian lưu trú (số tháng)"],
      min: [1, "Thời gian đăng ký tối thiểu là 1 tháng"],
    },
    trangThai: {
      type: String,
      enum: ["Chờ duyệt", "Đã duyệt", "Từ chối"],
      default: "Chờ duyệt",
    },

    lyDoTuChoi: {
      type: String,
      default: "",
    },

    nguoiDuyet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhanVien",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DonDangKy", donDangKySchema);
