import mongoose from "mongoose";

const vatTuSchema = new mongoose.Schema(
  {
    maVT: { type: String, required: true, unique: true, trim: true },
    tenVT: { type: String, required: true, trim: true },
    tinhTrang: {
      type: String,
      enum: ["Tốt", "Hỏng hóc", "Đang sửa chữa", "Đã thanh lý"],
      default: "Tốt",
    },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("VatTu", vatTuSchema);
