import { useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaUserAlt,
  FaBed,
  FaFileSignature, // Đã thêm icon Hợp đồng
  FaFileInvoiceDollar,
  FaTools,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

const StudentLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Danh sách menu dành riêng cho Sinh viên
  const menuItems = [
    { path: "/student", name: "Hồ Sơ Cá Nhân", icon: <FaUserAlt /> },
    { path: "/student/phong", name: "Thông Tin Phòng", icon: <FaBed /> },
    {
      path: "/student/hop-dong",
      name: "Thông Tin Hợp Đồng",
      icon: <FaFileSignature />,
    }, // Đã thêm mục này
    {
      path: "/student/hoa-don",
      name: "Hóa Đơn Thanh Toán",
      icon: <FaFileInvoiceDollar />,
    },
    { path: "/student/yeu-cau", name: "Gửi Yêu Cầu Hỗ Trợ", icon: <FaTools /> },
    { path: "/student/doi-mat-khau", name: "Đổi Mật Khẩu", icon: <FaKey /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR - Tông màu xanh ngọc (Teal) thân thiện */}
      <div className="w-64 bg-teal-700 text-white flex flex-col shadow-xl">
        <div className="h-16 flex items-center justify-center border-b border-teal-600 bg-teal-800">
          <h1 className="text-xl font-bold tracking-wider">CỔNG SINH VIÊN</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/student" &&
                  location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white text-teal-700 shadow-md font-bold"
                        : "text-teal-100 hover:bg-teal-600 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* KHU VỰC BÊN PHẢI */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <div className="text-lg font-semibold text-gray-700">
            Hệ Thống Quản Lý Ký Túc Xá
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Mã SV:{" "}
                <span className="font-bold text-teal-600">
                  {user?.username}
                </span>
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 text-sm px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="bg-white rounded-2xl shadow-sm min-h-full p-6 border border-gray-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
