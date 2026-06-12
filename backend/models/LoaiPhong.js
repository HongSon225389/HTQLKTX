const mongoose = require("mongoose");

const loaiPhongSchema = new mongoose.Schema(
  {
    maLoaiPhong: {
      type: String,
      required: [true, "Vui lòng nhập mã loại phòng"],
      unique: true,
      trim: true,
    },

    tenLoaiPhong: {
      type: String,
      required: [true, "Vui lòng nhập tên loại phòng"],
      trim: true,
    },

    sucChua: {
      type: Number,
      required: [true, "Sức chứa không được để trống"],
      min: [1, "Sức chứa tối thiểu là 1 người"],
    },

    donGia: {
      type: Number,
      required: [true, "Đơn giá không được để trống"],
      min: [0, "Đơn giá không hợp lệ"],
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

module.exports = mongoose.model("LoaiPhong", loaiPhongSchema);
