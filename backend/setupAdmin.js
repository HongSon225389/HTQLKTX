const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createInitialAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối Database...");

    const adminExists = await User.findOne({
      role: "SUPER_ADMIN",
    });

    if (adminExists) {
      console.log("⚠️ SuperAdmin đã tồn tại.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10,
    );

    await User.create({
      username: process.env.SUPER_ADMIN_USERNAME,
      email: process.env.SUPER_ADMIN_EMAIL || "admin@ktx.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      trangThai: "ACTIVE",
    });

    console.log("🎉 Tạo SuperAdmin thành công! Hệ thống đã sẵn sàng.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi tạo Admin:", error);
    process.exit(1);
  }
};

createInitialAdmin();
