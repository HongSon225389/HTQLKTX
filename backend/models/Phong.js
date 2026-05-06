import mongoose from "mongoose";

const phongSchema = new mongoose.Schema(
  {
    tenPhong: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    loaiPhong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoaiPhong",
      required: true,
    },
    trangThai: {
      type: String,
      enum: ["Trống", "Đang ở", "Đã đầy", "Đang sửa"],
      default: "Trống",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Phong", phongSchema);
