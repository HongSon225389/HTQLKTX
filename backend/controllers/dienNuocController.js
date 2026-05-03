// backend/controllers/dienNuocController.js
import DienNuoc from "../models/DienNuoc.js";
import HoaDon from "../models/HoaDon.js";
import Phong from "../models/Phong.js";

export const chotChiSoDienNuoc = async (req, res) => {
  try {
    const {
      phongId,
      thangNam,
      dienCu,
      dienMoi,
      nuocCu,
      nuocMoi,
      donGiaDien = 3500,
      donGiaNuoc = 25000,
    } = req.body;

    // 1. Kiểm tra logic chỉ số nhập vào
    if (dienMoi < dienCu || nuocMoi < nuocCu) {
      return res
        .status(400)
        .json({ message: "Chỉ số mới không được nhỏ hơn chỉ số cũ!" });
    }

    // 2. Kiểm tra xem tháng này phòng đã chốt điện nước chưa
    const daChotThangNay = await DienNuoc.findOne({ phong: phongId, thangNam });
    if (daChotThangNay) {
      return res
        .status(400)
        .json({ message: `Phòng này đã chốt điện nước cho kỳ ${thangNam}!` });
    }

    // 3. Tính toán thành tiền tự động ở Backend (Bảo mật hơn tính ở Frontend)
    const tienDien = (dienMoi - dienCu) * donGiaDien;
    const tienNuoc = (nuocMoi - nuocCu) * donGiaNuoc;
    const tongTienDienNuoc = tienDien + tienNuoc;

    // --- BẮT ĐẦU TRANSACTION ---

    // 4. Lưu phiếu chốt Điện Nước
    const maDN = `DN-${phongId.slice(-4)}-${Date.now()}`; // Tạo mã ngẫu nhiên dựa trên ID phòng và thời gian
    const phieuDienNuoc = new DienNuoc({
      maDN,
      phong: phongId,
      thangNam,
      dienCu,
      dienMoi,
      nuocCu,
      nuocMoi,
      donGiaDien,
      donGiaNuoc,
      tienDien,
      tienNuoc,
      tongTien: tongTienDienNuoc,
      trangThai: "Đã chốt",
    });

    await phieuDienNuoc.save();

    // 5. Tự động sinh ra Hóa Đơn Điện Nước tương ứng
    try {
      const maHD = `HD-${phongId.slice(-4)}-${Date.now()}`;
      const hoaDonMoi = new HoaDon({
        maHD,
        phong: phongId,
        loaiHD: "Điện nước",
        kyThanhToan: thangNam,
        tongTien: tongTienDienNuoc,
        trangThai: "Chưa thanh toán",
      });

      await hoaDonMoi.save();

      res.status(201).json({
        message: "Chốt điện nước và tạo hóa đơn thành công!",
        dienNuoc: phieuDienNuoc,
        hoaDon: hoaDonMoi,
      });
    } catch (errHoaDon) {
      // Rollback: Xóa phiếu điện nước nếu việc tạo hóa đơn bị lỗi
      await DienNuoc.findByIdAndDelete(phieuDienNuoc._id);
      console.error("Lỗi khi tự động tạo hóa đơn:", errHoaDon);
      return res
        .status(500)
        .json({ message: "Lỗi tạo hóa đơn, đã hủy chốt điện nước." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi chốt điện nước: " + error.message });
  }
};
