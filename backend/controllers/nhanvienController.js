const NhanVien = require("../models/NhanVien");
const User = require("../models/User");

// =====================================
// GET ALL
// =====================================
exports.getDanhSachNhanVien = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 10 } = req.query;

    const query = {};
    if (keyword) {
      query.$or = [
        { maNV: { $regex: keyword, $options: "i" } },
        { hoTen: { $regex: keyword, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [danhSachNhanVien, totalRecords] = await Promise.all([
      NhanVien.find(query)
        .populate("user", "username role trangThai") // SỬA: userId -> user
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      NhanVien.countDocuments(query),
    ]);

    res.status(200).json({
      data: danhSachNhanVien,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalRecords / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi tải dữ liệu nhân viên!" });
  }
};

// =====================================
// GET BY ID (HÀM BẠN YÊU CẦU THÊM MỚI)
// =====================================
exports.getNhanVienById = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findById(req.params.id).populate(
      "user",
      "username role trangThai email",
    );

    if (!nhanVien) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ nhân viên!" });
    }

    res.status(200).json({
      success: true,
      data: nhanVien,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu nhân viên!" });
  }
};

// =====================================
// CREATE
// =====================================
exports.taoNhanVien = async (req, res) => {
  try {
    // SỬA: Lấy user thay vì userId, bổ sung chucVu và email
    const { user, maNV, hoTen, sdt, email, chucVu } = req.body;

    // 1. Kiểm tra trùng mã nhân viên
    const nvTonTai = await NhanVien.findOne({ maNV });
    if (nvTonTai) {
      return res.status(400).json({ message: "Mã nhân viên này đã tồn tại!" });
    }

    // 2. Kiểm tra tài khoản User có hợp lệ không
    const userExist = await User.findById(user);
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "Tài khoản đăng nhập không tồn tại!" });
    }

    // Đảm bảo user này chưa được gắn cho nhân viên nào khác
    const userDaDuocGhan = await NhanVien.findOne({ user }); // SỬA: userId -> user
    if (userDaDuocGhan) {
      return res.status(400).json({
        message: "Tài khoản này đã được liên kết với một hồ sơ nhân viên khác!",
      });
    }

    // 3. Lưu vào DB
    const nhanVienMoi = await NhanVien.create({
      user, // SỬA: userId -> user
      maNV,
      hoTen,
      sdt,
      email,
      chucVu, // SỬA: Bổ sung trường này vì Model yêu cầu required
    });

    res.status(201).json({
      message: "Tạo hồ sơ nhân viên thành công!",
      data: nhanVienMoi,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Lỗi tạo nhân viên:", error);
    res.status(500).json({ message: "Lỗi server khi tạo hồ sơ nhân viên!" });
  }
};

// =====================================
// UPDATE
// =====================================
exports.capNhatNhanVien = async (req, res) => {
  try {
    // SỬA: Check trùng mã NV khi update
    if (req.body.maNV) {
      const checkMaNV = await NhanVien.findOne({
        maNV: req.body.maNV,
        _id: { $ne: req.params.id },
      });
      if (checkMaNV) {
        return res
          .status(400)
          .json({ message: "Mã nhân viên này đã tồn tại!" });
      }
    }

    const nhanVienUpdated = await NhanVien.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("user", "username role"); // SỬA: userId -> user

    if (!nhanVienUpdated) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ nhân viên!" });
    }

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công!",
      data: nhanVienUpdated,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật nhân viên!" });
  }
};

// =====================================
// DELETE
// =====================================
exports.xoaNhanVien = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findById(req.params.id);
    if (!nhanVien) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ nhân viên!" });
    }

    await nhanVien.deleteOne();

    // Gợi ý nhỏ: Tương tự phòng và sinh viên, nếu nhân viên này từng xử lý Yêu cầu hỗ trợ (YeuCauHoTro),
    // việc xóa cứng có thể gây lỗi truy vấn sau này. Nếu có thể, hãy cân nhắc đổi trạng thái thành "INACTIVE".

    res.status(200).json({ message: "Đã xóa hồ sơ nhân viên!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa nhân viên!" });
  }
};
