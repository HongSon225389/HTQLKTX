// backend/cron/cleanUpAccounts.js
const cron = require("node-cron");
const HopDong = require("../models/HopDong");
const SinhVien = require("../models/SinhVien");
const User = require("../models/User");

// Hàm quét và khóa tài khoản
const lockGhostAccounts = async () => {
  try {
    console.log(
      "⏳ Bắt đầu quét các tài khoản sinh viên đã rời đi quá 7 ngày...",
    );

    // 1. Tính ngày mốc (7 ngày trước tính từ thời điểm hiện tại)
    const bayNgayTruoc = new Date();
    bayNgayTruoc.setDate(bayNgayTruoc.getDate() - 7);

    // 2. Tìm tất cả các Hợp đồng đã Thanh lý HOẶC Hết hạn cách đây hơn 7 ngày
    const hopDongCu = await HopDong.find({
      trangThai: { $in: ["Đã thanh lý", "Hết hạn"] },
      updatedAt: { $lte: bayNgayTruoc }, // Lấy ngày cập nhật cuối cùng (ngày thanh lý) <= 7 ngày trước
    });

    let count = 0;

    for (let hd of hopDongCu) {
      // 3. Kiểm tra xem sinh viên này có hợp đồng mới nào đang hiệu lực không?
      const coHopDongMoi = await HopDong.findOne({
        sinhVien: hd.sinhVien,
        trangThai: "Hiệu lực",
      });

      // Nếu KHÔNG CÓ hợp đồng mới -> Tiến hành khóa
      if (!coHopDongMoi) {
        const sinhVien = await SinhVien.findById(hd.sinhVien);
        if (sinhVien && sinhVien.user) {
          // Lấy user ra kiểm tra xem đã khóa chưa, chưa thì khóa
          const user = await User.findById(sinhVien.user);
          if (user && user.trangThai === "ACTIVE") {
            user.trangThai = "LOCKED";
            await user.save();
            count++;
            console.log(
              `🔒 Đã tự động khóa tài khoản SV: ${sinhVien.maSV} (Đã rời đi quá 7 ngày)`,
            );
          }
        }
      }
    }

    console.log(`✅ Hoàn tất quét! Đã tự động khóa ${count} tài khoản rác.`);
  } catch (error) {
    console.error("❌ Lỗi khi chạy CronJob khóa tài khoản:", error);
  }
};

// Thiết lập lịch chạy: "0 0 * * *" nghĩa là chạy vào lúc 00:00 (Nửa đêm) mỗi ngày
const initCronJobs = () => {
  cron.schedule("0 0 * * *", () => {
    lockGhostAccounts();
  });
  console.log("⏰ Đã khởi động Hệ thống Cron Jobs tự động dọn dẹp tài khoản.");
};

module.exports = initCronJobs;
