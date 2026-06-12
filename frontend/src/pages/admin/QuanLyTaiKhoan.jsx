import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taiKhoanApi } from "../../services/taiKhoanApi";
import TaoTaiKhoanModal from "./TaoTaiKhoanModal";
import {
  FaSpinner,
  FaPlus,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUserShield,
  FaUserTie,
  FaWrench,
  FaUsersCog,
} from "react-icons/fa";

const QuanLyTaiKhoan = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await taiKhoanApi.getAll();
      if (res.success) setDanhSach(res.data);
    } catch (error) {
      toast.error("Không tải được danh sách tài khoản nội bộ!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, trangThaiHienTai) => {
    const action = trangThaiHienTai === "ACTIVE" ? "KHÓA" : "MỞ KHÓA";
    if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
      try {
        const res = await taiKhoanApi.toggleStatus(id);
        toast.success(res.message);
        fetchDanhSach();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lỗi thay đổi trạng thái!",
        );
      }
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Cảnh báo: Hành động này không thể hoàn tác! Bạn muốn xóa tài khoản này?",
      )
    ) {
      try {
        const res = await taiKhoanApi.delete(id);
        toast.success(res.message);
        fetchDanhSach();
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi xóa tài khoản!");
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="flex items-center gap-1 text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-xs font-bold">
            <FaUserShield /> SUPER ADMIN
          </span>
        );
      case "MANAGER":
        return (
          <span className="flex items-center gap-1 text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-xs font-bold">
            <FaUserTie /> MANAGER
          </span>
        );
      case "TECHNICIAN":
        return (
          <span className="flex items-center gap-1 text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-xs font-bold">
            <FaWrench /> TECHNICIAN
          </span>
        );
      default:
        return <span className="text-gray-500">{role}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUsersCog className="text-blue-800" /> Quản Lý Nhân Sự (Tài Khoản
          Nội Bộ)
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FaPlus /> Cấp Tài Khoản Mới
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nhân viên / Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tài khoản (Username)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Chức vụ (Role)
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : danhSach.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Chưa có tài khoản nhân sự nào được tạo.
                  </td>
                </tr>
              ) : (
                danhSach.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">
                        {user.fullName || "Chưa cập nhật tên"}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-xs text-gray-400">
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block text-sm">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${user.trangThai === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {user.trangThai === "ACTIVE"
                          ? "Đang Hoạt Động"
                          : "Đã Khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {user.role !== "SUPER_ADMIN" ? (
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() =>
                              handleToggleStatus(user._id, user.trangThai)
                            }
                            title={
                              user.trangThai === "ACTIVE"
                                ? "Khóa tài khoản"
                                : "Mở khóa"
                            }
                            className={`${user.trangThai === "ACTIVE" ? "text-amber-500 hover:text-amber-600" : "text-green-500 hover:text-green-600"}`}
                          >
                            {user.trangThai === "ACTIVE" ? (
                              <FaLock size={18} />
                            ) : (
                              <FaUnlock size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            title="Xóa vĩnh viễn"
                            className="text-red-400 hover:text-red-600"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Không thể thao tác
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaoTaiKhoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchDanhSach();
        }}
      />
    </div>
  );
};

export default QuanLyTaiKhoan;
