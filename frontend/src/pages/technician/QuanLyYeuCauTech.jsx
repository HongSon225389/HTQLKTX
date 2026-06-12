import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { yeuCauApi } from "../../services/yeuCauApi";
import { FaWrench, FaSpinner, FaSearch, FaTools, FaEye } from "react-icons/fa";
import XuLyYeuCauModal from "../admin/XuLyYeuCauModal";
import ChiTietYeuCauModal from "../student/ChiTietYeuCauModal";

const QuanLyYeuCauTech = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Lọc
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailYeuCau, setSelectedDetailYeuCau] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, filterTrangThai]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await yeuCauApi.getAll({
        page: currentPage,
        limit: 10,
        keyword: filterKeyword,
        trangThai: filterTrangThai,
      });
      if (res.success) {
        setDanhSach(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.totalRecords || 0);
      }
    } catch (e) {
      toast.error("Lỗi đồng bộ dữ liệu!");
    } finally {
      setLoading(false);
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
    if (status === "Đang xử lý") return "bg-orange-100 text-orange-700";
    if (status === "Hoàn thành") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500 text-white p-3 rounded-xl shadow-md">
          <FaWrench size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Trạm Tiếp Nhận Sự Cố
          </h2>
          <p className="text-sm text-gray-500">
            Danh sách báo hỏng điện, nước, tài sản từ sinh viên
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white p-3 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0"
      >
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm mã đơn, tiêu đề..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500 bg-gray-50 text-sm"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500 bg-gray-50 text-sm font-bold"
          value={filterTrangThai}
          onChange={(e) => {
            setFilterTrangThai(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Mọi trạng thái --</option>
          <option value="Chờ xử lý">🔴 Đang chờ thợ (Mới)</option>
          <option value="Đang xử lý">🟡 Đang đi sửa</option>
          <option value="Hoàn thành">🟢 Đã sửa xong</option>
        </select>
        <button
          type="submit"
          className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-800 transition text-sm"
        >
          Tìm
        </button>
      </form>

      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="px-6 py-3 text-left">Đơn / Người gửi</th>
                <th className="px-6 py-3 text-left">Sự cố / Vị trí</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-center">Người phụ trách</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <FaSpinner className="animate-spin text-2xl text-orange-500 mx-auto" />
                  </td>
                </tr>
              ) : danhSach.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
                    Ký túc xá đang ổn định, không có báo hỏng.
                  </td>
                </tr>
              ) : (
                danhSach.map((yc) => (
                  <tr key={yc._id} className="hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{yc.maYC}</div>
                      <div className="text-xs text-orange-600 font-bold mt-0.5">
                        {yc.sinhVien?.hoTen ||
                          yc.sinhVien?.fullName ||
                          "Không rõ"}{" "}
                        - {yc.sinhVien?.maSV}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {new Date(yc.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {yc.tieuDe}{" "}
                        {yc.mucDo === "Khẩn cấp" && (
                          <span className="text-red-500 text-xs">(Gấp)</span>
                        )}
                      </div>
                      <div className="text-xs font-black text-slate-700 mt-0.5">
                        {yc.loaiYeuCau} •{" "}
                        {yc.phong
                          ? `Phòng ${yc.phong.maPhong} (Tòa ${yc.phong.toaNha})`
                          : "Chưa xác định"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadge(yc.trangThai)}`}
                      >
                        {yc.trangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-600">
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
                        className="text-orange-700 hover:text-orange-800 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg inline-flex items-center justify-center gap-1.5 font-bold transition-colors text-xs"
                      >
                        <FaTools />{" "}
                        {yc.trangThai === "Chờ xử lý"
                          ? "Tiếp nhận"
                          : "Cập nhật"}
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
            Đang xem <span className="font-bold">{totalRecords}</span> sự cố
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-3 py-1 font-bold text-sm bg-orange-50 text-orange-600 border rounded">
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

      {/* MODAL XỬ LÝ */}
      <XuLyYeuCauModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        yeuCau={selectedYeuCau}
        userRole="TECHNICIAN"
      />

      {/* MODAL CHI TIẾT */}
      <ChiTietYeuCauModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        yeuCau={selectedDetailYeuCau}
        userRole="TECHNICIAN"
      />
    </div>
  );
};

export default QuanLyYeuCauTech;
