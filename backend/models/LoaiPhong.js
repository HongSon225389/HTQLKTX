import mongoose from "mongoose";

const loaiPhongSchema = new mongoose.Schema(
  {
    tenLoai: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    giaTien: {
      type: Number,
      required: true,
      min: 0,
    },
    sucChua: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("LoaiPhong", loaiPhongSchema);
