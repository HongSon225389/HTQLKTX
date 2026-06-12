const HopDong = require("../models/HopDong");
const SinhVien = require("../models/SinhVien");
const Phong = require("../models/Phong");
// const updateRoomStatus = require("../utils/updateRoomStatus");
const mongoose = require("mongoose");

// =====================================
// LẤY DANH SÁCH HỢP ĐỒNG
// =====================================
exports.getDanhSachHopDong = async (req, res) => {
  try {
    const today = new Date();
    await HopDong.updateMany(
      {
        trangThai: "Hiệu lực",
        ngayKetThuc: { $lt: today }, // Những hợp đồng có ngày kết thúc nhỏ hơn hôm nay
      },
      {
        $set: { trangThai: "Hết hạn" },
      },
    );
    const { keyword = "", trangThai = "", page = 1, limit = 10 } = req.query;

    const query = {};
    if (keyword) {
      query.maHD = { $regex: keyword, $options: "i" };
    }
    if (trangThai) {
      query.trangThai = trangThai;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [danhSachHopDong, totalRecords] = await Promise.all([
      HopDong.find(query)
        .populate("sinhVien", "maSV hoTen sdt") // Đã fix: sinhVienId -> sinhVien
        .populate("phong", "maPhong tenPhong toaNha") // Đã fix: phongId -> phong
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      HopDong.countDocuments(query),
    ]);

    res.status(200).json({
      data: danhSachHopDong,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalRecords / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách hợp đồng:", error);
    res.status(500).json({ message: "Lỗi server khi tải dữ liệu hợp đồng!" });
  }
};

// =====================================
// LẤY CHI TIẾT HỢP ĐỒNG
// =====================================
exports.getHopDongById = async (req, res) => {
  try {
    const hopDong = await HopDong.findById(req.params.id)
      .populate("sinhVien", "maSV hoTen cccd sdt queQuan") // Đã fix: sinhVienId -> sinhVien
      .populate({
        path: "phong", // Đã fix: phongId -> phong
        select: "maPhong tenPhong toaNha loaiPhong",
        populate: {
          path: "loaiPhong", // Đã fix: loaiPhongId -> loaiPhong
          select: "tenLoaiPhong donGia sucChua",
        },
      });

    if (!hopDong) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin hợp đồng!" });
    }

    res.status(200).json({ success: true, data: hopDong });
  } catch (error) {
    console.error("Lỗi lấy chi tiết hợp đồng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết hợp đồng!" });
  }
};

// =====================================
// TẠO HỢP ĐỒNG MỚI
// =====================================

// exports.taoHopDong = async (req, res) => {
//   try {
//     const { maHD, sinhVien, phong, ngayBatDau, ngayKetThuc, tienCoc } =
//       req.body;

//     // 1. Kiểm tra mã hợp đồng trùng lặp
//     const hdTonTai = await HopDong.findOne({ maHD });
//     if (hdTonTai)
//       return res.status(400).json({ message: "Mã hợp đồng đã tồn tại!" });

//     // 2. Kiểm tra Sinh viên
//     const svData = await SinhVien.findById(sinhVien);
//     if (!svData)
//       return res.status(404).json({ message: "Không tìm thấy sinh viên!" });
//     if (svData.phong) {
//       return res.status(400).json({
//         message: "Sinh viên này hiện đang có hợp đồng và đã được xếp phòng!",
//       });
//     }

//     // 3. Kiểm tra sức chứa của Phòng
//     const phongData = await Phong.findById(phong).populate("loaiPhong");
//     if (!phongData)
//       return res.status(404).json({ message: "Không tìm thấy phòng!" });

//     if (phongData.soNguoiHienTai >= phongData.loaiPhong.sucChua) {
//       return res.status(400).json({
//         message: "Phòng này đã đạt tối đa sức chứa, không thể xếp thêm!",
//       });
//     }
//     if (phongData.trangThai === "Bảo trì" || phongData.isDeleted) {
//       return res
//         .status(400)
//         .json({ message: "Phòng đang bảo trì hoặc đã ngừng hoạt động!" });
//     }

//     // 4. Bắt đầu tạo hợp đồng
//     const hopDongMoi = await HopDong.create({
//       maHD,
//       sinhVien,
//       phong,
//       ngayBatDau,
//       ngayKetThuc,
//       tienCoc,
//     });

//     // 5. Cập nhật trạng thái liên đới
//     svData.phong = phongData._id;
//     await svData.save();

//     // Tăng số người và gọi hàm Utils cập nhật trạng thái
//     phongData.soNguoiHienTai += 1;
//     await phongData.save();
//     await updateRoomStatus(phongData._id); // <--- Gọi Utils ở đây

//     res.status(201).json({
//       success: true,
//       message: "Tạo hợp đồng và xếp phòng thành công!",
//       data: hopDongMoi,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res
//         .status(400)
//         .json({ success: false, message: messages.join(", ") });
//     }
//     res
//       .status(500)
//       .json({ success: false, message: "Lỗi server khi tạo hợp đồng!" });
//   }
// };

// exports.taoHopDong = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { maHD, sinhVien, phong, ngayBatDau, ngayKetThuc, tienCoc } =
//       req.body;

//     // 1. Kiểm tra logic (dùng session để truy vấn)
//     const svData = await SinhVien.findById(sinhVien).session(session);
//     if (!svData || svData.phong)
//       throw new Error("Sinh viên không hợp lệ hoặc đã có phòng!");

//     const phongData = await Phong.findById(phong)
//       .populate("loaiPhong")
//       .session(session);
//     if (!phongData || phongData.soNguoiHienTai >= phongData.loaiPhong.sucChua)
//       throw new Error("Phòng không khả dụng!");

//     // 2. Tạo Hợp Đồng
//     const [hopDongMoi] = await HopDong.create(
//       [{ maHD, sinhVien, phong, ngayBatDau, ngayKetThuc, tienCoc }],
//       { session },
//     );

//     // 3. Cập nhật Sinh Viên & Phòng
//     svData.phong = phongData._id;
//     await svData.save({ session });

//     phongData.soNguoiHienTai += 1;
//     await phongData.save({ session });

//     // Lưu thay đổi
//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       message: "Tạo hợp đồng thành công!",
//       data: hopDongMoi,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).json({ success: false, message: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// =====================================
// THANH LÝ HỢP ĐỒNG
// =====================================

// CẬP NHẬT HÀM TẠO HỢP ĐỒNG
exports.taoHopDong = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { maHD, sinhVien, phong, ngayBatDau, ngayKetThuc, tienCoc } =
      req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đưa về đầu ngày để so sánh công bằng

    if (new Date(ngayKetThuc) < today) {
      throw new Error(
        "Lỗi: Ngày kết thúc hợp đồng không được nằm trong quá khứ!",
      );
    }
    if (new Date(ngayBatDau) >= new Date(ngayKetThuc)) {
      throw new Error("Lỗi: Ngày kết thúc phải sau ngày bắt đầu!");
    }
    const hdTonTai = await HopDong.findOne({ maHD }).session(session);
    if (hdTonTai) throw new Error("Mã hợp đồng đã tồn tại!");

    const svData = await SinhVien.findById(sinhVien).session(session);
    if (!svData || svData.phong)
      throw new Error("Sinh viên không hợp lệ hoặc đã được xếp phòng!");

    const phongData = await Phong.findById(phong)
      .populate("loaiPhong")
      .session(session);
    if (
      !phongData ||
      phongData.soNguoiHienTai >= phongData.loaiPhong.sucChua ||
      phongData.trangThai === "Bảo trì"
    ) {
      throw new Error("Phòng không khả dụng, đã đầy hoặc đang bảo trì!");
    }

    // 1. Tạo hợp đồng
    const [hopDongMoi] = await HopDong.create(
      [{ maHD, sinhVien, phong, ngayBatDau, ngayKetThuc, tienCoc }],
      { session },
    );

    // 2. Gán phòng cho SV
    svData.phong = phongData._id;
    await svData.save({ session });

    // 3. Tăng người phòng VÀ Cập nhật trạng thái trực tiếp
    phongData.soNguoiHienTai += 1;

    // LOGIC CẬP NHẬT TRẠNG THÁI NGAY TẠI ĐÂY
    if (phongData.soNguoiHienTai >= phongData.loaiPhong.sucChua) {
      phongData.trangThai = "Đầy";
    } else {
      phongData.trangThai = "Đang ở";
    }

    // Lưu lại cùng lúc trong kén an toàn
    await phongData.save({ session });

    // Chốt sổ
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Tạo hợp đồng thành công!",
      data: hopDongMoi,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// exports.thanhLyHopDong = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const hopDong = await HopDong.findById(req.params.id).session(session);
//     if (!hopDong || hopDong.trangThai === "Đã thanh lý")
//       throw new Error("Hợp đồng không hợp lệ hoặc đã thanh lý!");

//     hopDong.trangThai = "Đã thanh lý";
//     await hopDong.save({ session });

//     const svData = await SinhVien.findById(hopDong.sinhVien).session(session);
//     if (svData) {
//       svData.phong = null;
//       await svData.save({ session });
//     }

//     const phongData = await Phong.findById(hopDong.phong).session(session);
//     if (phongData && phongData.soNguoiHienTai > 0) {
//       phongData.soNguoiHienTai -= 1;
//       await phongData.save({ session });
//     }

//     await session.commitTransaction();
//     await updateRoomStatus(hopDong.phong);

//     res
//       .status(200)
//       .json({ success: true, message: "Thanh lý hợp đồng thành công!" });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).json({ success: false, message: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// =====================================
// XÓA HỢP ĐỒNG
// =====================================

// CẬP NHẬT HÀM THANH LÝ
exports.thanhLyHopDong = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const hopDong = await HopDong.findById(req.params.id).session(session);
    if (!hopDong || hopDong.trangThai === "Đã thanh lý")
      throw new Error("Hợp đồng không hợp lệ hoặc đã thanh lý!");

    hopDong.trangThai = "Đã thanh lý";
    await hopDong.save({ session });

    const svData = await SinhVien.findById(hopDong.sinhVien).session(session);
    if (svData) {
      svData.phong = null;
      await svData.save({ session });
    }

    const phongData = await Phong.findById(hopDong.phong)
      .populate("loaiPhong")
      .session(session);
    if (phongData && phongData.soNguoiHienTai > 0) {
      // Giảm số người
      phongData.soNguoiHienTai -= 1;

      // LOGIC CẬP NHẬT TRẠNG THÁI NGAY TẠI ĐÂY
      if (phongData.soNguoiHienTai === 0) {
        phongData.trangThai = "Trống";
      } else {
        phongData.trangThai = "Đang ở";
      }

      await phongData.save({ session });
    }

    await session.commitTransaction();

    res
      .status(200)
      .json({ success: true, message: "Thanh lý hợp đồng thành công!" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
exports.xoaHopDong = async (req, res) => {
  try {
    const hopDong = await HopDong.findById(req.params.id);
    if (!hopDong)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });

    if (hopDong.trangThai !== "Đã thanh lý") {
      return res.status(400).json({
        message:
          "Hợp đồng đang có hiệu lực. Vui lòng Thanh lý hợp đồng trước khi xóa để đảm bảo toàn vẹn dữ liệu phòng!",
      });
    }

    await hopDong.deleteOne();
    res.status(200).json({ message: "Đã xóa bản ghi hợp đồng!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa hợp đồng!" });
  }
};

// =====================================
// GIA HẠN HỢP ĐỒNG
// =====================================
exports.giaHanHopDong = async (req, res) => {
  try {
    const { ngayKetThucMoi } = req.body;
    const hopDong = await HopDong.findById(req.params.id);

    if (!hopDong)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });
    if (hopDong.trangThai === "Đã thanh lý") {
      return res
        .status(400)
        .json({ message: "Hợp đồng đã thanh lý không thể gia hạn!" });
    }

    hopDong.ngayKetThuc = ngayKetThucMoi;
    hopDong.trangThai = "Hiệu lực";
    await hopDong.save();

    res
      .status(200)
      .json({ message: "Gia hạn hợp đồng thành công!", data: hopDong });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gia hạn hợp đồng!" });
  }
};

//LẤY HỢP ĐỒNG CỦA SINH VIÊN ĐANG ĐĂNG NHẬP
exports.getMyHopDong = async (req, res) => {
  try {
    // Tìm Sinh viên dựa vào ID User đang đăng nhập
    const sinhVien = await SinhVien.findOne({ user: req.user._id });
    if (!sinhVien)
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ sinh viên!" });

    // Lấy hợp đồng đang có hiệu lực của sinh viên đó
    const hopDong = await HopDong.findOne({
      sinhVien: sinhVien._id,
      trangThai: "Hiệu lực",
    }).populate({
      path: "phong",
      populate: { path: "loaiPhong", select: "tenLoaiPhong donGia" },
    });

    if (!hopDong)
      return res
        .status(404)
        .json({ message: "Bạn chưa có hợp đồng lưu trú nào đang hiệu lực!" });

    res.status(200).json({ success: true, data: hopDong });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy hợp đồng cá nhân!" });
  }
};
