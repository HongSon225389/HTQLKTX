const mongoose = require("mongoose");

const taiSanSchema = new mongoose.Schema(
  {
    maTS: {
      type: String,
      required: [true, "Mã tài sản không được rỗng"],
      unique: true,
      trim: true,
    },

    tenTS: {
      type: String,
      required: [true, "Vui lòng nhập tên tài sản"],
      trim: true,
    },

    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      default: null,
    },

    soLuong: {
      type: Number,
      default: 1,
      min: 1,
    },

    tinhTrang: {
      type: String,
      enum: ["Tốt", "Hỏng", "Đang sửa chữa", "Thanh lý"],
      default: "Tốt",
    },

    ngayMua: {
      type: Date,
      default: null,
    },
    ngayLapDat: {
      type: Date,
      default: null, // Sẽ mang giá trị null nếu để trong kho
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

module.exports = mongoose.model("TaiSan", taiSanSchema);
