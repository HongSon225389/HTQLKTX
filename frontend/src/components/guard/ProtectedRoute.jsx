// src/components/guard/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // Chưa đăng nhập -> Cho ra chuồng gà (Trang Login)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Đăng nhập rồi nhưng Role không có quyền xem trang này
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">403</h1>
          <p className="text-gray-700">
            Bạn không có quyền truy cập trang này!
          </p>
        </div>
      </div>
    );
  }

  // Hợp lệ -> Cho qua
  return <Outlet />;
};

export default ProtectedRoute;
