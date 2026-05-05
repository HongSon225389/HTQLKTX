// backend/controllers/hoaDonController.js
import HoaDon from "../models/HoaDon.js";

// Lấy danh sách toàn bộ hóa đơn (có filter theo phòng hoặc trạng thái)
export const layDanhSachHoaDon = async (req, res) => {
  try {
    const { phongId, trangThai } = req.query; // Lấy tham số từ URL, vd: /api/hoadon?trangThai=Chưa thanh toán

    // Xây dựng bộ lọc linh hoạt
    let query = {};
    if (phongId) query.phong = phongId;
    if (trangThai) query.trangThai = trangThai;

    const danhSach = await HoaDon.find(query).populate("phong", "tenPhong");
    res.status(200).json(danhSach);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách hóa đơn: " + error.message });
  }
};

// Cập nhật trạng thái thanh toán (Khi sinh viên đóng tiền)
export const thanhToanHoaDon = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID hóa đơn

    const hoaDonCapNhat = await HoaDon.findByIdAndUpdate(
      id,
      { trangThai: "Đã thanh toán" },
      { new: true },
    );

    if (!hoaDonCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn này!" });
    }

    res
      .status(200)
      .json({ message: "Thanh toán thành công!", hoaDon: hoaDonCapNhat });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thanh toán: " + error.message });
  }
};

export const taoHoaDon = async (req, res) => {
  try {
    const {
      maHD,
      phong,
      loaiHD,
      kyThanhToan,
      dienCu,
      dienMoi,
      tienDien,
      nuocCu,
      nuocMoi,
      tienNuoc,
      tienPhong, // Đón nhận tiền phòng từ Frontend gửi lên
      tongTien,
    } = req.body;

    // Kiểm tra xem mã hóa đơn đã tồn tại chưa
    const checkTonTai = await HoaDon.findOne({ maHD });
    if (checkTonTai) {
      return res.status(400).json({ message: "Mã hóa đơn này đã tồn tại!" });
    }

    // Tạo hóa đơn mới với đầy đủ các trường chi tiết
    const hoaDonMoi = new HoaDon({
      maHD,
      phong,
      loaiHD,
      kyThanhToan,
      dienCu: dienCu || 0,
      dienMoi: dienMoi || 0,
      tienDien: tienDien || 0,
      nuocCu: nuocCu || 0,
      nuocMoi: nuocMoi || 0,
      tienNuoc: tienNuoc || 0,
      tienPhong: tienPhong || 0, // Lưu tiền phòng vào Database
      tongTien: tongTien, // Tổng tiền (Điện + Nước + Phòng + Khác)
      trangThai: "Chưa thanh toán",
    });

    await hoaDonMoi.save();

    res.status(201).json({
      message: "Tạo hóa đơn thành công!",
      data: hoaDonMoi,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo hóa đơn: " + error.message });
  }
};
