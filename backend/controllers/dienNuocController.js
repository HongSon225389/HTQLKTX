// import DienNuoc from "../models/DienNuoc.js";
// import HoaDon from "../models/HoaDon.js";
// import Phong from "../models/Phong.js";

// // 1. Lấy danh sách chốt điện nước (Kèm thông tin phòng)
// export const layDanhSachDN = async (req, res) => {
//   try {
//     const ds = await DienNuoc.find().populate("phong").sort({ createdAt: -1 });
//     res.status(200).json(ds);
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi tải dữ liệu: " + error.message });
//   }
// };

// // 2. Chốt chỉ số & Tự động tạo hóa đơn chi tiết
// export const chotChiSoDienNuoc = async (req, res) => {
//   try {
//     const {
//       phongId,
//       thangNam,
//       dienCu,
//       dienMoi,
//       nuocCu,
//       nuocMoi,
//       donGiaDien = 3500,
//       donGiaNuoc = 25000,
//     } = req.body;

//     // --- VALIDATION ---
//     if (!phongId || phongId === "") {
//       return res
//         .status(400)
//         .json({ message: "Lỗi: Bạn chưa chọn phòng để chốt số!" });
//     }

//     const phongTonTai = await Phong.findById(phongId);
//     if (!phongTonTai) {
//       return res
//         .status(404)
//         .json({ message: "Phòng không tồn tại trên hệ thống!" });
//     }

//     if (dienMoi < dienCu || nuocMoi < nuocCu) {
//       return res
//         .status(400)
//         .json({ message: "Chỉ số mới không được nhỏ hơn chỉ số cũ!" });
//     }

//     const daChotThangNay = await DienNuoc.findOne({ phong: phongId, thangNam });
//     if (daChotThangNay) {
//       return res
//         .status(400)
//         .json({ message: `Phòng này đã chốt điện nước cho kỳ ${thangNam}!` });
//     }

//     // --- TÍNH TOÁN ---
//     const tienDien = (dienMoi - dienCu) * donGiaDien;
//     const tienNuoc = (nuocMoi - nuocCu) * donGiaNuoc;
//     const tongTienDienNuoc = tienDien + tienNuoc;

//     const suffix = Math.random().toString(36).substring(7).toUpperCase();
//     const maDN = `DN-${thangNam.replace("/", "")}-${suffix}`;

//     // --- LƯU PHIẾU ĐIỆN NƯỚC ---
//     const phieuDienNuoc = new DienNuoc({
//       maDN,
//       phong: phongId,
//       thangNam,
//       dienCu,
//       dienMoi,
//       nuocCu,
//       nuocMoi,
//       donGiaDien,
//       donGiaNuoc,
//       tienDien,
//       tienNuoc,
//       tongTien: tongTienDienNuoc,
//       trangThai: "Đã chốt",
//     });

//     await phieuDienNuoc.save();

//     // --- TỰ ĐỘNG TẠO HÓA ĐƠN KÈM CHI TIẾT CHỈ SỐ ---
//     try {
//       const maHD = `HDDN-${suffix}`;
//       const hoaDonMoi = new HoaDon({
//         maHD,
//         phong: phongId,
//         loaiHD: "Điện nước",
//         kyThanhToan: thangNam,
//         tongTien: tongTienDienNuoc,
//         trangThai: "Chưa thanh toán",

//         // Lưu "bản chụp" dữ liệu sang bảng Hóa đơn
//         dienCu,
//         dienMoi,
//         nuocCu,
//         nuocMoi,
//         tienDien,
//         tienNuoc,
//       });

//       await hoaDonMoi.save();

//       res.status(201).json({
//         message: "Chốt số và tạo hóa đơn thành công!",
//         data: phieuDienNuoc,
//       });
//     } catch (errHoaDon) {
//       // Rollback: Xóa phiếu điện nước nếu tạo hóa đơn lỗi
//       await DienNuoc.findByIdAndDelete(phieuDienNuoc._id);
//       res.status(500).json({ message: "Lỗi hệ thống khi tạo hóa đơn." });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server: " + error.message });
//   }
// };

// // 3. Xóa bản ghi chốt số
// export const xoaDN = async (req, res) => {
//   try {
//     await DienNuoc.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Đã xóa bản ghi chốt số." });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi xóa." });
//   }
// };

// // 4. Lấy chỉ số cuối cùng của một phòng để làm số cũ cho tháng mới
// export const layChiSoMoiNhat = async (req, res) => {
//   try {
//     const { phongId } = req.params;
//     // Tìm bản ghi điện nước mới nhất của phòng này
//     const banGhiCu = await DienNuoc.findOne({ phong: phongId }).sort({
//       createdAt: -1,
//     }); // Lấy cái mới nhất

//     if (!banGhiCu) {
//       // Nếu phòng mới chưa từng chốt số, trả về 0
//       return res.status(200).json({ dienMoi: 0, nuocMoi: 0 });
//     }

//     res.status(200).json({
//       dienMoi: banGhiCu.dienMoi,
//       nuocMoi: banGhiCu.nuocMoi,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi lấy chỉ số cũ" });
//   }
// };

