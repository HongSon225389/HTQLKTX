// backend/controllers/vatTuController.js
import VatTu from "../models/VatTu.js";
import Phong from "../models/Phong.js";

// Lấy danh sách vật tư (Có thể lọc theo phòng cụ thể)
export const layDanhSachVatTu = async (req, res) => {
  try {
    const { phongId } = req.query; // Lấy ID phòng từ query URL nếu có

    let query = {};
    if (phongId) query.phong = phongId;

    // Dùng populate để lấy thêm thông tin tên phòng
    const danhSach = await VatTu.find(query).populate("phong", "tenPhong");
    res.status(200).json(danhSach);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách vật tư: " + error.message });
  }
};

// Thêm vật tư mới vào một phòng
export const themVatTu = async (req, res) => {
  try {
    const { maVT, tenVT, tinhTrang, phongId } = req.body;

    // Kiểm tra xem phòng có tồn tại không
    const phong = await Phong.findById(phongId);
    if (!phong) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng để thêm vật tư!" });
    }

    const vatTuMoi = new VatTu({
      maVT,
      tenVT,
      tinhTrang: tinhTrang || "Tốt",
      phong: phongId,
    });

    const vatTuDaLuu = await vatTuMoi.save();
    res
      .status(201)
      .json({ message: "Thêm vật tư thành công!", vatTu: vatTuDaLuu });
  } catch (error) {
    // Nếu lỗi trùng mã VT (unique), báo lỗi cụ thể
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Mã vật tư này đã tồn tại trong hệ thống!" });
    }
    res.status(500).json({ message: "Lỗi khi thêm vật tư: " + error.message });
  }
};

// Cập nhật tình trạng vật tư (VD: Báo hỏng, đang sửa, đã thanh lý)
export const capNhatTinhTrang = async (req, res) => {
  try {
    const { id } = req.params;
    const { tinhTrang } = req.body;

    const vatTuCapNhat = await VatTu.findByIdAndUpdate(
      id,
      { tinhTrang },
      { new: true },
    );

    if (!vatTuCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy vật tư này!" });
    }

    res
      .status(200)
      .json({
        message: "Cập nhật tình trạng thành công!",
        vatTu: vatTuCapNhat,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật vật tư: " + error.message });
  }
};
