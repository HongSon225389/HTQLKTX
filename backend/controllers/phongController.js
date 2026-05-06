import Phong from "../models/Phong.js";

// 1. Lấy danh sách toàn bộ phòng
export const layDanhSachPhong = async (req, res) => {
  try {
    const danhSachPhong = await Phong.find()
      .populate("loaiPhong")
      .sort({ tenPhong: 1 });
    res.status(200).json(danhSachPhong);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách phòng", error: error.message });
  }
};

// 2. Thêm phòng mới
export const themPhongMoi = async (req, res) => {
  try {
    const { tenPhong, loaiPhong } = req.body;

    const phongDaTonTai = await Phong.findOne({ tenPhong });
    if (phongDaTonTai) {
      return res.status(400).json({ message: "Tên phòng này đã tồn tại!" });
    }

    const phongMoi = new Phong({
      tenPhong,
      loaiPhong,
      trangThai: "Trống",
    });

    const phongDaLuu = await phongMoi.save();
    res
      .status(201)
      .json({ message: "Thêm phòng thành công!", phong: phongDaLuu });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm phòng mới", error: error.message });
  }
};

// 3. Cập nhật thông tin phòng
export const capNhatPhong = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai, loaiPhong } = req.body;

    const phongCapNhat = await Phong.findByIdAndUpdate(
      id,
      { trangThai, loaiPhong },
      { new: true },
    ).populate("loaiPhong");

    if (!phongCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy phòng!" });
    }

    res
      .status(200)
      .json({ message: "Cập nhật phòng thành công!", phong: phongCapNhat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật phòng", error: error.message });
  }
};

// 4. Xóa phòng
export const xoaPhong = async (req, res) => {
  try {
    const { id } = req.params;
    const phongDaXoa = await Phong.findByIdAndDelete(id);

    if (!phongDaXoa) {
      return res.status(404).json({ message: "Không tìm thấy phòng để xóa!" });
    }

    res.status(200).json({ message: "Xóa phòng thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phòng", error: error.message });
  }
};
