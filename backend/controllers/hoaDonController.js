const HoaDon = require("../models/HoaDon");
const ChiSoDienNuoc = require("../models/ChiSoDienNuoc");
const Phong = require("../models/Phong");
const CauHinh = require("../models/CauHinh");
const SinhVien = require("../models/SinhVien");

// =====================================
// 1. LẤY DANH SÁCH HÓA ĐƠN
// =====================================
exports.getDanhSachHoaDon = async (req, res) => {
  try {
    const {
      keyword = "",
      trangThai = "",
      phong = "",
      thangNam = "",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (keyword) query.maHoaDon = { $regex: keyword, $options: "i" };
    if (trangThai) query.trangThai = trangThai;
    if (phong) query.phong = phong;
    if (thangNam) query.thangNam = thangNam;

    // BẢO MẬT CHẶT CHẼ: Nếu là Sinh viên, chỉ lấy hóa đơn của chính họ
    if (req.user && req.user.role === "STUDENT") {
      const svInfo = await SinhVien.findOne({ user: req.user._id });
      if (!svInfo) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy hồ sơ sinh viên!" });
      }
      query.sinhVien = svInfo._id; // Ép thêm điều kiện vào câu query
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [danhSachHoaDon, totalRecords] = await Promise.all([
      HoaDon.find(query)
        .populate("phong", "maPhong tenPhong toaNha")
        .populate("sinhVien", "hoTen maSV") // Kéo thêm Tên và Mã SV để hiển thị
        .populate("chiSoDienNuoc", "thangNam soDienMoi soNuocMoi")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      HoaDon.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: danhSachHoaDon,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalRecords / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách hóa đơn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tải dữ liệu hóa đơn!" });
  }
};

// =====================================
// 2. LẤY CHI TIẾT HÓA ĐƠN (Cập nhật QR)
// =====================================
exports.getHoaDonById = async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id)
      .populate("phong", "maPhong tenPhong toaNha")
      .populate("sinhVien", "hoTen maSV email soDienThoai")
      .populate("chiSoDienNuoc");

    if (!hoaDon) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hóa đơn" });
    }

    // Bảo mật: Sinh viên không được xem hóa đơn của người khác
    if (req.user.role === "STUDENT") {
      const svInfo = await SinhVien.findOne({ user: req.user._id });
      if (!svInfo || hoaDon.sinhVien._id.toString() !== svInfo._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xem hóa đơn này!",
        });
      }
    }

    // 1. Lấy đơn giá điện nước để tính toán công thức
    const configDien = await CauHinh.findOne({ maCauHinh: "GIA_DIEN" });
    const configNuoc = await CauHinh.findOne({ maCauHinh: "GIA_NUOC" });
    const donGiaDien = configDien ? Number(configDien.giaTri) : 3500;
    const donGiaNuoc = configNuoc ? Number(configNuoc.giaTri) : 25000;

    // 2. Đếm số người trong phòng để tính bổ đầu người
    const soNguoiChiaDeu = await HoaDon.countDocuments({
      phong: hoaDon.phong._id,
      thangNam: hoaDon.thangNam,
    });

    // 🌟 BỔ SUNG CHÍNH Ở ĐÂY: Lấy thông tin tài khoản ngân hàng từ bảng Cấu hình vừa tạo
    const bankId = await CauHinh.findOne({ maCauHinh: "BANK_ID" });
    const bankAccount = await CauHinh.findOne({ maCauHinh: "BANK_ACCOUNT" });
    const bankName = await CauHinh.findOne({ maCauHinh: "BANK_NAME" });

    res.status(200).json({
      success: true,
      data: hoaDon,
      chiTietTinhToan: {
        donGiaDien,
        donGiaNuoc,
        soNguoiChiaDeu: soNguoiChiaDeu || 1,
        // Đẩy kèm thông tin ngân hàng về cho Frontend render ảnh QR
        thongTinNganHang: {
          bankId: bankId ? bankId.giaTri : "VCB",
          bankAccount: bankAccount ? bankAccount.giaTri : "1028497731",
          bankName: bankName ? bankName.giaTri : "BAN QUAN LY KTX",
        },
      },
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết hóa đơn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi lấy chi tiết hóa đơn" });
  }
};

