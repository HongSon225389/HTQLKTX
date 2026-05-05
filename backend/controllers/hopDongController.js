// backend/controllers/hopDongController.js
import HopDong from "../models/HopDong.js";
import Phong from "../models/Phong.js";
import SinhVien from "../models/SinhVien.js";

// 1. LẤY DANH SÁCH TẤT CẢ HỢP ĐỒNG
export const layDanhSachHopDong = async (req, res) => {
  try {
    const homNay = new Date();

    // 1. Lấy thông số phân trang (Mặc định trang 1, mỗi trang 10 bản ghi)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Tự động cập nhật trạng thái "Hết hạn" (Giữ nguyên logic của bạn)
    const hdHetHan = await HopDong.find({
      trangThai: "Có hiệu lực",
      ngayKetThuc: { $lt: homNay },
    });

    if (hdHetHan.length > 0) {
      for (let hd of hdHetHan) {
        hd.trangThai = "Hết hạn";
        await hd.save();
        if (hd.sinhVien)
          await SinhVien.findByIdAndUpdate(hd.sinhVien, { phong: null });
        if (hd.phong) {
          const soSVConLai = await SinhVien.countDocuments({ phong: hd.phong });
          const phong = await Phong.findById(hd.phong);
          if (phong) {
            phong.trangThai = soSVConLai === 0 ? "Trống" : "Đang ở";
            await phong.save();
          }
        }
      }
    }

    // 3. Tính toán tổng số lượng (Giới hạn tối đa 100 bản ghi gần nhất)
    const totalCount = await HopDong.countDocuments();
    const cappedTotal = totalCount > 100 ? 100 : totalCount;

    // 4. Lấy danh sách hợp đồng theo trang
    const ds = await HopDong.find()
      .populate("sinhVien", "hoTen maSV email")
      .populate("phong", "tenPhong loaiPhong")
      .sort({ createdAt: -1 }) // Mới nhất lên đầu
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: ds,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(cappedTotal / limit),
        totalItems: cappedTotal,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xử lý phân trang: " + error.message });
  }
};

// 2. LẤY CHI TIẾT MỘT HỢP ĐỒNG
export const layChiTietHopDong = async (req, res) => {
  try {
    const hd = await HopDong.findById(req.params.id)
      .populate("sinhVien")
      .populate("phong");
    if (!hd)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });
    res.status(200).json(hd);
  } catch (error) {
    res.status(500).json({ message: "Lỗi: " + error.message });
  }
};

