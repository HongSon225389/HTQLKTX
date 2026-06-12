const mongoose = require("mongoose");
const dotenv = require("dotenv");

const CauHinh = require("./models/CauHinh");

dotenv.config();

const configs = [
  {
    maCauHinh: "GIA_DIEN",
    giaTri: 3500,
    moTa: "Giá điện (VNĐ/kWh)",
  },
  {
    maCauHinh: "GIA_NUOC",
    giaTri: 15000,
    moTa: "Giá nước (VNĐ/m3)",
  },
  {
    maCauHinh: "TIEN_COC",
    giaTri: 1000000,
    moTa: "Tiền đặt cọc KTX",
  },
];

const setupConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    for (const item of configs) {
      const exists = await CauHinh.findOne({
        maCauHinh: item.maCauHinh,
      });

      if (!exists) {
        await CauHinh.create(item);

        console.log(`✔ Đã tạo ${item.maCauHinh}`);
      }
    }

    console.log("🎉 Khởi tạo cấu hình thành công!");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

setupConfig();
