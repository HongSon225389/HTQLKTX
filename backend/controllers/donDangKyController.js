const DonDangKy = require("../models/DonDangKy");
const LoaiPhong = require("../models/LoaiPhong");
const User = require("../models/User");
const SinhVien = require("../models/SinhVien");
const bcrypt = require("bcryptjs");
const NhanVien = require("../models/NhanVien");
const sendEmail = require("../utils/sendEmail");
// ======================================
// GET ALL
// ======================================
exports.getAllDonDangKy = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      keyword,
      trangThai,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { maDon: { $regex: keyword, $options: "i" } },
        { hoTenKhach: { $regex: keyword, $options: "i" } },
        { maSV: { $regex: keyword, $options: "i" } },
        { cccd: { $regex: keyword, $options: "i" } },
      ];
    }

    if (trangThai) {
      query.trangThai = trangThai;
    }

    const total = await DonDangKy.countDocuments(query);

    const data = await DonDangKy.find(query)
      .populate("loaiPhong", "maLoaiPhong tenLoaiPhong sucChua donGia")
      .populate("nguoiDuyet", "maNV hoTen")
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// GET BY ID
// ======================================
exports.getDonDangKyById = async (req, res) => {
  try {
    const don = await DonDangKy.findById(req.params.id)
      .populate("loaiPhong")
      .populate("nguoiDuyet", "maNV hoTen");

    if (!don) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đăng ký" });
    }

    res.status(200).json({ success: true, data: don });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// CREATE (KHÁCH ĐĂNG KÝ)
// ======================================
exports.createDonDangKy = async (req, res) => {
  try {
    const {
      maDon,
      hoTenKhach,
      maSV,
      ngaySinh,
      gioiTinh,
      cccd,
      sdt,
      email,
      loaiPhong,
      ngayBatDauDuKien,
      soThangDangKy,
    } = req.body;

    // Validate trùng mã đơn
    const donExist = await DonDangKy.findOne({ maDon });
    if (donExist) {
      return res
        .status(400)
        .json({ success: false, message: "Mã đơn này đã tồn tại!" });
    }

    // Validate trùng CCCD hoặc mã SV (Tránh việc 1 người gửi nhiều đơn rác)
    const pendingDon = await DonDangKy.findOne({
      $or: [{ cccd }, { maSV }],
      trangThai: "Chờ duyệt",
    });
    if (pendingDon) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã có một đơn đang chờ duyệt!" });
    }

    const loaiPhongExist = await LoaiPhong.findById(loaiPhong);
    if (!loaiPhongExist) {
      return res
        .status(404)
        .json({ success: false, message: "Loại phòng không tồn tại" });
    }

    const don = await DonDangKy.create({
      maDon,
      hoTenKhach,
      maSV,
      ngaySinh,
      gioiTinh,
      cccd,
      sdt,
      email,
      loaiPhong,
      ngayBatDauDuKien,
      soThangDangKy,
    });

    res.status(201).json({
      success: true,
      message:
        "Đăng ký nội trú thành công. Vui lòng chờ ban quản lý duyệt đơn.",
      data: don,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// DUYỆT ĐƠN (TỰ ĐỘNG TẠO TÀI KHOẢN & SINH VIÊN)
// ======================================
exports.approveDonDangKy = async (req, res) => {
  try {
    const don = await DonDangKy.findById(req.params.id);

    if (!don)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đăng ký" });
    if (don.trangThai === "Đã duyệt")
      return res
        .status(400)
        .json({ success: false, message: "Đơn đã được duyệt trước đó" });
    if (don.trangThai === "Từ chối")
      return res
        .status(400)
        .json({ success: false, message: "Không thể duyệt đơn đã bị từ chối" });

    // 1. Kiểm tra xem Sinh viên/User đã tồn tại chưa
    const checkMaSV = await SinhVien.findOne({ maSV: don.maSV });
    const checkCCCD = await SinhVien.findOne({ cccd: don.cccd });
    if (checkMaSV || checkCCCD) {
      return res.status(400).json({
        success: false,
        message:
          "Mã SV hoặc CCCD này đã tồn tại trong hệ thống hồ sơ sinh viên!",
      });
    }

    // 2. Tạo User (Tài khoản)
    const hashedPassword = await bcrypt.hash(don.cccd, 10); // Mật khẩu mặc định là CCCD
    const newUser = await User.create({
      username: don.maSV, // Tên đăng nhập là Mã Sinh Viên
      password: hashedPassword,
      email: don.email || `${don.maSV}@student.com`, // Đảm bảo có email giả nếu khách không nhập
      role: "STUDENT",
    });

    // 3. Tạo Hồ sơ Sinh Viên
    const newSinhVien = await SinhVien.create({
      user: newUser._id,
      maSV: don.maSV,
      hoTen: don.hoTenKhach,
      ngaySinh: don.ngaySinh,
      gioiTinh: don.gioiTinh,
      cccd: don.cccd,
      sdt: don.sdt,
      email: don.email,
    });

    // 4. Cập nhật trạng thái đơn đăng ký
    don.trangThai = "Đã duyệt";

    // Tìm ID Nhân viên dựa trên User ID đang đăng nhập
    if (req.user && req.user._id) {
      const nhanVienDuyet = await NhanVien.findOne({ user: req.user._id });
      if (nhanVienDuyet) {
        don.nguoiDuyet = nhanVienDuyet._id;
      }
    }

    await don.save();
    // ==========================================
    // 5. GỬI EMAIL THÔNG BÁO CHO SINH VIÊN
    // ==========================================
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">Thông Báo Đăng Ký Lưu Trú KTX</h2>
          <p>Chào bạn <b>${don.hoTenKhach}</b>,</p>
          <p>Ban quản lý Ký túc xá xin thông báo: Đơn đăng ký lưu trú của bạn đã được <b>Phê duyệt</b>.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><b>👉 Thông tin tài khoản đăng nhập hệ thống:</b></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li><b>Tên đăng nhập:</b> ${don.maSV}</li>
              <li><b>Mật khẩu mặc định:</b> ${don.cccd}</li>
            </ul>
          </div>
          
          <p>Vui lòng truy cập hệ thống tại: <a href="http://localhost:5173/login" style="color: #2563eb; text-decoration: none;">http://localhost:5173/login</a> để đăng nhập và kiểm tra thông tin hợp đồng.</p>
          <p><i>Lưu ý: Nhớ đổi mật khẩu sau khi đăng nhập lần đầu để bảo mật tài khoản!</i></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">Đây là email tự động, vui lòng không phản hồi lại email này.</p>
        </div>
      `;

      await sendEmail({
        email: don.email,
        subject: "[KTX] THÔNG BÁO DUYỆT ĐƠN VÀ CẤP TÀI KHOẢN",
        html: emailHtml,
      });
      console.log("Đã gửi email thông báo thành công tới:", don.email);
    } catch (emailError) {
      // Nếu gửi mail lỗi (do sai email, mạng lag...) thì chỉ log ra báo lỗi,
      // KHÔNG làm sập hệ thống duyệt đơn.
      console.error("Lỗi khi gửi email:", emailError);
    }
    // ==========================================
    res.status(200).json({
      success: true,
      message: "Duyệt đơn và tự động tạo tài khoản Sinh Viên thành công!",
      data: {
        donDangKy: don,
        taiKhoan: {
          username: newUser.username,
          defaultPassword: "Là số CCCD của sinh viên",
        },
      },
    });
  } catch (error) {
    console.error("Lỗi duyệt đơn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi duyệt đơn!" });
  }
};

// ======================================
// TỪ CHỐI ĐƠN
// ======================================
exports.rejectDonDangKy = async (req, res) => {
  try {
    const { lyDoTuChoi } = req.body;
    const don = await DonDangKy.findById(req.params.id);

    if (!don)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đăng ký" });
    if (don.trangThai === "Đã duyệt")
      return res
        .status(400)
        .json({ success: false, message: "Không thể từ chối đơn đã duyệt" });

    don.trangThai = "Từ chối";
    don.lyDoTuChoi = lyDoTuChoi || "Không đủ điều kiện nội trú";

    if (req.user && req.user._id) {
      const nhanVienDuyet = await NhanVien.findOne({ user: req.user._id });
      if (nhanVienDuyet) don.nguoiDuyet = nhanVienDuyet._id;
    }

    await don.save();
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
          <h2 style="color: #dc2626; text-align: center;">Thông Báo Kết Quả Đăng Ký Lưu Trú</h2>
          <p>Chào bạn <b>${don.hoTenKhach}</b>,</p>
          <p>Ban quản lý Ký túc xá rất tiếc phải thông báo: Đơn đăng ký nội trú của bạn đã bị <b>Từ chối</b>.</p>
          
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0 0 5px 0;"><b>Lý do từ chối:</b></p>
            <p style="margin: 0; color: #991b1b;">${don.lyDoTuChoi}</p>
          </div>
          
          <p>Nếu có thắc mắc, vui lòng liên hệ Ban quản lý Ký túc xá hoặc bộ phận Công tác Sinh viên để được giải đáp chi tiết.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">Đây là email tự động, vui lòng không phản hồi lại email này.</p>
        </div>
      `;

      // Hàm sendEmail đã được require ở trên cùng rồi nên gọi luôn
      await sendEmail({
        email: don.email,
        subject: "[KTX] THÔNG BÁO KẾT QUẢ DUYỆT ĐƠN",
        html: emailHtml,
      });
      console.log("Đã gửi email thông báo TỪ CHỐI thành công tới:", don.email);
    } catch (emailError) {
      console.error("Lỗi khi gửi email từ chối:", emailError);
    }
    res.status(200).json({
      success: true,
      message: "Từ chối đơn thành công",
      data: don,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// UPDATE (Chỉ cho phép khi đơn chưa duyệt)
// ======================================
exports.updateDonDangKy = async (req, res) => {
  try {
    const don = await DonDangKy.findById(req.params.id);
    if (!don)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn" });

    // Ràng buộc bảo mật: Không cho sửa đơn đã duyệt hoặc từ chối
    if (don.trangThai !== "Chờ duyệt") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được sửa thông tin đơn đang ở trạng thái Chờ duyệt",
      });
    }

    // Chặn sửa các trường nhạy cảm qua API update thường
    delete req.body.trangThai;
    delete req.body.nguoiDuyet;

    const donUpdated = await DonDangKy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật đơn thành công",
      data: donUpdated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// DELETE
// ======================================
exports.deleteDonDangKy = async (req, res) => {
  try {
    const don = await DonDangKy.findById(req.params.id);

    if (!don)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đăng ký" });

    // Ràng buộc bảo mật: Không cho xóa đơn đã duyệt (để giữ log)
    if (don.trangThai === "Đã duyệt") {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa đơn đã duyệt. Khách đã trở thành sinh viên chính thức.",
      });
    }

    await don.deleteOne();

    res.status(200).json({
      success: true,
      message: "Xóa đơn đăng ký thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
