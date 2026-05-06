import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    taiKhoan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    matKhau: {
      type: String,
      required: true,
    },
    hoTen: {
      type: String,
      required: true,
    },
    vaiTro: {
      type: String,
      default: "Quản trị viên",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
