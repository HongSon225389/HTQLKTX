const CauHinh = require("../models/CauHinh");

// ==========================================
// LẤY DANH SÁCH TẤT CẢ CẤU HÌNH
// ==========================================
exports.getAllCauHinh = async (req, res) => {
  try {
    const cauHinh = await CauHinh.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: cauHinh });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi tải dữ liệu cấu hình!" });
  }
};

// ==========================================
// CẬP NHẬT CẤU HÌNH (Dựa vào maCauHinh)
// ==========================================
exports.updateCauHinh = async (req, res) => {
  try {
    const { giaTri } = req.body;
    const { maCauHinh } = req.params; // Lấy từ URL: /api/cauhinh/GIA_DIEN

    const config = await CauHinh.findOneAndUpdate(
      { maCauHinh: maCauHinh.toUpperCase() },
      { giaTri },
      { new: true, runValidators: true },
    );

    if (!config) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy mã cấu hình này!" });
    }

    res.status(200).json({
      success: true,
      message: `Cập nhật ${config.tenCauHinh} thành công!`,
      data: config,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật cấu hình!" });
  }
};

// ==========================================
// TẠO CẤU HÌNH MỚI (Dành cho Dev/SuperAdmin khởi tạo dữ liệu ban đầu)
// ==========================================
exports.taoCauHinh = async (req, res) => {
  try {
    const { maCauHinh, tenCauHinh, giaTri, moTa } = req.body;

    const exist = await CauHinh.findOne({ maCauHinh: maCauHinh.toUpperCase() });
    if (exist)
      return res
        .status(400)
        .json({ success: false, message: "Mã cấu hình đã tồn tại" });

    const newConfig = await CauHinh.create({
      maCauHinh: maCauHinh.toUpperCase(),
      tenCauHinh,
      giaTri,
      moTa,
    });

    res.status(201).json({ success: true, data: newConfig });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi tạo cấu hình!" });
  }
};
