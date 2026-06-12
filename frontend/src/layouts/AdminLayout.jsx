import { useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaHome,
  FaUsers,
  FaBed,
  FaClipboardList,
  FaFileContract,
  FaFileInvoiceDollar,
  FaCubes,
  FaHeadset,
  FaSignOutAlt,
  FaUsersCog,
} from "react-icons/fa";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // Dùng để lấy đường dẫn hiện tại, tô màu menu đang active

  // Danh sách các menu dựa trên Class Diagram của bạn
  const menuItems = [
    { path: "/admin", name: "Tổng Quan", icon: <FaHome /> },
    {
      path: "/admin/don-dang-ky",
      name: "Duyệt Đăng Ký",
      icon: <FaClipboardList />,
    },
    { path: "/admin/sinh-vien", name: "Quản Lý Sinh Viên", icon: <FaUsers /> },
    { path: "/admin/phong", name: "Quản Lý Phòng", icon: <FaBed /> },
    {
      path: "/admin/hop-dong",
      name: "Quản Lý Hợp Đồng",
      icon: <FaFileContract />,
    },
    {
      path: "/admin/hoa-don",
      name: "Quản Lý Hóa Đơn",
      icon: <FaFileInvoiceDollar />,
    },
    { path: "/admin/tai-san", name: "Quản Lý Tài Sản", icon: <FaCubes /> },
    ...(user?.role === "SUPER_ADMIN"
      ? [
          {
            path: "/admin/nhan-su",
            name: "Quản Lý Nhân Sự",
            icon: <FaUsersCog />,
          },
        ]
      : []),
    { path: "/admin/yeu-cau", name: "Yêu Cầu Hỗ Trợ", icon: <FaHeadset /> },
  ];
  // if (user?.role === "SUPER_ADMIN") {
  //   menuItems.push({
  //     path: "/admin/nhan-su",
  //     name: "Quản Lý Nhân Sự",
  //     icon: <FaUsersCog />,
  //   });
  // }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR - Thanh menu bên trái */}
      <div className="w-64 bg-slate-800 text-white flex flex-col shadow-xl">
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">KTX ADMIN</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              // Kiểm tra xem menu này có đang được chọn không
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
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

      {/* KHU VỰC BÊN PHẢI (Header + Nội dung chính) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="text-xl font-semibold text-gray-800">
            Hệ Thống Quản Lý Ký Túc Xá
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">
              Xin chào,{" "}
              <span className="text-blue-600 font-bold">
                {user?.username || "Admin"}
              </span>
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT - Nội dung các trang con sẽ được render vào đây */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="bg-white rounded-xl shadow-sm min-h-full p-6 border border-gray-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
