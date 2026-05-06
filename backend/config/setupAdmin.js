import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const taoAdminMacDinh = async () => {
  try {
    const soLuongAdmin = await Admin.countDocuments();

    if (soLuongAdmin === 0) {
      console.log(
        "Chưa có Admin nào trong hệ thống. Đang tạo tài khoản mặc định...",
      );

      const salt = await bcrypt.genSalt(10);
      const matKhauMaHoa = await bcrypt.hash("admin123", salt);

      const adminMacDinh = new Admin({
        taiKhoan: "admin",
        matKhau: matKhauMaHoa,
        hoTen: "Ban Quản Lý KTX",
        vaiTro: "Quản trị viên",
      });

      await adminMacDinh.save();
      console.log("✅ Đã tạo Admin mặc định thành công!");
      console.log("👉 Tài khoản: admin");
      console.log("👉 Mật khẩu: admin123");
      console.log("-----------------------------------");
    }
  } catch (error) {
    console.error("Lỗi khi tự động tạo Admin:", error.message);
  }
};

export default taoAdminMacDinh;
