const mongoose = require("mongoose");

const phongSchema = new mongoose.Schema(
  {
    maPhong: {
      type: String,
      required: [true, "Mã phòng là bắt buộc"],
      unique: true,
      trim: true,
    },

    tenPhong: {
      type: String,
      required: [true, "Tên phòng là bắt buộc"],
      trim: true,
    },

    toaNha: {
      type: String,
      required: [true, "Vui lòng chỉ định tòa nhà"],
      trim: true,
    },

    tang: {
      type: Number,
      required: [true, "Vui lòng nhập số tầng"],
      min: 1,
    },

    loaiPhong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoaiPhong",
      required: [true, "Phòng phải thuộc một loại phòng"],
    },

    soNguoiHienTai: {
      type: Number,
      default: 0,
      min: 0,
    },

    trangThai: {
      type: String,
      enum: ["Trống", "Đang ở", "Đầy", "Bảo trì", "Ngừng hoạt động"],
      default: "Trống",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    moTa: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
phongSchema.index({ toaNha: 1, tenPhong: 1 }, { unique: true });
module.exports = mongoose.model("Phong", phongSchema);
