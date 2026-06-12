import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { yeuCauApi } from "../../services/yeuCauApi";
import { taiKhoanApi } from "../../services/taiKhoanApi";
import {
  FaHeadset,
  FaSpinner,
  FaSearch,
  FaUserCog,
  FaEye,
} from "react-icons/fa";
import XuLyYeuCauModal from "./XuLyYeuCauModal";
import ChiTietYeuCauModal from "../student/ChiTietYeuCauModal";

const QuanLyYeuCau = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachTho, setDanhSachTho] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Bộ lọc
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [filterNhom, setFilterNhom] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailYeuCau, setSelectedDetailYeuCau] = useState(null);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, filterTrangThai, filterNhom]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await yeuCauApi.getAll({
        page: currentPage,
        limit: 10,
        keyword: filterKeyword,
        trangThai: filterTrangThai,
        nhomYeuCau: filterNhom,
      });
      if (res.success) {
        setDanhSach(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.totalRecords || 0);
      }
    } catch (e) {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await taiKhoanApi.getAll({ role: "TECHNICIAN", limit: 100 });
      if (res.success) setDanhSachTho(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const openProcessModal = (yc) => {
    setSelectedYeuCau(yc);
    setIsModalOpen(true);
  };

  const openDetailModal = (yc) => {
    setSelectedDetailYeuCau(yc);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    if (status === "Chờ xử lý") return "bg-gray-100 text-gray-600";
    if (status === "Đang xử lý") return "bg-blue-100 text-blue-700";
    if (status === "Hoàn thành") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-1 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaHeadset className="text-blue-700" /> Quản Lý Yêu Cầu Hỗ Trợ
        </h2>
      </div>

      {/* Tabs Phân Luồng */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        <button
          onClick={() => {
            setFilterNhom("");
            setCurrentPage(1);
          }}
          className={`pb-2 px-2 font-bold ${filterNhom === "" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500"}`}
        >
          Tất cả đơn
        </button>
        <button
          onClick={() => {
            setFilterNhom("Hành chính");
            setCurrentPage(1);
          }}
          className={`pb-2 px-2 font-bold ${filterNhom === "Hành chính" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500"}`}
        >
          📄 Hành chính / Giấy tờ
        </button>
        <button
          onClick={() => {
            setFilterNhom("Kỹ thuật");
            setCurrentPage(1);
          }}
          className={`pb-2 px-2 font-bold ${filterNhom === "Kỹ thuật" ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500"}`}
        >
          🛠 Kỹ thuật / Sửa chữa
        </button>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white p-3 rounded-xl border border-gray-200 mb-4 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0"
      >
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã YC, tiêu đề..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-gray-50 text-sm"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50 text-sm"
          value={filterTrangThai}
          onChange={(e) => {
            setFilterTrangThai(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Trạng thái --</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 text-sm"
        >
          Tìm kiếm
        </button>
      </form>

      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 font-bold text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Đơn / Người gửi</th>
                <th className="px-6 py-3 text-left">Vấn đề</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-center">Người xử lý</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : danhSach.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                danhSach.map((yc) => (
                  <tr key={yc._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{yc.maYC}</div>
                      <div className="text-xs text-blue-700 font-bold mt-0.5">
                        {yc.sinhVien?.hoTen ||
                          yc.sinhVien?.fullName ||
                          "Không rõ"}{" "}
                        - {yc.sinhVien?.maSV}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {new Date(yc.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {yc.tieuDe}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-1 uppercase">
                        {yc.nhomYeuCau} - {yc.loaiYeuCau}
                        {yc.phong && (
                          <span className="ml-1 text-blue-600 font-bold">
                            (P.{yc.phong.maPhong})
                          </span>
                        )}
                      </div>
                      {yc.mucDo === "Khẩn cấp" && (
                        <span className="text-[10px] text-red-500 font-bold">
                          Khẩn cấp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadge(yc.trangThai)}`}
                      >
                        {yc.trangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-teal-700">
                      {yc.nhanVienXuLy ? yc.nhanVienXuLy.fullName : "-"}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openDetailModal(yc)}
                        className="text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Xem chi tiết"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => openProcessModal(yc)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg inline-flex items-center justify-center gap-1 font-medium transition-colors text-xs"
                        title="Xử lý / Phân công"
                      >
                        <FaUserCog size={14} /> Xử lý
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="bg-white px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl flex justify-between items-center shrink-0">
          <p className="text-sm text-gray-700">
            Tổng <span className="font-bold">{totalRecords}</span> đơn
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-3 py-1 font-bold text-sm bg-blue-50 text-blue-700 border rounded">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* MODAL XỬ LÝ (Phân việc) */}
      <XuLyYeuCauModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        yeuCau={selectedYeuCau}
        userRole="MANAGER"
        danhSachTho={danhSachTho}
      />

      {/* MODAL CHI TIẾT */}
      <ChiTietYeuCauModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        yeuCau={selectedDetailYeuCau}
        userRole="MANAGER"
      />
    </div>
  );
};

export default QuanLyYeuCau;
