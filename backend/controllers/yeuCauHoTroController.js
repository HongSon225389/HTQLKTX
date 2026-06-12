const YeuCauHoTro = require("../models/YeuCauHoTro");
const SinhVien = require("../models/SinhVien");
// ==========================================
// 1. LẤY DANH SÁCH & TÌM KIẾM, PHÂN TRANG
// ==========================================
exports.getDanhSachYeuCau = async (req, res) => {
  try {
    const {
      keyword = "",
      trangThai = "",
      nhomYeuCau = "",
      page = 1,
      limit = 10,
    } = req.query;
    const query = {};

    // --- LOGIC PHÂN LUỒNG QUYỀN TRUY CẬP ---
    if (req.user.role === "STUDENT") {
      const thongTinSV = await SinhVien.findOne({
        $or: [
          { user: req.user.id },
          { taiKhoan: req.user.id },
          { _id: req.user.id },
        ],
      });

      if (thongTinSV) {
        query.sinhVien = thongTinSV._id;
      } else {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: { totalRecords: 0, currentPage: 1, totalPages: 0 },
        });
      }
    } else if (req.user.role === "TECHNICIAN") {
      query.nhomYeuCau = "Kỹ thuật";
    }

    // --- LOGIC TÌM KIẾM & LỌC ---
    if (keyword) {
      query.$or = [
        { maYC: { $regex: keyword, $options: "i" } },
        { tieuDe: { $regex: keyword, $options: "i" } },
      ];
    }
    if (trangThai) query.trangThai = trangThai;
    if (nhomYeuCau && req.user.role !== "TECHNICIAN") {
      query.nhomYeuCau = nhomYeuCau;
    }

    // --- LOGIC PHÂN TRANG ---
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [danhSach, totalRecords] = await Promise.all([
      YeuCauHoTro.find(query)
        .populate({
          path: "sinhVien",
          select: "hoTen fullName maSV mssv phong",
          populate: { path: "phong", select: "maPhong toaNha" },
        })
        .populate("phong", "maPhong toaNha")
        .populate("nhanVienXuLy", "fullName role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      YeuCauHoTro.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: danhSach,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi tải danh sách yêu cầu!" });
  }
};

// ==========================================
// 2. TẠO YÊU CẦU MỚI (Dành cho Sinh viên)
// ==========================================
exports.taoYeuCau = async (req, res) => {
  try {
    const { nhomYeuCau, loaiYeuCau, phong, tieuDe, noiDung, mucDo } = req.body;
    const thongTinSV = await SinhVien.findOne({
      $or: [
        { user: req.user.id },
        { taiKhoan: req.user.id },
        { _id: req.user.id },
      ],
    });

    if (!thongTinSV) {
      return res.status(400).json({
        success: false,
        message: "Lỗi: Không tìm thấy hồ sơ sinh viên của bạn trong hệ thống!",
      });
    }
    // Tự động tạo mã Yêu Cầu (VD: YC-1686461234)
    const maYC = `YC-${Date.now().toString().slice(-6)}`;

    const yeuCauMoi = await YeuCauHoTro.create({
      maYC,
      sinhVien: thongTinSV._id,
      phong: phong || null,
      nhomYeuCau,
      loaiYeuCau,
      tieuDe,
      noiDung,
      mucDo,
    });

    res.status(201).json({
      success: true,
      message: "Gửi yêu cầu hỗ trợ thành công!",
      data: yeuCauMoi,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi gửi yêu cầu!" });
  }
};

// ==========================================
// 3. XỬ LÝ / PHẢN HỒI / PHÂN CÔNG YÊU CẦU
// ==========================================
exports.xuLyYeuCau = async (req, res) => {
  try {
    const { trangThai, ghiChuXuLy, nhanVienXuLy } = req.body;
    const yeuCau = await YeuCauHoTro.findById(req.params.id);

    if (!yeuCau) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu!" });
    }

    // 🌟 LOGIC : TỰ ĐỘNG CẬP NHẬT HOẶC GỠ NGƯỜI TIẾP QUẢN ĐƠN
    if (yeuCau.nhomYeuCau === "Hành chính" || yeuCau.nhomYeuCau === "Khác") {
      // Đơn Hành chính: Ai đang thao tác, người đó đứng tên
      yeuCau.nhanVienXuLy = req.user.id;
    } else if (yeuCau.nhomYeuCau === "Kỹ thuật") {
      // Đơn Kỹ thuật:
      if (req.user.role === "TECHNICIAN") {
        // Thợ tự vào cập nhật -> Đứng tên thợ
        yeuCau.nhanVienXuLy = req.user.id;
      } else {
        // Nếu là Admin/Manager thao tác:
        if (nhanVienXuLy === "") {
          yeuCau.nhanVienXuLy = null;
        } else if (nhanVienXuLy) {
          // Gán cho thợ mới được chọn
          yeuCau.nhanVienXuLy = nhanVienXuLy;
        }
      }
    }

    // Cập nhật các trạng thái khác
    yeuCau.trangThai = trangThai;
    yeuCau.ghiChuXuLy = ghiChuXuLy;

    await yeuCau.save();

    res
      .status(200)
      .json({ success: true, message: "Đã cập nhật trạng thái yêu cầu!" });
  } catch (error) {
    console.error("Lỗi cập nhật yêu cầu:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật!" });
  }
};

