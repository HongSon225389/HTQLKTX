import SinhVien from "../models/SinhVien.js";
import HopDong from "../models/HopDong.js";
import Phong from "../models/Phong.js";

// 1. Lấy danh sách SV hiển thị lên bảng (Kèm theo Hợp đồng nếu có)
export const layDanhSachSV = async (req, res) => {
  try {
    // Lấy tất cả sinh viên và populate thông tin phòng
    const sinhViens = await SinhVien.find()
      .populate("phong")
      .sort({ createdAt: -1 })
      .lean(); // Dùng lean() để có thể chỉnh sửa object kết quả trả về

    // Lấy tất cả hợp đồng đang CÓ HIỆU LỰC
    const hopDongs = await HopDong.find({ trangThai: "Có hiệu lực" }).lean();

    // Gắn thông tin hợp đồng vào từng sinh viên tương ứng
    const ketQua = sinhViens.map((sv) => {
      // Tìm hợp đồng của sinh viên này
      const hdCuaSV = hopDongs.find(
        (hd) => hd.sinhVien.toString() === sv._id.toString(),
      );

      return {
        ...sv,
        phong: sv.phong || hdCuaSV?.phong || null, // Ưu tiên phòng từ SV, nếu không có thì lấy từ hợp đồng, nếu vẫn không có thì null
        hopDong: hdCuaSV || null, // Nếu có thì trả về object hợp đồng, không thì null
      };
    });

    res.status(200).json(ketQua);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách SV", error: error.message });
  }
};

// 2. Đăng ký nội trú (Logic của bạn)
export const dangKyKtx = async (req, res) => {
  try {
    const { maSV, hoTen, ngaySinh, gioiTinh, queQuan } = req.body;

    // 1. Chỉ kiểm tra các thông tin cá nhân bắt buộc
    if (!maSV || !hoTen) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ Mã SV và Họ tên.",
      });
    }

    // 2. Kiểm tra xem sinh viên đã tồn tại chưa
    const sinhVienTonTai = await SinhVien.findOne({ maSV });
    if (sinhVienTonTai) {
      return res
        .status(400)
        .json({ message: "Sinh viên với mã này đã tồn tại!" });
    }

    // 3. Lưu sinh viên mới (Lúc này chưa có phòng nên mặc định phong là null)
    const sinhVienMoi = new SinhVien({
      maSV,
      hoTen,
      ngaySinh,
      gioiTinh,
      queQuan,
      phong: null, // Tách ra để ký hợp đồng sau
    });

    const svDaLuu = await sinhVienMoi.save();

    res.status(201).json({
      message: "Thêm sinh viên thành công! Hãy sang mục Hợp đồng để xếp phòng.",
      data: svDaLuu,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// 3. Hàm xóa sinh viên (Mới)
export const xoaSV = async (req, res) => {
  try {
    const { id } = req.params;
    const sv = await SinhVien.findById(id);
    if (!sv)
      return res.status(404).json({ message: "Không tìm thấy sinh viên!" });

    const phongId = sv.phong;

    // Xóa hợp đồng liên quan và sinh viên
    await HopDong.deleteMany({ sinhVien: id });
    await SinhVien.findByIdAndDelete(id);

    // Cập nhật lại trạng thái phòng
    if (phongId) {
      const soNguoiConLai = await SinhVien.countDocuments({ phong: phongId });
      const phong = await Phong.findById(phongId);
      if (phong) {
        phong.trangThai = soNguoiConLai === 0 ? "Trống" : "Đang ở";
        await phong.save();
      }
    }

    res
      .status(200)
      .json({ message: "Xóa sinh viên và cập nhật phòng thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// 4. Lấy chi tiết hợp đồng của 1 sinh viên
export const layHopDongSV = async (req, res) => {
  try {
    const { id } = req.params; // id của SinhVien
    const hopDong = await HopDong.findOne({ sinhVien: id }).populate("phong");
    if (!hopDong)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });
    res.status(200).json(hopDong);
  } catch (error) {
    res.status(500).json({ message: "Lỗi: " + error.message });
  }
};

// 5. Cập nhật thông tin sinh viên (Xử lý trọn gói việc đổi phòng)
export const capNhatSV = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hoTen,
      ngaySinh,
      gioiTinh,
      queQuan,
      phongId,
      ngayBatDau,
      ngayKetThuc,
      tienCoc,
    } = req.body;

    const svCu = await SinhVien.findById(id);
    if (!svCu)
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });

    const phongCuId = svCu.phong?.toString();

    // --- LOGIC ĐỔI PHÒNG (Nếu phongId gửi lên khác phong hiện tại) ---
    if (phongId && phongId !== phongCuId) {
      // 1. Kiểm tra phòng mới có đủ chỗ không
      const phongMoi = await Phong.findById(phongId).populate("loaiPhong");
      if (!phongMoi)
        return res.status(404).json({ message: "Phòng mới không tồn tại" });

      const soSVPhongMoi = await SinhVien.countDocuments({ phong: phongId });
      if (soSVPhongMoi >= phongMoi.loaiPhong.sucChua) {
        return res.status(400).json({ message: "Phòng mới đã đầy!" });
      }

      // 2. Cập nhật phòng cũ (Giảm người)
      if (phongCuId) {
        const countCu = await SinhVien.countDocuments({ phong: phongCuId });
        // Vì SV này sắp đi, nên count thực tế sẽ là count - 1
        await Phong.findByIdAndUpdate(phongCuId, {
          trangThai: countCu - 1 <= 0 ? "Trống" : "Đang ở",
        });
      }

      // 3. Cập nhật phòng mới (Tăng người)
      phongMoi.trangThai =
        soSVPhongMoi + 1 === phongMoi.loaiPhong.sucChua ? "Đã đầy" : "Đang ở";
      await phongMoi.save();

      // 4. Cập nhật lại phòng trong Hợp đồng
      await HopDong.findOneAndUpdate({ sinhVien: id }, { phong: phongId });
    }

    // --- CẬP NHẬT THÔNG TIN SINH VIÊN ---
    const svCapNhat = await SinhVien.findByIdAndUpdate(
      id,
      { hoTen, ngaySinh, gioiTinh, queQuan, phong: phongId },
      { new: true },
    );

    // Cập nhật thêm các trường phụ trong hợp đồng nếu có gửi lên
    await HopDong.findOneAndUpdate(
      { sinhVien: id },
      { ngayBatDau, ngayKetThuc, tienCoc },
    );

    res.status(200).json({ message: "Cập nhật thành công", data: svCapNhat });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật: " + error.message });
  }
};
