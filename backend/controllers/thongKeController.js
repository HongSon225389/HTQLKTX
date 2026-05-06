import SinhVien from "../models/SinhVien.js";
import Phong from "../models/Phong.js";
import HoaDon from "../models/HoaDon.js";
import DienNuoc from "../models/DienNuoc.js";
import VatTu from "../models/VatTu.js";

export const layThongKeDashboard = async (req, res) => {
  try {
    // 1. TÍNH DOANH THU
    const doanhThu = await HoaDon.aggregate([
      { $match: { trangThai: "Đã thanh toán" } },
      {
        $group: {
          _id: null,
          tong: { $sum: "$tongTien" },
          dien: { $sum: "$tienDien" },
          nuoc: { $sum: "$tienNuoc" },
          phong: { $sum: "$tienPhong" },
        },
      },
    ]);

    // Nếu có dữ liệu thì lấy, không thì gán bằng 0
    const chiTietDoanhThu =
      doanhThu.length > 0
        ? {
            tong: doanhThu[0].tong || 0,
            dien: doanhThu[0].dien || 0,
            nuoc: doanhThu[0].nuoc || 0,
            phong: doanhThu[0].phong || 0,
          }
        : { tong: 0, dien: 0, nuoc: 0, phong: 0 };

    // 2. Các số liệu khác
    const danhSachPhongNo = await HoaDon.distinct("phong", {
      trangThai: "Chưa thanh toán",
      phong: { $ne: null },
    });

    const [tongSinhVien, choConTrong, phongDaDay, tongPhong, thietBiHong] =
      await Promise.all([
        SinhVien.countDocuments(),
        Phong.countDocuments({ trangThai: "Trống" }),
        Phong.countDocuments({ trangThai: "Đã đầy" }),
        Phong.countDocuments(),
        VatTu.countDocuments({ tinhTrang: "Hỏng hóc" }),
      ]);

    res.status(200).json({
      chiTietDoanhThu,
      tongSinhVien,
      thietBiHong,
      choConTrong,
      phongDaDay,
      tongPhong,
      phongNoTien: danhSachPhongNo.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thống kê", error: error.message });
  }
};

export const layDuLieuBieuDo = async (req, res) => {
  try {
    const duLieu = await DienNuoc.aggregate([
      {
        $group: {
          _id: "$thangNam",
          tongDien: { $sum: { $subtract: ["$dienMoi", "$dienCu"] } },
          tongNuoc: { $sum: { $subtract: ["$nuocMoi", "$nuocCu"] } },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: 1 } },
      { $limit: 6 },
    ]);

    const formattedData = duLieu.map((item) => ({
      name: item._id,
      dien: item.tongDien,
      nuoc: item.tongNuoc,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu biểu đồ" });
  }
};
