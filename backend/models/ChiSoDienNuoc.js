const mongoose = require("mongoose");

const chiSoDienNuocSchema = new mongoose.Schema(
  {
    maCS: {
      type: String,
      required: [true, "Mã chốt số là bắt buộc"],
      unique: true,
      trim: true,
    },

    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: [true, "Vui lòng chọn phòng để chốt số"],
    },

    thangNam: {
      type: String,
      required: [true, "Kỳ chốt số là bắt buộc"],
    },

    soDienCu: {
      type: Number,
      required: [true, "Thiếu chỉ số điện cũ"],
      min: 0,
    },

    soDienMoi: {
      type: Number,
      required: [true, "Thiếu chỉ số điện mới"],
      min: 0,
    },

    soNuocCu: {
      type: Number,
      required: [true, "Thiếu chỉ số nước cũ"],
      min: 0,
    },

    soNuocMoi: {
      type: Number,
      required: [true, "Thiếu chỉ số nước mới"],
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Tạo index để không bị chốt trùng phòng trong cùng 1 tháng
chiSoDienNuocSchema.index(
  {
    phong: 1,
    thangNam: 1,
  },
  {
    unique: true,
  },
);

chiSoDienNuocSchema.pre("save", function () {
  if (this.soDienMoi < this.soDienCu) {
    throw new Error("Chỉ số điện mới không được nhỏ hơn chỉ số cũ!");
  }

  if (this.soNuocMoi < this.soNuocCu) {
    throw new Error("Chỉ số nước mới không được nhỏ hơn chỉ số cũ!");
  }
});

module.exports = mongoose.model("ChiSoDienNuoc", chiSoDienNuocSchema);
