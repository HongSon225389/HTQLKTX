import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaRandom, FaTrash, FaWalking } from "react-icons/fa";

export default function LogRaVao() {
  const [logs, setLogs] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/log-ra-vao?tuKhoa=${tuKhoa}&trangThai=${trangThai}`,
        config,
      );
      setLogs(res.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [tuKhoa, trangThai]);

  const handleRandomData = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/log-ra-vao/random",
        {},
        config,
      );
      fetchLogs();
      alert("Đã thêm 20 bản ghi ngẫu nhiên thành công!");
    } catch (error) {
      alert("Lỗi tạo data ảo: " + error.response?.data?.message);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) return;
    try {
      await axios.delete("http://localhost:5000/api/log-ra-vao/clear", config);
      fetchLogs();
    } catch (error) {
      alert("Lỗi xóa dữ liệu");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case "Bình thường":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Về muộn":
        return "bg-orange-100 text-orange-700 border border-orange-200 font-bold";
      case "Người lạ":
        return "bg-red-100 text-red-700 border border-red-200 font-bold";
      case "Chưa về":
        return "bg-gray-100 text-gray-600 border border-gray-200 italic";
      default:
        return "";
    }
  };

  return (
    <div className="w-full pb-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FaWalking className="text-[#2b78c5]" /> LOG RA / VÀO KTX
          </h2>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
            Quản lý an ninh & Giờ giấc
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRandomData}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all"
          >
            <FaRandom /> Tạo Data Ảo
          </button>
          <button
            onClick={handleClearData}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all"
          >
            <FaTrash /> Xóa tất cả
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sinh viên hoặc khách..."
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b78c5] font-semibold"
            />
          </div>
          <select
            value={trangThai}
            onChange={(e) => setTrangThai(e.target.value)}
            className="w-full md:w-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b78c5] font-semibold text-gray-700 cursor-pointer"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Bình thường">✅ Bình thường</option>
            <option value="Về muộn">⚠️ Về muộn (&gt;22h)</option>
            <option value="Chưa về">⏳ Chưa về</option>
            <option value="Người lạ">🚫 Người lạ</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Họ và Tên
                </th>
                <th className="py-4 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                  Phòng
                </th>
                <th className="py-4 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                  Thời gian Ra
                </th>
                <th className="py-4 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                  Thời gian Vào
                </th>
                <th className="py-4 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                  Ghi chú / Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-gray-800">
                      {log.tenHienThi}
                    </td>
                    <td className="py-4 px-4 font-semibold text-center text-[#2b78c5]">
                      {log.phong?.tenPhong || "---"}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-600 text-center">
                      {formatDate(log.thoiGianRa)}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-600 text-center">
                      {formatDate(log.thoiGianVao)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full inline-block ${getBadgeStyle(log.ghiChu)}`}
                      >
                        {log.ghiChu}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest"
                  >
                    Không có dữ liệu ra vào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
