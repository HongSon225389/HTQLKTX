// backend/controllers/vatTuController.js
import VatTu from "../models/VatTu.js";
import Phong from "../models/Phong.js";

// 1. Lấy danh sách vật tư (Hỗ trợ Phân trang + Tìm kiếm + Lọc trạng thái)
export const layDanhSachVatTu = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Lấy tinhTrang từ query
    const { search, tinhTrang, phongId } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { maVT: { $regex: search, $options: "i" } },
        { tenVT: { $regex: search, $options: "i" } },
      ];
    }

    // Chỉ thêm điều kiện lọc nếu tinhTrang tồn tại VÀ không phải là chữ "Tất cả"
    if (tinhTrang && tinhTrang.trim() !== "" && tinhTrang !== "Tất cả") {
      // Decode để phòng trường hợp chữ tiếng Việt bị mã hóa trên URL
      query.tinhTrang = decodeURIComponent(tinhTrang);
    }

    if (phongId) {
      query.phong = phongId;
    }

    const totalRecords = await VatTu.countDocuments(query);
    const cappedTotal = totalRecords > 100 ? 100 : totalRecords;

    const danhSach = await VatTu.find(query)
      .populate("phong", "tenPhong")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: danhSach,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(cappedTotal / limit),
        totalItems: cappedTotal,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách vật tư: " + error.message });
  }
};

// 2. Thêm vật tư mới
export const themVatTu = async (req, res) => {
  try {
    // Sửa phongId thành phong để khớp với Frontend
    const { maVT, tenVT, tinhTrang, phong } = req.body;

    // Kiểm tra phòng tồn tại
    const checkPhong = await Phong.findById(phong);
    if (!checkPhong) {
      return res.status(404).json({ message: "Không tìm thấy phòng này!" });
    }

    const vatTuMoi = new VatTu({
      maVT,
      tenVT,
      tinhTrang: tinhTrang || "Tốt",
      phong, // Lưu vào field 'phong' của Model
    });

    await vatTuMoi.save();
    res
      .status(201)
      .json({ message: "Thêm vật tư thành công!", data: vatTuMoi });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã vật tư này đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi Server: " + error.message });
  }
};

// 3. Cập nhật tình trạng vật tư
export const capNhatTinhTrang = async (req, res) => {
  try {
    const { id } = req.params;
    const { tinhTrang } = req.body;

    const vatTuCapNhat = await VatTu.findByIdAndUpdate(
      id,
      { tinhTrang },
      { new: true },
    ).populate("phong", "tenPhong");

    if (!vatTuCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy vật tư!" });
    }

    res.status(200).json({
      message: "Cập nhật thành công!",
      data: vatTuCapNhat,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật: " + error.message });
  }
};

// 4. Xóa vật tư (Cần thiết cho nút thùng rác ở Frontend)
export const xoaVatTu = async (req, res) => {
  try {
    const { id } = req.params;
    const ketQua = await VatTu.findByIdAndDelete(id);
    if (!ketQua)
      return res.status(404).json({ message: "Vật tư không tồn tại!" });

    res.status(200).json({ message: "Xóa vật tư thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa vật tư: " + error.message });
  }
};
