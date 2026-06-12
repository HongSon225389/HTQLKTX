const mongoose = require("mongoose");

const sinhVienSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sinh viên phải được liên kết với tài khoản"],
    },

    maSV: {
      type: String,
      required: [true, "Mã sinh viên không được để trống"],
      unique: true,
      trim: true,
    },

    hoTen: {
      type: String,
      required: [true, "Họ và tên không được để trống"],
      trim: true,
    },

    ngaySinh: {
      type: Date,
      required: [true, "Vui lòng nhập ngày sinh"],
    },

    gioiTinh: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      required: true,
    },

    cccd: {
      type: String,
      required: [true, "CCCD không được để trống"],
      unique: true,
    },

    sdt: {
      type: String,
      required: [true, "Số điện thoại không được để trống"],
    },

    email: {
      type: String,
      trim: true,
    },

    queQuan: {
      type: String,
      default: "",
    },

    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      default: null,
    },

    trangThai: {
      type: String,
      enum: ["DANG_O", "DA_ROI", "TOT_NGHIEP"],
      default: "DANG_O",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SinhVien", sinhVienSchema);
