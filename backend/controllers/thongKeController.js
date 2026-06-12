const HoaDon = require("../models/HoaDon");
const Phong = require("../models/Phong");
const TaiSan = require("../models/TaiSan");
const YeuCauHoTro = require("../models/YeuCauHoTro");
const HopDong = require("../models/HopDong");
const ChiSoDienNuoc = require("../models/ChiSoDienNuoc");

exports.getDashboardData = async (req, res) => {
  try {
    // ==========================================
    // 1. TÍNH TOÁN 8 THẺ THỐNG KÊ (CARDS)
    // ==========================================

    // Thẻ 1: Tổng doanh thu từ trước đến nay (Chỉ tính hóa đơn Đã thanh toán)
    const doanhThuToanBo = await HoaDon.aggregate([
      { $match: { trangThai: "Đã thanh toán" } },
      { $group: { _id: null, tongTien: { $sum: "$tongTien" } } },
    ]);
    const tongDoanhThu =
      doanhThuToanBo.length > 0 ? doanhThuToanBo[0].tongTien : 0;

    // Thẻ 2: Hóa đơn chưa thu (Đếm số đơn chưa thanh toán & Tính tổng số tiền nợ)
    const hoaDonChuaThanhToan = await HoaDon.find({
      trangThai: "Chưa thanh toán",
    });
    const soDonChuaThu = hoaDonChuaThanhToan.length;
    const tongTienNo = hoaDonChuaThanhToan.reduce(
      (sum, hd) => sum + (hd.tongTien || 0),
      0,
    );

    // Thẻ 3 & 4: Phòng trống hoàn toàn & Số chỗ (giường) còn trống
    const tấtCảPhong = await Phong.find().populate("loaiPhong");

    const phongSanSang = tấtCảPhong.filter(
      (p) => p.trangThai !== "Bảo trì" && p.trangThai !== "Sửa chữa",
    );

    const phongDangTrong = phongSanSang.filter(
      (p) => (p.soNguoiHienTai || 0) === 0,
    ).length; // Chỉ tính phòng không bị bảo trì/sửa chữa
    const soChoTrong = phongSanSang.reduce((sum, p) => {
      const sucChuaToiDa =
        p.soNguoiToiDa ||
        p.sucChua ||
        (p.loaiPhong && p.loaiPhong.soNguoiToiDa) ||
        (p.loaiPhong && p.loaiPhong.sucChua) ||
        0;

      const hienTai = p.soNguoiHienTai || 0;

      return sum + Math.max(0, sucChuaToiDa - hienTai);
    }, 0);

    // Thẻ 5 & 6: Tổng số thiết bị tài sản & Số thiết bị hư hỏng
    const tongSoThietBi = await TaiSan.countDocuments();
    const thietBiHuHong = await TaiSan.countDocuments({
      tinhTrang: { $in: ["Hỏng", "Đang sửa chữa"] },
    });

    // Thẻ 7: Yêu cầu sửa chữa chờ xử lý (Khối kỹ thuật)
    const yeuCauChoXuLy = await YeuCauHoTro.countDocuments({
      trangThai: "Chờ xử lý",
      nhomYeuCau: "Kỹ thuật",
    });

    // Thẻ 8: Yêu cầu duyệt đơn hành chính chờ xử lý (Khối hành chính)
    const yeuCauChoDuyet = await YeuCauHoTro.countDocuments({
      trangThai: "Chờ xử lý",
      nhomYeuCau: "Hành chính",
    });

    // ==========================================
    // 2. BIỂU ĐỒ 1: DOANH THU 6 THÁNG GẦN NHẤT
    // ==========================================
    const sauThangTruoc = new Date();
    sauThangTruoc.setMonth(sauThangTruoc.getMonth() - 5);
    sauThangTruoc.setDate(1); // Lùi về ngày đầu tiên của 6 tháng trước

    const doanhThuSauThang = await HoaDon.aggregate([
      {
        $match: {
          trangThai: "Đã thanh toán",
          ngayThanhToan: { $gte: sauThangTruoc },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%Y", date: "$ngayThanhToan" } },
          doanhThuMoiThang: { $sum: "$tongTien" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ==========================================
    // 3. BIỂU ĐỒ 2: ĐIỆN NƯỚC 6 THÁNG GẦN NHẤT
    // ==========================================
    const dienNuocSauThang = await ChiSoDienNuoc.aggregate([
      { $match: { createdAt: { $gte: sauThangTruoc } } },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%Y", date: "$createdAt" } },
          tongDien: { $sum: { $subtract: ["$soDienMoi", "$soDienCu"] } },
          tongNuoc: { $sum: { $subtract: ["$soNuocMoi", "$soNuocCu"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ==========================================
    // 4. BẢNG PHỤ: HỢP ĐỒNG SẮP HẾT HẠN (< 15 NGÀY)
    // ==========================================
    // Lấy tất cả hợp đồng đang ở trạng thái hiệu lực
    const cacHopDongHieuLuc = await HopDong.find({
      trangThai: { $regex: /hiệu lực/i },
    })
      .populate("sinhVien", "hoTen maSV phone")
      .populate("phong", "maPhong toaNha");

    // Tính toán số ngày còn lại (Chuẩn hóa biến ngayKetThuc)
    const hopDongSapHetHan = cacHopDongHieuLuc
      .filter((hd) => {
        if (!hd.ngayKetThuc) return false;

        const han = new Date(hd.ngayKetThuc);
        const homNay = new Date();

        // Tính số ngày chênh lệch giữa ngày kết thúc và ngày hôm nay
        const soNgayConLai = Math.ceil((han - homNay) / (1000 * 60 * 60 * 24));

        // Lọc các hợp đồng có thời hạn còn lại từ 15 ngày trở xuống
        return soNgayConLai <= 15;
      })
      .sort((a, b) => new Date(a.ngayKetThuc) - new Date(b.ngayKetThuc))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        cards: {
          tongDoanhThu,
          soDonChuaThu,
          tongTienNo,
          phongDangTrong,
          soChoTrong,
          tongSoThietBi,
          thietBiHuHong,
          yeuCauChoXuLy,
          yeuCauChoDuyet,
        },
        charts: {
          doanhThu: doanhThuSauThang.map((item) => ({
            name: item._id,
            "Doanh thu": item.doanhThuMoiThang,
          })),
          dienNuoc: dienNuocSauThang.map((item) => ({
            name: item._id,
            "Điện (kWh)": item.tongDien,
            "Nước (m³)": item.tongNuoc,
          })),
        },
        hopDongSapHetHan,
      },
    });
  } catch (error) {
    console.error("Lỗi server tổng hợp dữ liệu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải báo cáo tổng quan!",
    });
  }
};
