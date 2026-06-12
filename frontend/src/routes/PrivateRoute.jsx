import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. Đang kiểm tra token trong máy, tạm thời chưa làm gì cả
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-500">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  // 2. Không có user (Chưa đăng nhập hoặc đã đăng xuất) -> Đá ra trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. (Tùy chọn) Kiểm tra Role xem có đúng quyền không
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu có đăng nhập nhưng là SINH VIÊN mà đòi mò vào trang ADMIN -> Đá về trang không có quyền (hoặc login)
    return <Navigate to="/login" replace />;
  }

  // 4. Mọi thứ hợp lệ -> Mở cửa cho đi tiếp vào các trang con (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
