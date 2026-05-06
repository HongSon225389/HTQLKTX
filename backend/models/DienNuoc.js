import mongoose from "mongoose";

const dienNuocSchema = new mongoose.Schema(
  {
    maDN: { type: String, required: true, unique: true, trim: true },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: true,
    },
    thangNam: { type: String, required: true },
    dienCu: { type: Number, required: true, min: 0 },
    dienMoi: { type: Number, required: true, min: 0 },
    nuocCu: { type: Number, required: true, min: 0 },
    nuocMoi: { type: Number, required: true, min: 0 },
    donGiaDien: { type: Number, required: true, default: 3500 },
    donGiaNuoc: { type: Number, required: true, default: 25000 },
    tienDien: { type: Number },
    tienNuoc: { type: Number },
    tongTien: { type: Number },
    trangThai: {
      type: String,
      enum: ["Chưa chốt", "Đã chốt"],
      default: "Chưa chốt",
    },
  },
  { timestamps: true },
);

export default mongoose.model("DienNuoc", dienNuocSchema);
