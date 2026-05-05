import mongoose from "mongoose";

const sinhVienSchema = new mongoose.Schema(
  {
    maSV: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hoTen: {
      type: String,
      required: true,
      trim: true,
    },
    ngaySinh: {
      type: Date,
    },
    gioiTinh: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Nam",
    },
    queQuan: {
      type: String,
    },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("SinhVien", sinhVienSchema);
