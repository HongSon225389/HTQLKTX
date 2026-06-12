import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaWrench,
  FaTools,
  FaSignOutAlt,
  FaUserCircle,
  FaCubes,
} from "react-icons/fa";

const TechnicianLayout = () => {
  const navigate = useNavigate();
  // Giả lập lấy thông tin user đăng nhập (Bạn thay bằng Context/Redux của bạn nhé)
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Kỹ Thuật Viên",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      {/* SIDEBAR TỐI GIẢN */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-5 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-xl font-black text-orange-400 tracking-wider flex items-center gap-2">
            <FaTools /> KTX TECH
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/technician/su-co"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-slate-800"
              }`
            }
          >
            <FaWrench />
            <span>Yêu Cầu Sửa Chữa</span>
          </NavLink>
          <NavLink
            to="/technician/tai-san"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-slate-800"
              }`
            }
          >
            {/* Nhớ import FaCubes từ react-icons/fa ở đầu file nhé */}
            <FaCubes />
            <span>Bảo Trì Tài Sản</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors font-medium"
          >
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-gray-700">
            Trạm Kiểm Soát Kỹ Thuật
          </h2>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
            <FaUserCircle className="text-orange-500" size={18} />
            Xin chào, {user.fullName}
          </div>
        </header>

        {/* NỘI DUNG (Outlet) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TechnicianLayout;