// ==========================================
// 4. SINH VIÊN ĐÁNH GIÁ (Rate sao) KHI HOÀN THÀNH
// ==========================================
exports.danhGiaYeuCau = async (req, res) => {
  try {
    const { danhGia, binhLuan } = req.body;
    const yeuCau = await YeuCauHoTro.findById(req.params.id);

    if (!yeuCau) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu!" });
    }

    if (yeuCau.trangThai !== "Hoàn thành") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được đánh giá khi đã hoàn thành!",
      });
    }

    // Lưu điểm đánh giá (1-5 sao) và bình luận (nếu có)
    yeuCau.danhGia = danhGia;
    yeuCau.binhLuan = binhLuan || "";

    await yeuCau.save();

    res
      .status(200)
      .json({ success: true, message: "Cảm ơn bạn đã gửi đánh giá!" });
  } catch (error) {
    console.error("Lỗi gửi đánh giá:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi gửi đánh giá!" });
  }
};
// ==========================================
// 5. LẤY CHI TIẾT MỘT YÊU CẦU
// ==========================================
exports.getYeuCauById = async (req, res) => {
  try {
    const yeuCau = await YeuCauHoTro.findById(req.params.id)
      // Bổ sung Deep Populate
      .populate({
        path: "sinhVien",
        select: "hoTen fullName maSV mssv phone email phong",
        populate: { path: "phong", select: "maPhong toaNha" },
      })
      .populate("phong", "maPhong toaNha")
      .populate("nhanVienXuLy", "fullName role phone");

    if (!yeuCau) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu hỗ trợ này!",
      });
    }

    //  Sinh viên chỉ được quyền xem đơn do chính mình gửi lên
    if (req.user.role === "STUDENT") {
      const thongTinSV = await SinhVien.findOne({
        $or: [
          { user: req.user.id },
          { taiKhoan: req.user.id },
          { _id: req.user.id },
        ],
      });
      if (
        !thongTinSV ||
        yeuCau.sinhVien._id.toString() !== thongTinSV._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xem yêu cầu hỗ trợ của sinh viên khác!",
        });
      }
    }

    //  Thợ kỹ thuật chỉ được quyền xem các đơn thuộc nhóm "Kỹ thuật"
    if (req.user.role === "TECHNICIAN" && yeuCau.nhomYeuCau !== "Kỹ thuật") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem nội dung yêu cầu hành chính này!",
      });
    }

    res.status(200).json({ success: true, data: yeuCau });
  } catch (error) {
    console.error("Lỗi lấy chi tiết yêu cầu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tải chi tiết yêu cầu!",
    });
  }
};
// ==========================================
// 6. HỦY YÊU CẦU (Dành cho Sinh viên)
// ==========================================
exports.huyYeuCau = async (req, res) => {
  try {
    const yeuCau = await YeuCauHoTro.findById(req.params.id);

    if (!yeuCau) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu!" });
    }

    //  Chỉ cho phép xóa khi đơn chưa ai đụng tới
    if (yeuCau.trangThai !== "Chờ xử lý") {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa yêu cầu đã được Ban quản lý tiếp nhận hoặc xử lý!",
      });
    }

    // Xóa yêu cầu khỏi Database
    // await YeuCauHoTro.findByIdAndDelete(req.params.id);

    //  ĐỔI TRẠNG THÁI (Không xóa hẳn DB)
    yeuCau.trangThai = "Đã hủy";
    await yeuCau.save();

    res
      .status(200)
      .json({ success: true, message: "Đã xóa yêu cầu thành công!" });
  } catch (error) {
    console.error("Lỗi xóa/hủy yêu cầu:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa yêu cầu!" });
  }
};