import DienNuoc from "../models/DienNuoc.js";
import HoaDon from "../models/HoaDon.js";
import Phong from "../models/Phong.js";

// 1. Lấy danh sách chốt điện nước (Kèm thông tin phòng)
export const layDanhSachDN = async (req, res) => {
  try {
    const ds = await DienNuoc.find().populate("phong").sort({ createdAt: -1 });
    res.status(200).json(ds);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tải dữ liệu: " + error.message });
  }
};

// 2. Chốt chỉ số & Tự động tạo hóa đơn chi tiết
export const chotChiSoDienNuoc = async (req, res) => {
  try {
    const {
      phongId,
      thangNam,
      dienCu,
      dienMoi,
      nuocCu,
      nuocMoi,
      donGiaDien = 3500,
      donGiaNuoc = 25000,
    } = req.body;

    // --- VALIDATION ---
    if (!phongId || phongId === "") {
      return res
        .status(400)
        .json({ message: "Lỗi: Bạn chưa chọn phòng để chốt số!" });
    }

    // SỬA CHỖ NÀY 1: Thêm .populate("loaiPhong") để lôi cái bảng LoaiPhong ra
    const phongTonTai = await Phong.findById(phongId).populate("loaiPhong");
    if (!phongTonTai) {
      return res
        .status(404)
        .json({ message: "Phòng không tồn tại trên hệ thống!" });
    }

    if (dienMoi < dienCu || nuocMoi < nuocCu) {
      return res
        .status(400)
        .json({ message: "Chỉ số mới không được nhỏ hơn chỉ số cũ!" });
    }

    const daChotThangNay = await DienNuoc.findOne({ phong: phongId, thangNam });
    if (daChotThangNay) {
      return res
        .status(400)
        .json({ message: `Phòng này đã chốt điện nước cho kỳ ${thangNam}!` });
    }

    // --- TÍNH TOÁN ---
    const tienDien = (dienMoi - dienCu) * donGiaDien;
    const tienNuoc = (nuocMoi - nuocCu) * donGiaNuoc;

    // SỬA CHỖ NÀY 2: Đổi từ giaPhong thành giaTien cho khớp với file LoaiPhong.js của bạn
    const tienPhong = phongTonTai.loaiPhong?.giaTien || 0;

    // TỔNG TIỀN CUỐI CÙNG (Đã cộng tiền phòng)
    const tongTienCuoiCung = tienDien + tienNuoc + tienPhong;

    const suffix = Math.random().toString(36).substring(7).toUpperCase();
    const maDN = `DN-${thangNam.replace("/", "")}-${suffix}`;

    // --- LƯU PHIẾU ĐIỆN NƯỚC (Chỉ lưu tiền điện nước) ---
    const phieuDienNuoc = new DienNuoc({
      maDN,
      phong: phongId,
      thangNam,
      dienCu,
      dienMoi,
      nuocCu,
      nuocMoi,
      donGiaDien,
      donGiaNuoc,
      tienDien,
      tienNuoc,
      tongTien: tienDien + tienNuoc,
      trangThai: "Đã chốt",
    });

    await phieuDienNuoc.save();

    // --- TỰ ĐỘNG TẠO HÓA ĐƠN KÈM CHI TIẾT CHỈ SỐ ---
    try {
      const maHD = `HDDN-${suffix}`;
      const hoaDonMoi = new HoaDon({
        maHD,
        phong: phongId,
        loaiHD: "Điện nước",
        kyThanhToan: thangNam,
        tongTien: tongTienCuoiCung, // Đã đẩy tổng tiền có cả tiền phòng vào đây
        trangThai: "Chưa thanh toán",

        // Lưu "bản chụp" dữ liệu sang bảng Hóa đơn
        dienCu,
        dienMoi,
        nuocCu,
        nuocMoi,
        tienDien,
        tienNuoc,
        tienPhong: tienPhong, // Ghi tiền phòng vào để trang Thống kê còn đọc được
      });

      await hoaDonMoi.save();

      res.status(201).json({
        message: "Chốt số và tạo hóa đơn thành công!",
        data: phieuDienNuoc,
      });
    } catch (errHoaDon) {
      await DienNuoc.findByIdAndDelete(phieuDienNuoc._id);
      res.status(500).json({ message: "Lỗi hệ thống khi tạo hóa đơn." });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// 3. Xóa bản ghi chốt số
export const xoaDN = async (req, res) => {
  try {
    await DienNuoc.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa bản ghi chốt số." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa." });
  }
};

// 4. Lấy chỉ số cuối cùng của một phòng để làm số cũ cho tháng mới
export const layChiSoMoiNhat = async (req, res) => {
  try {
    const { phongId } = req.params;
    const banGhiCu = await DienNuoc.findOne({ phong: phongId }).sort({
      createdAt: -1,
    });

    if (!banGhiCu) {
      return res.status(200).json({ dienMoi: 0, nuocMoi: 0 });
    }

    res.status(200).json({
      dienMoi: banGhiCu.dienMoi,
      nuocMoi: banGhiCu.nuocMoi,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chỉ số cũ" });
  }
};
