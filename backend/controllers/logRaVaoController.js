import LogRaVao from "../models/LogRaVao.js";
import SinhVien from "../models/SinhVien.js";

// 1. Lấy danh sách (Có tìm kiếm và lọc)
export const layDanhSachLog = async (req, res) => {
  try {
    const { tuKhoa, trangThai } = req.query;
    let query = {};

    if (tuKhoa) query.tenHienThi = { $regex: tuKhoa, $options: "i" };
    if (trangThai && trangThai !== "Tất cả") query.ghiChu = trangThai;

    const ds = await LogRaVao.find(query)
      .populate("phong", "tenPhong")
      .sort({ thoiGianRa: -1 });
    res.status(200).json(ds);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tải dữ liệu log" });
  }
};

// 2. Tạo 20 Log ngẫu nhiên (Mock Data)
export const taoLogNgauNhien = async (req, res) => {
  try {
    const dsSV = await SinhVien.find().populate("phong");
    if (dsSV.length === 0)
      return res
        .status(400)
        .json({ message: "Cần có sinh viên trong hệ thống để tạo mẫu!" });

    const logs = [];
    for (let i = 0; i < 20; i++) {
      const isStranger = Math.floor(Math.random() * 10) === 0;

      const now = new Date();
      const baseDate = new Date(
        now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      );

      const gioRa = 6 + Math.floor(Math.random() * 15);
      baseDate.setHours(gioRa, Math.floor(Math.random() * 60), 0);
      const thoiGianRa = new Date(baseDate);

      let thoiGianVao = null;
      let ghiChu = "Chưa về";

      if (Math.random() > 0.2) {
        const gioVao = gioRa + 1 + Math.floor(Math.random() * 5);
        const vaoDate = new Date(baseDate);
        vaoDate.setHours(gioVao, Math.floor(Math.random() * 60), 0);
        thoiGianVao = new Date(vaoDate);

        // NẾU VỀ SAU 22H ĐÊM -> GHI CHÚ VỀ MUỘN
        if (vaoDate.getHours() >= 22 || vaoDate.getHours() < 5)
          ghiChu = "Về muộn";
        else ghiChu = "Bình thường";
      }

      if (isStranger) {
        logs.push({
          tenHienThi: "Khách vãng lai / Người lạ",
          ghiChu: "Người lạ",
          thoiGianRa,
          thoiGianVao:
            Math.random() > 0.5
              ? new Date(thoiGianRa.getTime() + 2 * 60 * 60 * 1000)
              : null,
        });
      } else {
        const sv = dsSV[Math.floor(Math.random() * dsSV.length)];
        logs.push({
          sinhVien: sv._id,
          tenHienThi: sv.hoTen,
          phong: sv.phong?._id || null,
          thoiGianRa,
          thoiGianVao,
          ghiChu,
        });
      }
    }

    await LogRaVao.insertMany(logs);
    res
      .status(201)
      .json({ message: "Đã tạo 20 bản ghi ngẫu nhiên thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo log: " + error.message });
  }
};

// 3. Xóa trắng dữ liệu
export const xoaTatCaLog = async (req, res) => {
  try {
    await LogRaVao.deleteMany({});
    res.status(200).json({ message: "Đã làm sạch lịch sử ra vào!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa dữ liệu" });
  }
};
