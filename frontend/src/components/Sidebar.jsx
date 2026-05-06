import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBed,
  FaUserGraduate,
  FaFileContract,
  FaLightbulb,
  FaTools,
  FaClipboardList,
  FaChartPie,
  FaFileInvoiceDollar,
} from "react-icons/fa";

export default function Sidebar() {
  const menuItems = [
    { path: "/", name: "Trang chủ", icon: <FaHome /> },
    { path: "/phong", name: "Quản lý phòng", icon: <FaBed /> },
    { path: "/sinh-vien", name: "Quản lý sinh viên", icon: <FaUserGraduate /> },
    { path: "/hop-dong", name: "Quản lý hợp đồng", icon: <FaFileContract /> },
    { path: "/dien-nuoc", name: "Quản lý điện nước", icon: <FaLightbulb /> },
    { path: "/hoadon", name: "Quản lý hóa đơn", icon: <FaFileInvoiceDollar /> },
    { path: "/vat-tu", name: "Cơ sở vật chất", icon: <FaTools /> },
    { path: "/log-ra-vao", name: "Log ra/vào KTX", icon: <FaClipboardList /> },
    { path: "/bao-cao", name: "Báo cáo thống kê", icon: <FaChartPie /> },
  ];

  return (
    <div className="w-[250px] min-h-screen bg-[#2b78c5] text-white flex flex-col shadow-lg">
      <div className="p-5 border-b border-white/10 mt-2">
        <h3 className="text-xl font-semibold tracking-wider italic">
          Quản lý Ký túc xá
        </h3>
      </div>

      <ul className="flex-1 py-4 flex flex-col">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-5 py-4 transition-all duration-200 border-l-4 ${
                  isActive
                    ? "bg-black/10 border-white font-medium"
                    : "border-transparent hover:bg-black/5 hover:border-white/50 text-white/90"
                }`
              }
            >
              <span className="mr-4 text-xl">{item.icon}</span>
              <span className="text-[15px]">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
