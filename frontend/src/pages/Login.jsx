import React, { useState } from "react";
import axios from "axios";
import { FaUserShield, FaLock, FaUser, FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/dang-nhap",
        formData,
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

        alert("Đăng nhập thành công!");

        window.location.href = "/";
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại!",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-gray-50 relative overflow-hidden">
        {/* Trang trí nền nhẹ */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="text-center mb-12 relative">
          <div className="inline-flex p-6 bg-blue-600 rounded-[2rem] mb-6 shadow-lg shadow-blue-200">
            <FaUserShield size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
            Hệ thống KTX
          </h2>
          <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mt-3">
            Cổng điều hành quản lý nội trú
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          {/* Ô nhập Tài khoản */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-5 tracking-widest">
              Tài khoản quản trị
            </label>
            <div className="relative">
              <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Nhập tên đăng nhập..."
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] py-4.5 pl-14 pr-6 font-bold text-gray-700 outline-none transition-all"
                value={formData.taiKhoan}
                // Cập nhật đúng trường taiKhoan
                onChange={(e) =>
                  setFormData({ ...formData, taiKhoan: e.target.value })
                }
              />
            </div>
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-5 tracking-widest">
              Mật khẩu bảo mật
            </label>
            <div className="relative">
              <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] py-4.5 pl-14 pr-6 font-bold text-gray-700 outline-none transition-all"
                value={formData.matKhau}
                // Cập nhật đúng trường matKhau
                onChange={(e) =>
                  setFormData({ ...formData, matKhau: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              <FaSignInAlt /> Đăng nhập ngay
            </button>
          </div>
        </form>

        <p className="text-center mt-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          &copy; 2026 Dormitory Management System
        </p>
      </div>
    </div>
  );
}
