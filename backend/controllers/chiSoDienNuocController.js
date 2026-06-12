const ChiSoDienNuoc = require("../models/ChiSoDienNuoc");
const Phong = require("../models/Phong");

// =====================================
// LẤY DANH SÁCH CHỐT SỐ
// =====================================
exports.getDanhSachDienNuoc = async (req, res) => {
  try {
    const { thangNam = "", phong = "", page = 1, limit = 10 } = req.query; // SỬA: phongId -> phong

    const query = {};
    if (thangNam) query.thangNam = thangNam;
    if (phong) query.phong = phong; // SỬA: phongId -> phong

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [danhSachDienNuoc, totalRecords] = await Promise.all([
      ChiSoDienNuoc.find(query)
        .populate("phong", "maPhong tenPhong toaNha") // SỬA: phongId -> phong
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      ChiSoDienNuoc.countDocuments(query),
    ]);

    res.status(200).json({
      data: danhSachDienNuoc,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalRecords / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách điện nước:", error);
    res.status(500).json({ message: "Lỗi server khi tải dữ liệu điện nước!" });
  }
};

// =====================================
// LẤY CHỈ SỐ MỚI NHẤT CỦA 1 PHÒNG
// =====================================
exports.getChiSoMoiNhatCuaPhong = async (req, res) => {
  try {
    // SỬA Ở ĐÂY: Quét mọi trường hợp tên biến param từ Route
    const phongId = req.params.id || req.params.phongId || req.params.phong;

    if (!phongId) {
      return res.status(400).json({ message: "Thiếu ID phòng!" });
    }

    const chiSoMoiNhat = await ChiSoDienNuoc.findOne({ phong: phongId }).sort({
      createdAt: -1,
    });

    if (!chiSoMoiNhat) {
      return res.status(404).json({ message: "Phòng này chưa từng chốt số!" });
    }

    res.status(200).json(chiSoMoiNhat);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chỉ số mới nhất!" });
  }
};

// =====================================
// CHỐT SỐ ĐIỆN NƯỚC MỚI
// =====================================
exports.chotSoDienNuoc = async (req, res) => {
  try {
    const { maCS, phong, thangNam, soDienCu, soDienMoi, soNuocCu, soNuocMoi } =
      req.body;

    // 1. Kiểm tra mã chốt số đã tồn tại chưa
    const csTonTai = await ChiSoDienNuoc.findOne({ maCS });
    if (csTonTai) {
      return res.status(400).json({ message: "Mã chốt số này đã tồn tại!" });
    }

    // 2. Kiểm tra xem phòng này đã chốt số trong kỳ này chưa
    const daChotTrongThang = await ChiSoDienNuoc.findOne({ phong, thangNam });
    if (daChotTrongThang) {
      return res.status(400).json({
        message: `Phòng này đã được chốt số điện nước cho kỳ ${thangNam} rồi!`,
      });
    }

    // 3. Kiểm tra tính hợp lệ của chỉ số
    if (soDienMoi < soDienCu) {
      return res
        .status(400)
        .json({ message: "Chỉ số điện mới không được nhỏ hơn chỉ số cũ!" });
    }
    if (soNuocMoi < soNuocCu) {
      return res
        .status(400)
        .json({ message: "Chỉ số nước mới không được nhỏ hơn chỉ số cũ!" });
    }

    // BỔ SUNG LOGIC CHẶN CHẶT CHẼ: Lấy bản ghi chốt số gần nhất của phòng này
    const chiSoMoiNhat = await ChiSoDienNuoc.findOne({ phong }).sort({
      createdAt: -1,
    });

    if (chiSoMoiNhat) {
      // 1. Kiểm tra tính liên tục của tháng (VD: 07/2026 phải > 06/2026)
      const parseThangNam = (tn) =>
        parseInt(tn.split("/")[1]) * 100 + parseInt(tn.split("/")[0]);
      if (parseThangNam(thangNam) <= parseThangNam(chiSoMoiNhat.thangNam)) {
        return res.status(400).json({
          success: false,
          message: `Kỳ chốt số mới (${thangNam}) phải diễn ra sau kỳ gần nhất (${chiSoMoiNhat.thangNam})!`,
        });
      }

      // 2. Kiểm tra tính liên tục của Số Điện / Nước (Khớp nối chuỗi)
      if (soDienCu !== chiSoMoiNhat.soDienMoi) {
        return res.status(400).json({
          success: false,
          message: `Chỉ số điện cũ (${soDienCu}) không khớp với chỉ số mới của kỳ trước (${chiSoMoiNhat.soDienMoi})!`,
        });
      }
      if (soNuocCu !== chiSoMoiNhat.soNuocMoi) {
        return res.status(400).json({
          success: false,
          message: `Chỉ số nước cũ (${soNuocCu}) không khớp với chỉ số mới của kỳ trước (${chiSoMoiNhat.soNuocMoi})!`,
        });
      }
    }

    // 4. Lưu vào Database
    const dienNuocMoi = await ChiSoDienNuoc.create({
      maCS,
      phong, // SỬA: phongId -> phong
      thangNam,
      soDienCu,
      soDienMoi,
      soNuocCu,
      soNuocMoi,
    });

    res.status(201).json({
      message: "Chốt số điện nước thành công!",
      data: dienNuocMoi,
    });
  } catch (error) {
    // 1. Bắt lỗi thiếu trường (Validation)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    // 2. Bắt lỗi kẹt index trùng lặp của MongoDB (Mã 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Phòng này đã được chốt số trong kỳ này rồi! Vui lòng kiểm tra lại.",
      });
    }

    // 3. In lỗi ra Terminal để Dev đọc
    console.error("LỖI CHỐT SỐ ĐIỆN NƯỚC THỰC SỰ LÀ:", error);

    // 4. Trả thẳng thông điệp lỗi về cho Frontend để hiển thị lên Toast
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};
// =====================================
// CẬP NHẬT LẠI CHỈ SỐ
// =====================================
exports.capNhatChiSo = async (req, res) => {
  try {
    const { soDienCu, soDienMoi, soNuocCu, soNuocMoi } = req.body;

    // SỬA LOGIC CẬP NHẬT: Lấy bản ghi cũ ra trước để so sánh nếu Frontend không gửi đủ 4 trường
    const oldRecord = await ChiSoDienNuoc.findById(req.params.id);
    if (!oldRecord) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi chốt số này!" });
    }

    const checkDienCu = soDienCu !== undefined ? soDienCu : oldRecord.soDienCu;
    const checkDienMoi =
      soDienMoi !== undefined ? soDienMoi : oldRecord.soDienMoi;
    const checkNuocCu = soNuocCu !== undefined ? soNuocCu : oldRecord.soNuocCu;
    const checkNuocMoi =
      soNuocMoi !== undefined ? soNuocMoi : oldRecord.soNuocMoi;

    if (checkDienMoi < checkDienCu || checkNuocMoi < checkNuocCu) {
      return res
        .status(400)
        .json({ message: "Chỉ số mới không được nhỏ hơn chỉ số cũ!" });
    }

    const chiSoUpdated = await ChiSoDienNuoc.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Cập nhật chỉ số thành công!",
      data: chiSoUpdated,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật chỉ số!" });
  }
};

// =====================================
// XÓA CHỈ SỐ
// =====================================
exports.xoaChiSo = async (req, res) => {
  try {
    const chiSo = await ChiSoDienNuoc.findById(req.params.id);
    if (!chiSo) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi!" });
    }

    await chiSo.deleteOne();
    res.status(200).json({ message: "Đã xóa bản ghi chốt số!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa bản ghi!" });
  }
};