// 3. TẠO HỢP ĐỒNG MỚI (QUAN TRỌNG)
export const taoHopDongMoi = async (req, res) => {
  try {
    const {
      sinhVienId,
      phongId,
      ngayBatDau,
      ngayKetThuc,
      tienCoc,
      daDongTien,
      ghiChu,
    } = req.body;

    // 1. Lấy thông tin phòng và loại phòng để lấy giá tiền thực tế
    const phong = await Phong.findById(phongId).populate("loaiPhong");
    if (!phong) {
      return res.status(404).json({ message: "Phòng không tồn tại!" });
    }

    // 2. Kiểm tra sức chứa hiện tại của phòng (Tránh đăng ký quá tải)
    const soSVHienTai = await SinhVien.countDocuments({ phong: phongId });
    const sucChuaToiDa = phong.loaiPhong?.sucChua || 0;

    if (soSVHienTai >= sucChuaToiDa) {
      return res
        .status(400)
        .json({ message: "Phòng này đã đạt sức chứa tối đa!" });
    }

    // 3. Lấy giá tiền và tạo mã hợp đồng
    const giaThucTe = phong.loaiPhong?.giaTien || 0;
    if (!giaThucTe) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy đơn giá cho loại phòng này!" });
    }

    const maHD = `HD-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // 4. Tạo và lưu Hợp đồng mới
    const hopDongMoi = new HopDong({
      maHD,
      sinhVien: sinhVienId,
      phong: phongId,
      ngayBatDau,
      ngayKetThuc,
      tienCoc,
      giaPhongTaiThoiDiemKy: giaThucTe,
      daDongTien,
      ghiChu,
    });
    await hopDongMoi.save();

    // 5. CẬP NHẬT SINH VIÊN (Đây là bước giúp trang Sinh viên không bị trắng)
    // Phải gán ID phòng vào trường 'phong' của Sinh viên
    await SinhVien.findByIdAndUpdate(sinhVienId, { phong: phongId });

    // 6. CẬP NHẬT TRẠNG THÁI PHÒNG
    // Nếu sau khi thêm, phòng đủ người thì chuyển sang "Đã đầy", ngược lại là "Đang ở"
    phong.trangThai = soSVHienTai + 1 >= sucChuaToiDa ? "Đã đầy" : "Đang ở";
    await phong.save();

    res.status(201).json({
      message: "Tạo hợp đồng thành công! Sinh viên đã được xếp vào phòng.",
      data: hopDongMoi,
    });
  } catch (error) {
    console.error("Lỗi tạo HD:", error);
    res.status(500).json({ message: "Lỗi tạo hợp đồng: " + error.message });
  }
};

// 4. THANH LÝ HỢP ĐỒNG (Hàm cũ bạn đã viết - đã tối ưu)
export const thanhLyHopDong = async (req, res) => {
  try {
    const { id } = req.params;
    const hopDong = await HopDong.findById(id);

    if (!hopDong)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });
    if (hopDong.trangThai === "Đã thanh lý") {
      return res
        .status(400)
        .json({ message: "Hợp đồng đã thanh lý trước đó!" });
    }

    const phongId = hopDong.phong;
    const sinhVienId = hopDong.sinhVien;

    // Cập nhật hợp đồng
    hopDong.trangThai = "Đã thanh lý";
    await hopDong.save();

    // Xóa phòng khỏi sinh viên
    await SinhVien.findByIdAndUpdate(sinhVienId, { phong: null });

    // Cập nhật lại phòng
    const soSVConLai = await SinhVien.countDocuments({ phong: phongId });
    const phong = await Phong.findById(phongId);
    phong.trangThai = soSVConLai === 0 ? "Trống" : "Đang ở";
    await phong.save();

    res.status(200).json({
      message: "Thanh lý thành công!",
      tienCocCanTra: hopDong.tienCoc,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi: " + error.message });
  }
};

// 5. Gia hạn hợp đồng
export const giaHanHopDong = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngayKetThucMoi } = req.body;

    const hopDong = await HopDong.findById(id).populate("phong");
    if (!hopDong)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });

    if (hopDong.trangThai !== "Hết hạn") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể gia hạn hợp đồng đã hết hạn!" });
    }

    // 1. Cập nhật Hợp đồng
    hopDong.ngayKetThuc = ngayKetThucMoi;
    hopDong.trangThai = "Có hiệu lực";
    await hopDong.save();

    // 2. Gán lại phòng cho Sinh viên (Vì khi hết hạn chúng ta đã lỡ gỡ phòng ra)
    await SinhVien.findByIdAndUpdate(hopDong.sinhVien, {
      phong: hopDong.phong._id,
    });

    // 3. Cập nhật lại trạng thái Phòng (Tăng số người ở thực tế)
    const phong = await Phong.findById(hopDong.phong._id).populate("loaiPhong");
    const soSVHienTai = await SinhVien.countDocuments({
      phong: hopDong.phong._id,
    });

    if (phong) {
      phong.trangThai =
        soSVHienTai >= phong.loaiPhong.sucChua ? "Đã đầy" : "Đang ở";
      await phong.save();
    }

    res
      .status(200)
      .json({ message: "Gia hạn hợp đồng thành công!", data: hopDong });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gia hạn: " + error.message });
  }
};
