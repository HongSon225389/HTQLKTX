const mongoose = require("mongoose");

const nhanVienSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Nhân viên phải được gắn với tài khoản"],
    },

    maNV: {
      type: String,
      required: [true, "Mã nhân viên là bắt buộc"],
      unique: true,
      trim: true,
    },

    hoTen: {
      type: String,
      required: [true, "Tên nhân viên là bắt buộc"],
      trim: true,
    },

    sdt: {
      type: String,
      required: [true, "Vui lòng cung cấp số điện thoại"],
    },

    email: {
      type: String,
      trim: true,
    },

    chucVu: {
      type: String,
      enum: ["MANAGER", "TECHNICIAN"],
      required: true,
    },

    trangThai: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("NhanVien", nhanVienSchema);
