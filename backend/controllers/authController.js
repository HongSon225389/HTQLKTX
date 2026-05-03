// backend/controllers/authController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// API: Đăng nhập
export const dangNhap = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body;

    // 1. Kiểm tra tài khoản có tồn tại không
    const admin = await Admin.findOne({ taiKhoan });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });
    }

    // 2. Kiểm tra mật khẩu (So sánh mk nhập vào với mk đã hash trong DB)
    const matKhauDung = await bcrypt.compare(matKhau, admin.matKhau);
    if (!matKhauDung) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });
    }

    // 3. Nếu đúng, tạo ra Token (chứng minh thư điện tử) có hạn 1 ngày
    // (Lưu ý: JWT_SECRET sẽ được định nghĩa trong file .env)
    const token = jwt.sign(
      { id: admin._id, vaiTro: admin.vaiTro },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Trả về token cho Frontend lưu trữ
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      admin: {
        id: admin._id,
        taiKhoan: admin.taiKhoan,
        hoTen: admin.hoTen,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
