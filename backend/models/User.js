const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Vui lòng nhập tên đăng nhập"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      // unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      select: false,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "MANAGER", "STUDENT", "TECHNICIAN"],
      required: true,
    },

    trangThai: {
      type: String,
      enum: ["ACTIVE", "LOCKED"],
      default: "ACTIVE",
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
