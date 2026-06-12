const TaiSan = require("../models/TaiSan");

// =====================================
// 1. LẤY DANH SÁCH TÀI SẢN
// =====================================
exports.getDanhSachTaiSan = async (req, res) => {
  try {
    const {
      keyword = "",
      tinhTrang = "",
      phong = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (keyword) {
      query.$or = [
        { maTS: { $regex: keyword, $options: "i" } },
        { tenTS: { $regex: keyword, $options: "i" } },
      ];
    }
    if (tinhTrang) query.tinhTrang = tinhTrang;

    if (phong) {
      query.phong = phong === "null" ? null : phong;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [danhSachTaiSan, totalRecords] = await Promise.all([
      TaiSan.find(query)
        .populate("phong", "maPhong tenPhong toaNha")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      TaiSan.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: danhSachTaiSan,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalRecords / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách tài sản:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tải dữ liệu tài sản!" });
  }
};

// =====================================
// 2. LẤY CHI TIẾT TÀI SẢN
// =====================================
exports.getTaiSanById = async (req, res) => {
  try {
    const taiSan = await TaiSan.findById(req.params.id).populate(
      "phong",
      "maPhong tenPhong toaNha",
    );
    if (!taiSan) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài sản" });
    }
    res.status(200).json({ success: true, data: taiSan });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi lấy chi tiết tài sản" });
  }
};

// =====================================
// 3. TẠO TÀI SẢN MỚI
// =====================================
exports.taoTaiSan = async (req, res) => {
  try {
    const {
      maTS,
      tenTS,
      phong,
      soLuong,
      tinhTrang,
      ngayMua,
      ngayLapDat,
      ghiChu,
    } = req.body;

    const tsTonTai = await TaiSan.findOne({ maTS });
    if (tsTonTai) {
      return res.status(400).json({
        success: false,
        message: "Mã tài sản này đã tồn tại trong hệ thống!",
      });
    }

    const taiSanMoi = await TaiSan.create({
      maTS,
      tenTS,
      phong: phong || null,
      soLuong,
      tinhTrang,
      ngayMua: ngayMua || null,
      ngayLapDat: phong ? ngayLapDat || null : null,
      ghiChu,
    });

    res.status(201).json({
      success: true,
      message: "Thêm tài sản mới thành công!",
      data: taiSanMoi,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    console.error("Lỗi tạo tài sản:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tạo tài sản!" });
  }
};

// =====================================
// 4. CẬP NHẬT TÀI SẢN
// =====================================
exports.capNhatTaiSan = async (req, res) => {
  try {
    // BẢO MẬT: Nếu là TECHNICIAN, chỉ cho phép sửa 'tinhTrang' và 'ghiChu'
    if (req.user && req.user.role === "TECHNICIAN") {
      const { tinhTrang, ghiChu } = req.body;
      const taiSanUpdated = await TaiSan.findByIdAndUpdate(
        req.params.id,
        { tinhTrang, ghiChu },
        { new: true, runValidators: true },
      ).populate("phong", "maPhong tenPhong");

      if (!taiSanUpdated)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy tài sản này!" });
      if (req.body.phong === "" || req.body.phong === null) {
        req.body.ngayLapDat = null;
      }
      return res.status(200).json({
        success: true,
        message: "Cập nhật tình trạng bảo trì thành công!",
        data: taiSanUpdated,
      });
    }

    // NẾU LÀ ADMIN/MANAGER: Xử lý logic check trùng mã và update toàn bộ
    if (req.body.maTS) {
      const checkMaTS = await TaiSan.findOne({
        maTS: req.body.maTS,
        _id: { $ne: req.params.id },
      });
      if (checkMaTS) {
        return res
          .status(400)
          .json({ success: false, message: "Mã tài sản này đã tồn tại!" });
      }
    }

    const taiSanUpdated = await TaiSan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("phong", "maPhong tenPhong");

    if (!taiSanUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài sản này!" });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật tài sản thành công!",
      data: taiSanUpdated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật tài sản!" });
  }
};

// =====================================
// 5. XÓA TÀI SẢN
// =====================================
exports.xoaTaiSan = async (req, res) => {
  try {
    const taiSan = await TaiSan.findById(req.params.id);
    if (!taiSan) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài sản!" });
    }

    if (taiSan.tinhTrang !== "Thanh lý" && taiSan.phong) {
      return res.status(400).json({
        success: false,
        message:
          "Tài sản đang được sử dụng ở phòng. Vui lòng thu hồi về kho hoặc chuyển trạng thái Thanh lý trước khi xóa hẳn khỏi DB!",
      });
    }

    await taiSan.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Đã xóa bản ghi tài sản thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa tài sản!" });
  }
};
