const Phong = require("../models/Phong");
const LoaiPhong = require("../models/LoaiPhong");
const SinhVien = require("../models/SinhVien");
const updateRoomStatus = require("../utils/updateRoomStatus");
// ==================================================
// GET ALL PHONG
// ==================================================
exports.getAllPhong = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      keyword,
      toaNha,
      tang,
      loaiPhong,
      trangThai,
      sort = "-createdAt",
    } = req.query;

    const query = { isDeleted: false };

    // tìm kiếm mã phòng hoặc tên phòng
    if (keyword) {
      query.$or = [
        {
          maPhong: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          tenPhong: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    if (toaNha) {
      query.toaNha = toaNha;
    }

    if (tang) {
      query.tang = Number(tang);
    }

    if (loaiPhong) {
      query.loaiPhong = loaiPhong;
    }

    if (trangThai) {
      query.trangThai = trangThai;
    }

    const total = await Phong.countDocuments(query);

    const data = await Phong.find(query)
      .populate("loaiPhong", "maLoaiPhong tenLoaiPhong sucChua donGia")
      .sort(sort)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// GET PHONG BY ID (KÈM DANH SÁCH SINH VIÊN BÊN TRONG)
// ==================================================
exports.getPhongById = async (req, res) => {
  try {
    // 1. Lấy thông tin cơ bản của Phòng
    const phong = await Phong.findById(req.params.id).populate(
      "loaiPhong",
      "maLoaiPhong tenLoaiPhong sucChua donGia",
    );

    if (!phong) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }

    // 2. Tìm tất cả sinh viên đang ở trong phòng này
    const danhSachSinhVien = await SinhVien.find({
      phong: req.params.id,
      trangThai: { $ne: "DA_ROI" }, // Bỏ qua những bạn đã chuyển đi
    }).select("maSV hoTen cccd sdt email");

    // 3. Trộn kết quả lại và gửi về Frontend
    // Dùng .toObject() để biến phong từ Mongoose Document thành JSON thường mới gắn thêm thuộc tính được
    const phongData = phong.toObject();
    phongData.danhSachSinhVien = danhSachSinhVien;

    res.status(200).json({
      success: true,
      data: phongData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// CREATE PHONG
// ==================================================
exports.createPhong = async (req, res) => {
  try {
    const { maPhong, tenPhong, toaNha, tang, loaiPhong, moTa } = req.body;

    const existed = await Phong.findOne({ maPhong });
    if (existed) {
      return res
        .status(400)
        .json({ success: false, message: "Mã phòng đã tồn tại" });
    }

    const loaiPhongExist = await LoaiPhong.findById(loaiPhong);
    if (!loaiPhongExist) {
      return res
        .status(404)
        .json({ success: false, message: "Loại phòng không tồn tại" });
    }

    // ĐỒNG BỘ: Gán mặc định ban đầu khi tạo phòng
    const phong = await Phong.create({
      maPhong,
      tenPhong,
      toaNha,
      tang,
      loaiPhong,
      moTa,
      soNguoiHienTai: 0,
      trangThai: "Trống", // Luôn luôn là Trống khi mới tạo
    });

    res.status(201).json({
      success: true,
      message: "Thêm phòng thành công",
      data: phong,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// UPDATE PHONG
// ==================================================
exports.updatePhong = async (req, res) => {
  try {
    if (req.body.maPhong) {
      const existed = await Phong.findOne({
        maPhong: req.body.maPhong,
        _id: { $ne: req.params.id },
      });
      if (existed) {
        return res
          .status(400)
          .json({ success: false, message: "Mã phòng này đã tồn tại" });
      }
    }

    if (req.body.loaiPhong) {
      const loaiPhongExist = await LoaiPhong.findById(req.body.loaiPhong);
      if (!loaiPhongExist) {
        return res
          .status(404)
          .json({ success: false, message: "Loại phòng mới không tồn tại" });
      }
    }

    // CHẶN NGUY HIỂM: Không cho phép sửa đổi số người trực tiếp qua đây
    if (req.body.soNguoiHienTai) {
      delete req.body.soNguoiHienTai;
    }

    // 1. Thực hiện cập nhật các thông tin Admin thay đổi
    let phong = await Phong.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!phong) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phòng" });
    }

    // 2. ĐỒNG BỘ TRẠNG THÁI: Gọi helper tính toán lại trạng thái tự động
    // Chỉ tính toán lại nếu phòng không ở trạng thái đặc biệt như "Bảo trì" hoặc "Ngừng hoạt động"
    if (
      phong.trangThai !== "Bảo trì" &&
      phong.trangThai !== "Ngừng hoạt động"
    ) {
      await updateRoomStatus(phong._id);

      phong = await Phong.findById(req.params.id).populate(
        "loaiPhong",
        "maLoaiPhong tenLoaiPhong sucChua donGia",
      );
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật phòng thành công",
      data: phong,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// DELETE PHONG
// ==================================================
exports.deletePhong = async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id);

    if (!phong) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }
    if (phong.soNguoiHienTai > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa phòng đang có sinh viên lưu trú. Vui lòng chuyển sinh viên ra khỏi phòng trước.",
      });
    }

    phong.isDeleted = true;
    phong.trangThai = "Ngừng hoạt động";

    await phong.save();

    res.status(200).json({
      success: true,
      message: "Xóa phòng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// KHÓA PHÒNG BẢO TRÌ
// ==================================================
exports.maintenancePhong = async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id);
    if (!phong) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phòng" });
    }

    //  Chỉ bảo trì phòng trống
    if (phong.soNguoiHienTai > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể bảo trì phòng đang có sinh viên ở. Vui lòng chuyển sinh viên trước.",
      });
    }

    phong.trangThai = "Bảo trì";
    await phong.save();

    res.status(200).json({
      success: true,
      message: "Đã chuyển phòng sang bảo trì",
      data: phong,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// MỞ LẠI PHÒNG
// ==================================================
exports.openPhong = async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id);
    if (!phong) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phòng" });
    }

    //  Phải đang bảo trì mới được mở
    if (phong.trangThai !== "Bảo trì") {
      return res.status(400).json({
        success: false,
        message: "Phòng này hiện không ở trạng thái bảo trì",
      });
    }

    //  Nếu phòng không có người thì Trống, có người thì Đang ở
    phong.trangThai = phong.soNguoiHienTai === 0 ? "Trống" : "Đang ở";
    await phong.save();

    res
      .status(200)
      .json({ success: true, message: "Mở lại phòng thành công", data: phong });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// LẤY THÔNG TIN PHÒNG CỦA SINH VIÊN ĐANG ĐĂNG NHẬP
// GET /api/phong/my-room
// ==================================================
exports.getMyRoom = async (req, res) => {
  try {
    // 1. Tìm hồ sơ Sinh Viên dựa vào user ID lấy từ token đăng nhập
    const sinhVien = await SinhVien.findOne({ user: req.user.id });

    if (!sinhVien || !sinhVien.phong) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Bạn chưa được xếp phòng hoặc không có dữ liệu lưu trú.",
      });
    }

    // 2. Lấy thông tin chi tiết của phòng đó (kèm theo Loại phòng để lấy giá tiền)
    const phong = await Phong.findById(sinhVien.phong).populate("loaiPhong");

    // 3. Tìm những sinh viên khác đang ở CÙNG PHÒNG (Loại trừ bản thân sinh viên đang truy vấn ra)
    const banCungPhong = await SinhVien.find({
      phong: phong._id,
      _id: { $ne: sinhVien._id },
      trangThai: { $ne: "DA_ROI" }, // Không lấy những người đã rời đi
    }).select("maSV hoTen sdt email");

    res.status(200).json({
      success: true,
      data: {
        phong,
        banCungPhong,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
