import LoaiPhong from "../models/LoaiPhong.js";

export const layDanhSachLoaiPhong = async (req, res) => {
  try {
    const danhSach = await LoaiPhong.find();
    res.status(200).json(danhSach);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách loại phòng",
        error: error.message,
      });
  }
};
