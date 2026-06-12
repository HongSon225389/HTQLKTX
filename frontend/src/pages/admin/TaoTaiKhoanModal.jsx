import React, { useState } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { taiKhoanApi } from "../../services/taiKhoanApi";

const TaoTaiKhoanModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    role: "MANAGER", // Mặc định là Quản lý
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await taiKhoanApi.create(formData);
      toast.success(res.message || "Tạo tài khoản thành công!");
      // Reset form
      setFormData({
        username: "",
        password: "",
        email: "",
        fullName: "",
        phone: "",
        role: "MANAGER",
      });
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all flex flex-col">
        <div className="bg-blue-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaUserPlus /> Cấp Tài Khoản Nội Bộ
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form
            id="tao-tai-khoan-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quyền hạn (Role) *
              </label>
              <select
                name="role"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50 font-bold text-blue-700"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="MANAGER">MANAGER - Quản lý / Kế toán</option>
                <option value="TECHNICIAN">TECHNICIAN - Kỹ thuật viên</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Họ và Tên
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 shrink-0 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="tao-tai-khoan-form"
            disabled={loading}
            className="px-4 py-2 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Đang xử lý..." : "Cấp Tài Khoản"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaoTaiKhoanModal;
