import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối database: ${error.message}`);
    process.exit(1); // Dừng server nếu kết nối DB thất bại
  }
};

export default connectDB;