// =====================================
// 3. TẠO HÓA ĐƠN MỚI (TẠO HÀNG LOẠT)
// =====================================
exports.taoHoaDon = async (req, res) => {
  try {
    const { maHoaDon, phong, chiSoDienNuoc, hanThanhToan } = req.body;

    // 1. Kiểm tra phòng
    const phongData = await Phong.findById(phong).populate("loaiPhong");
    if (!phongData) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thông tin phòng!" });
    }

    // 2. Kiểm tra chỉ số điện nước
    const dienNuoc = await ChiSoDienNuoc.findById(chiSoDienNuoc);
    if (!dienNuoc || dienNuoc.phong.toString() !== phong) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu chốt số không hợp lệ hoặc không khớp với phòng!",
      });
    }

    const thangNam = dienNuoc.thangNam;

    // 3. Tìm toàn bộ sinh viên đang ở trong phòng
    const danhSachSinhVien = await SinhVien.find({ phong: phong });
    if (danhSachSinhVien.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Phòng hiện không có sinh viên nào sinh sống để thu tiền!",
      });
    }

    // 4. Kiểm tra phòng này đã xuất hóa đơn cho tháng đó chưa
    const daCoHoaDon = await HoaDon.findOne({ phong, thangNam });
    if (daCoHoaDon) {
      return res.status(400).json({
        success: false,
        message: `Phòng này đã lập hóa đơn cho kỳ ${thangNam} rồi!`,
      });
    }

    // 5. Lấy đơn giá từ DB
    const configDien = await CauHinh.findOne({ maCauHinh: "GIA_DIEN" });
    const configNuoc = await CauHinh.findOne({ maCauHinh: "GIA_NUOC" });
    const donGiaDien = configDien ? Number(configDien.giaTri) : 3500;
    const donGiaNuoc = configNuoc ? Number(configNuoc.giaTri) : 15000;

    // 6. Tính toán và chia đều (Bổ củi)
    const soDienTieuThu = dienNuoc.soDienMoi - dienNuoc.soDienCu;
    const soNuocTieuThu = dienNuoc.soNuocMoi - dienNuoc.soNuocCu;

    const tongTienDienNuocCuaPhong =
      soDienTieuThu * donGiaDien + soNuocTieuThu * donGiaNuoc;

    // Tiền điện nước 1 người = Tổng tiền phòng chia đều cho số lượng SV
    const tienDienNuoc1Nguoi = Math.round(
      tongTienDienNuocCuaPhong / danhSachSinhVien.length,
    );
    // Tiền phòng (giường) giữ nguyên theo đơn giá của loại phòng
    const tienPhong1Nguoi = phongData.loaiPhong.donGia;

    // 7. Tạo mảng hóa đơn cho từng sinh viên
    const mangHoaDonMoi = danhSachSinhVien.map((sv) => ({
      // Gắn thêm mã SV vào đuôi để đảm bảo mã hóa đơn là DUY NHẤT
      maHoaDon: `${maHoaDon}-${sv.maSV}`,
      sinhVien: sv._id,
      phong: phong,
      chiSoDienNuoc: chiSoDienNuoc,
      thangNam: thangNam,
      loaiHoaDon: "Tổng hợp",
      tienPhong: tienPhong1Nguoi,
      tienDienNuoc: tienDienNuoc1Nguoi,
      // tongTien sẽ tự động được Model tính qua hàm pre("save")
      // Tuy nhiên hàm insertMany sẽ bypass pre("save"), nên ta tính luôn ở đây:
      tongTien: tienPhong1Nguoi + tienDienNuoc1Nguoi,
      hanThanhToan: hanThanhToan,
    }));

    // 8. Insert hàng loạt vào Database
    const ketQua = await HoaDon.insertMany(mangHoaDonMoi);

    res.status(201).json({
      success: true,
      message: `Tạo thành công ${ketQua.length} hóa đơn cho sinh viên phòng ${phongData.maPhong}!`,
    });
  } catch (error) {
    console.error("Lỗi tạo hóa đơn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tạo hóa đơn!" });
  }
};

// =====================================
// 4. XÁC NHẬN THANH TOÁN
// =====================================
exports.xacNhanThanhToan = async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id);
    if (!hoaDon) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hóa đơn!" });
    }

    if (hoaDon.trangThai === "Đã thanh toán") {
      return res.status(400).json({
        success: false,
        message: "Hóa đơn này đã được thanh toán rồi!",
      });
    }

    hoaDon.trangThai = "Đã thanh toán";
    hoaDon.ngayThanhToan = Date.now();

    await hoaDon.save();

    res.status(200).json({
      success: true,
      message: "Xác nhận thanh toán thành công!",
      data: hoaDon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái hóa đơn!",
    });
  }
};

// =====================================
// 5. XÓA HÓA ĐƠN
// =====================================
exports.xoaHoaDon = async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id);
    if (!hoaDon) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hóa đơn!" });
    }

    if (hoaDon.trangThai === "Đã thanh toán") {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa hóa đơn đã thanh toán. Vui lòng liên hệ Admin cấp cao!",
      });
    }

    await hoaDon.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Đã xóa hóa đơn thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa hóa đơn!" });
  }
};
