import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const dangNhap = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body;

    const admin = await Admin.findOne({ taiKhoan });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });
    }

    const matKhauDung = await bcrypt.compare(matKhau, admin.matKhau);
    if (!matKhauDung) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });
    }

    const token = jwt.sign(
      { id: admin._id, vaiTro: admin.vaiTro },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

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
