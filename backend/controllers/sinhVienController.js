// backend/controllers/sinhVienController.js
import SinhVien from "../models/SinhVien.js";
import HopDong from "../models/HopDong.js";
import Phong from "../models/Phong.js";

export const dangKyKtx = async (req, res) => {
  try {
    const {
      maSV,
      hoTen,
      ngaySinh,
      gioiTinh,
      queQuan,
      phongId,
      maHD,
      ngayBatDau,
      ngayKetThuc,
      tienCoc,
    } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào cơ bản
    if (!maSV || !hoTen || !phongId || !maHD) {
      return res.status(400).json({
        message:
          "Vui lòng cung cấp đầy đủ thông tin bắt buộc (Mã SV, Họ tên, Phòng, Mã HĐ).",
      });
    }

    // 2. Kiểm tra Sinh viên đã tồn tại chưa
    const sinhVienTonTai = await SinhVien.findOne({ maSV });
    if (sinhVienTonTai) {
      return res
        .status(400)
        .json({ message: "Sinh viên với mã này đã tồn tại trong hệ thống!" });
    }

    // 3. Kiểm tra Hợp đồng đã tồn tại chưa
    const hopDongTonTai = await HopDong.findOne({ maHD });
    if (hopDongTonTai) {
      return res.status(400).json({ message: "Mã hợp đồng này đã tồn tại!" });
    }

    // 4. Kiểm tra Phòng
    const phong = await Phong.findById(phongId);
    if (!phong) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng được yêu cầu!" });
    }
    if (phong.trangThai !== "Trống") {
      return res.status(400).json({
        message: "Phòng này không khả dụng (đã đầy hoặc đang bảo trì).",
      });
    }

    // --- BẮT ĐẦU TRANSACTION (TẠO DỮ LIỆU) ---

    // 5. Tạo mới Sinh viên
    const sinhVienMoi = new SinhVien({
      maSV,
      hoTen,
      ngaySinh,
      gioiTinh,
      queQuan,
      phong: phongId,
    });
    const sinhVienDaLuu = await sinhVienMoi.save();

    // 6. Tạo mới Hợp đồng và cập nhật Phòng (có cơ chế Rollback)
    try {
      const hopDongMoi = new HopDong({
        maHD,
        sinhVien: sinhVienDaLuu._id,
        phong: phongId,
        ngayBatDau,
        ngayKetThuc,
        tienCoc,
        trangThai: "Có hiệu lực",
        daDongTien: false,
      });
      await hopDongMoi.save();

      // Cập nhật trạng thái phòng thành 'Đã đầy'
      phong.trangThai = "Đã đầy";
      await phong.save();

      return res.status(201).json({
        message: "Đăng ký nội trú ký túc xá thành công!",
        data: {
          sinhVien: sinhVienDaLuu,
          hopDong: hopDongMoi,
        },
      });
    } catch (errHopDong) {
      // ROLLBACK: Xóa sinh viên vừa tạo nếu luồng hợp đồng/phòng gặp lỗi
      await SinhVien.findByIdAndDelete(sinhVienDaLuu._id);
      console.error(
        "Lỗi khi tạo hợp đồng/cập nhật phòng. Đã rollback dữ liệu Sinh viên:",
        errHopDong,
      );
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống khi xử lý hợp đồng. Đã hủy đăng ký." });
    }
  } catch (error) {
    console.error("Lỗi tổng controller đăng ký:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
