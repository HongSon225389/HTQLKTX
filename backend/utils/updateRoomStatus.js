const Phong = require("../models/Phong");

const updateRoomStatus = async (phongId) => {
  try {
    // 1. Tìm phòng và lấy luôn thông tin sức chứa từ Loại Phòng
    const phong = await Phong.findById(phongId).populate("loaiPhong");
    if (!phong) return;

    // 2. Không tự động đổi trạng thái nếu phòng đang bị khóa bảo trì
    if (phong.trangThai === "Bảo trì") return;

    // 3. Đặt ra các quy tắc đổi trạng thái
    let trangThaiMoi = "Trống";

    if (phong.soNguoiHienTai >= phong.loaiPhong.sucChua) {
      trangThaiMoi = "Đầy";
    } else if (phong.soNguoiHienTai > 0) {
      trangThaiMoi = "Đang ở";
    }

    // 4. Chỉ lưu vào Database nếu trạng thái thực sự có sự thay đổi
    if (phong.trangThai !== trangThaiMoi) {
      phong.trangThai = trangThaiMoi;
      await phong.save();
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái phòng:", error);
  }
};

module.exports = updateRoomStatus;
