// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const xacThucToken = (req, res, next) => {
  // Frontend sẽ gửi token qua header 'Authorization' với định dạng: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Truy cập bị từ chối. Không tìm thấy Token!" });
  }

  // Cắt lấy phần mã token ở phía sau chữ "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // Giải mã token xem có hợp lệ và còn hạn không
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Gắn thông tin admin vừa giải mã vào request để các hàm sau sử dụng
    next(); // Cho phép đi tiếp vào Controller xử lý logic
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
