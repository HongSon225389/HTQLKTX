const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// 1. LẤY DANH SÁCH TÀI KHOẢN NỘI BỘ (Trừ Sinh viên)
// ==========================================
exports.getDanhSachNhanVien = async (req, res) => {
  try {
    // Chỉ lấy các tài khoản có quyền Quản lý hoặc Kỹ thuật
    const danhSach = await User.find({
      role: { $in: ["MANAGER", "TECHNICIAN", "SUPER_ADMIN"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: danhSach });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi tải danh sách tài khoản!" });
  }
};

// ==========================================
// 2. TẠO TÀI KHOẢN NHÂN VIÊN MỚI
// ==========================================
exports.taoTaiKhoan = async (req, res) => {
  try {
    const { username, email, password, role, fullName, phone } = req.body;

    // 1. Kiểm tra username hoặc email đã tồn tại chưa
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc Email đã được sử dụng!",
      });
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo tài khoản
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role, // Từ Frontend gửi lên: "MANAGER" hoặc "TECHNICIAN"
      fullName,
      phone,
    });

    // 4. Trả về data
    const dataReturn = { ...newUser._doc };
    delete dataReturn.password;

    res.status(201).json({
      success: true,
      message: `Tạo tài khoản ${role} thành công!`,
      data: dataReturn,
    });
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error);
    res.status(500).json({ success: false, message: "Lỗi tạo tài khoản mới!" });
  }
};

// ==========================================
// 3. KHÓA / MỞ KHÓA TÀI KHOẢN
// ==========================================
exports.toggleTrangThaiTaiKhoan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể tự khóa tài khoản của chính mình!",
      });
    }

    user.trangThai = user.trangThai === "ACTIVE" ? "LOCKED" : "ACTIVE";
    await user.save();

    res.status(200).json({
      success: true,
      message: `Tài khoản đã được ${user.trangThai === "ACTIVE" ? "MỞ KHÓA" : "KHÓA"}!`,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật trạng thái!" });
  }
};

// ==========================================
// 4. XÓA TÀI KHOẢN NỘI BỘ
// ==========================================
exports.xoaTaiKhoan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });
    }

    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Không thể xóa tài khoản SUPER_ADMIN!",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Đã xóa tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi xóa tài khoản!" });
  }
};
