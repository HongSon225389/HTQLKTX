const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

// =====================================
// ĐĂNG NHẬP
// POST /api/auth/login
// =====================================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    if (user.trangThai === "LOCKED") {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai mật khẩu",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        trangThai: user.trangThai,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP
// GET /api/auth/me
// =====================================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// ĐỔI MẬT KHẨU
// PUT /api/auth/change-password
// =====================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Tìm user hiện tại
    const user = await User.findById(req.user._id).select("+password");

    // // 2. Kiểm tra mật khẩu cũ xem có khớp không
    // const isMatch = await bcrypt.compare(currentPassword, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Mật khẩu hiện tại không chính xác!",
    //   });
    // }

    // 2. Kiểm tra mật khẩu cũ xem có khớp không
    let isMatch = false;

    // Kiểm tra xem pass trong DB là mã băm hay chữ thường
    if (user.password.startsWith("$2")) {
      // Dùng cho pass đã mã hóa
      isMatch = await bcrypt.compare(currentPassword, user.password);
    } else {
      // Dùng cho pass vẫn là số CCCD gốc
      isMatch = currentPassword === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không chính xác!",
      });
    }

    // 3. Mã hóa mật khẩu mới và lưu lại
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// TẠO USER MỚI
// POST /api/auth/create-user
// =====================================
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existed = await User.findOne({
      username,
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// KHÓA USER
// PUT /api/auth/lock/:id
// =====================================
exports.lockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        trangThai: "LOCKED",
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Khóa tài khoản thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// MỞ KHÓA USER
// PUT /api/auth/unlock/:id
// =====================================
exports.unlockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        trangThai: "ACTIVE",
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Mở khóa tài khoản thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
