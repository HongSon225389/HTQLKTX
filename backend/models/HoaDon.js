const mongoose = require("mongoose");

const hoaDonSchema = new mongoose.Schema(
  {
    maHoaDon: {
      type: String,
      required: [true, "Mã hóa đơn không được rỗng"],
      unique: true,
      trim: true,
    },
    // BỔ SUNG: Gắn hóa đơn vào từng cá nhân sinh viên
    sinhVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SinhVien",
      required: [true, "Hóa đơn phải thuộc về một sinh viên cụ thể"],
    },
    phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: [true, "Hóa đơn phải thuộc về một phòng"],
    },
    chiSoDienNuoc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChiSoDienNuoc",
      required: [true, "Thiếu dữ liệu điện nước"],
    },
    thangNam: {
      type: String,
      required: true,
    },
    loaiHoaDon: {
      type: String,
      enum: ["Tiền phòng", "Điện nước", "Tổng hợp"],
      default: "Tổng hợp",
    },
    tienPhong: {
      type: Number,
      required: true,
      min: 0,
    },
    tienDienNuoc: {
      type: Number,
      required: true,
      min: 0,
    },
    tongTien: {
      type: Number,
      default: 0,
    },
    hanThanhToan: {
      type: Date,
      required: true,
    },
    ngayThanhToan: {
      type: Date,
      default: null,
    },
    trangThai: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },
  },
  {
    timestamps: true,
  },
);

// SỬA INDEX: 1 Sinh viên chỉ có 1 hóa đơn trong 1 tháng
hoaDonSchema.index({ sinhVien: 1, thangNam: 1 }, { unique: true });

// hoaDonSchema.pre("save", function (next) {
//   this.tongTien = this.tienPhong + this.tienDienNuoc;
//   next();
// });
hoaDonSchema.pre("save", function () {
  this.tongTien = this.tienPhong + this.tienDienNuoc;
});
module.exports = mongoose.model("HoaDon", hoaDonSchema);

// const mongoose = require("mongoose");

// const hoaDonSchema = new mongoose.Schema(
//   {
//     maHoaDon: {
//       type: String,
//       required: [true, "Mã hóa đơn không được rỗng"],
//       unique: true,
//       trim: true,
//     },

//     phong: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Phong",
//       required: [true, "Hóa đơn phải thuộc về một phòng"],
//     },

//     chiSoDienNuoc: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ChiSoDienNuoc",
//       required: [true, "Thiếu dữ liệu điện nước"],
//     },

//     thangNam: {
//       type: String,
//       required: true,
//     },

//     loaiHoaDon: {
//       type: String,
//       enum: ["Tiền phòng", "Điện nước", "Tổng hợp"],
//       default: "Tổng hợp",
//     },

//     tienPhong: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     tienDienNuoc: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     tongTien: {
//       type: Number,
//       default: 0,
//     },

//     hanThanhToan: {
//       type: Date,
//       required: true,
//     },

//     ngayThanhToan: {
//       type: Date,
//       default: null,
//     },

//     trangThai: {
//       type: String,
//       enum: ["Chưa thanh toán", "Đã thanh toán"],
//       default: "Chưa thanh toán",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// hoaDonSchema.index(
//   {
//     phong: 1,
//     thangNam: 1,
//   },
//   {
//     unique: true,
//   },
// );

// hoaDonSchema.pre("save", function (next) {
//   this.tongTien = this.tienPhong + this.tienDienNuoc;

//   next();
// });

// module.exports = mongoose.model("HoaDon", hoaDonSchema);
