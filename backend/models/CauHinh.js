const mongoose = require("mongoose");

const cauHinhSchema = new mongoose.Schema(
  {
    maCauHinh: {
      type: String,
      required: true,
      unique: true,
      trim: true, // VD: "GIA_DIEN", "GIA_NUOC", "DON_VI_THU_HUONG"
    },
    tenCauHinh: {
      type: String,
      required: true, // VD: "Đơn giá điện (VNĐ/kWh)"
    },
    giaTri: {
      type: String,
      required: true, // Lưu dạng chuỗi, lúc tính toán ép kiểu Number sau
    },
    moTa: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CauHinh", cauHinhSchema);
