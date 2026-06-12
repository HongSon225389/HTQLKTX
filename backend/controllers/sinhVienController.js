const SinhVien = require("../models/SinhVien");
const User = require("../models/User");
const Phong = require("../models/Phong");
const bcrypt = require("bcryptjs");
// =====================================
// GET ALL
// =====================================
exports.getAllSinhVien = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword,
      gioiTinh,
      trangThai,
      phong,
      locPhong, // Lấy biến lọc phòng từ Query
      sort = "-createdAt",
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { maSV: { $regex: keyword, $options: "i" } },
        { hoTen: { $regex: keyword, $options: "i" } },
      ];
    }

    if (gioiTinh) query.gioiTinh = gioiTinh;
    if (trangThai) query.trangThai = trangThai;
    if (phong) query.phong = phong;

    // BỔ SUNG LỌC THEO TÌNH TRẠNG LƯU TRÚ (Hỗ trợ gọi API lọc từ Server sau này)
    if (locPhong === "CO_PHONG") {
      query.phong = { $ne: null };
    } else if (locPhong === "KHONG_PHONG") {
      query.phong = null;
    }

    const total = await SinhVien.countDocuments(query);

    const data = await SinhVien.find(query)
      .populate("user", "username role trangThai")
      // ĐÃ SỬA: populate thêm toaNha để Frontend hiển thị P.101 (Tòa A1)
      .populate("phong", "maPhong tenPhong toaNha")
      .sort(sort);

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET BY ID
// =====================================
exports.getSinhVienById = async (req, res) => {
  try {
    const sinhVien = await SinhVien.findById(req.params.id)
      .populate("user", "username role")
      .populate("phong");

    if (!sinhVien) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sinh viên",
      });
    }

    res.status(200).json({
      success: true,
      data: sinhVien,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// CREATE
// =====================================
exports.createSinhVien = async (req, res) => {
  try {
    const { maSV, hoTen, ngaySinh, gioiTinh, cccd, sdt, email, queQuan } =
      req.body;

    // 1. Kiểm tra trùng lặp thông tin cơ bản
    const existedMaSV = await SinhVien.findOne({ maSV });
    if (existedMaSV) {
      return res
        .status(400)
        .json({ success: false, message: "Mã sinh viên đã tồn tại" });
    }

    const existedCCCD = await SinhVien.findOne({ cccd });
    if (existedCCCD) {
      return res
        .status(400)
        .json({ success: false, message: "CCCD đã tồn tại" });
    }

    // 2. Kiểm tra xem tài khoản User (username = maSV) đã bị ai dùng chưa
    const userExist = await User.findOne({ username: maSV });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đăng nhập cho Mã SV này đã tồn tại",
      });
    }

    // 3. TẠO TÀI KHOẢN MỚI TRONG BẢNG USER
    // Lấy số CCCD làm mật khẩu mặc định và mã hóa nó
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cccd, salt);

    const newUser = await User.create({
      username: maSV,
      password: hashedPassword,
      role: "STUDENT",
      trangThai: "ACTIVE",
    });

    // 4. TẠO HỒ SƠ SINH VIÊN (Lấy ID của newUser vừa tạo gắn vào)
    const sinhVien = await SinhVien.create({
      user: newUser._id,
      maSV,
      hoTen,
      ngaySinh,
      gioiTinh,
      cccd,
      sdt,
      email,
      queQuan,
    });

    res.status(201).json({
      success: true,
      message: "Đã thêm sinh viên và tự động cấp tài khoản thành công!",
      data: sinhVien,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// UPDATE
// =====================================
exports.updateSinhVien = async (req, res) => {
  try {
    // 1. Lấy thông tin sinh viên hiện tại để lấy ID tài khoản (User)
    const currentSinhVien = await SinhVien.findById(req.params.id);
    if (!currentSinhVien) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sinh viên" });
    }

    // 2. Kiểm tra trùng lặp Mã SV và đồng bộ Username
    if (req.body.maSV && req.body.maSV !== currentSinhVien.maSV) {
      const checkMaSV = await SinhVien.findOne({
        maSV: req.body.maSV,
        _id: { $ne: req.params.id },
      });
      if (checkMaSV) {
        return res
          .status(400)
          .json({ success: false, message: "Mã SV đã tồn tại" });
      }

      // ĐỒNG BỘ: Cập nhật luôn username trong bảng User
      await User.findByIdAndUpdate(currentSinhVien.user, {
        username: req.body.maSV,
      });
    }

    // 3. Kiểm tra trùng lặp CCCD
    if (req.body.cccd) {
      const checkCCCD = await SinhVien.findOne({
        cccd: req.body.cccd,
        _id: { $ne: req.params.id },
      });
      if (checkCCCD) {
        return res
          .status(400)
          .json({ success: false, message: "CCCD đã tồn tại" });
      }
    }

    // 4. Ngăn chặn sửa phòng qua API này (phải dùng API chuyển phòng riêng)
    if (req.body.phong) {
      delete req.body.phong;
    }

    // 5. Cập nhật thông tin Sinh Viên
    const sinhVien = await SinhVien.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật sinh viên thành công",
      data: sinhVien,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateRoomStatus = require("../utils/updateRoomStatus");
// =====================================
// CHUYỂN PHÒNG
// =====================================
exports.chuyenPhong = async (req, res) => {
  try {
    const { phongMoi } = req.body;

    const sinhVien = await SinhVien.findById(req.params.id);

    if (!sinhVien) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sinh viên",
      });
    }

    const roomNew = await Phong.findById(phongMoi).populate("loaiPhong");

    if (!roomNew) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng mới",
      });
    }

    // Không cho chuyển vào phòng bảo trì
    if (roomNew.trangThai === "Bảo trì") {
      return res.status(400).json({
        success: false,
        message: "Phòng đang bảo trì",
      });
    }

    // Kiểm tra đầy phòng
    if (roomNew.soNguoiHienTai >= roomNew.loaiPhong.sucChua) {
      return res.status(400).json({
        success: false,
        message: "Phòng đã đầy",
      });
    }

    const phongCu = sinhVien.phong;

    // Giảm phòng cũ
    if (phongCu) {
      await Phong.findByIdAndUpdate(phongCu, {
        $inc: {
          soNguoiHienTai: -1,
        },
      });

      await updateRoomStatus(phongCu);
    }

    // Tăng phòng mới
    await Phong.findByIdAndUpdate(phongMoi, {
      $inc: {
        soNguoiHienTai: 1,
      },
    });

    await updateRoomStatus(phongMoi);

    sinhVien.phong = phongMoi;

    await sinhVien.save();

    res.status(200).json({
      success: true,
      message: "Chuyển phòng thành công",
      data: sinhVien,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// DELETE
// =====================================
exports.deleteSinhVien = async (req, res) => {
  try {
    const sinhVien = await SinhVien.findById(req.params.id);
    if (!sinhVien) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy" });
    }

    // 1. Trừ số người ở phòng cũ (nếu có)
    if (sinhVien.phong) {
      await Phong.findByIdAndUpdate(sinhVien.phong, {
        $inc: { soNguoiHienTai: -1 },
      });
      await updateRoomStatus(sinhVien.phong);
    }

    // 2. Chuyển trạng thái sinh viên thành ĐÃ RỜI, xóa liên kết phòng
    sinhVien.trangThai = "DA_ROI";
    sinhVien.phong = null;
    await sinhVien.save();

    // Tùy chọn: Khóa luôn tài khoản User của sinh viên này
    await User.findByIdAndUpdate(sinhVien.user, { trangThai: "LOCKED" });

    res
      .status(200)
      .json({ success: true, message: "Đã cho sinh viên rời KTX" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user._id có được là nhờ middleware protect
    const sinhVien = await SinhVien.findOne({ user: req.user._id });

    if (!sinhVien) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hồ sơ sinh viên" });
    }

    res.status(200).json({ success: true, data: sinhVien });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
