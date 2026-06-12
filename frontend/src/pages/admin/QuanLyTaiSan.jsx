import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taiSanApi } from "../../services/taiSanApi";
import { phongApi } from "../../services/phongApi";
import {
  FaBoxes,
  FaPlus,
  FaTrash,
  FaPen,
  FaSpinner,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import TaiSanModal from "./TaiSanModal";
import ChiTietTaiSanModal from "./ChiTietTaiSanModal";
const QuanLyTaiSan = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaiSan, setSelectedTaiSan] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  // Quản lý Phân trang & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTinhTrang, setFilterTinhTrang] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, filterTinhTrang]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await taiSanApi.getAll({
        page: currentPage,
        limit: 10,
        keyword: filterKeyword,
        tinhTrang: filterTinhTrang,
      });
      if (res.success) {
        setDanhSach(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.totalRecords || 0);
      }
    } catch (e) {
      toast.error("Lỗi tải danh sách tài sản!");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await phongApi.getAll({ limit: 100 });
      if (res.success) setDanhSachPhong(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const openModal = (taiSan = null) => {
    setSelectedTaiSan(taiSan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài sản này?")) {
      try {
        await taiSanApi.delete(id);
        toast.success("Đã xóa tài sản!");
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể xóa tài sản!");
      }
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Tốt") return "bg-green-100 text-green-700";
    if (status === "Đang sửa chữa") return "bg-amber-100 text-amber-700";
    if (status === "Thanh lý") return "bg-gray-200 text-gray-700";
    return "bg-red-100 text-red-700";
  };
  const handleViewDetail = (ts) => {
    setSelectedDetailItem(ts);
    setIsDetailModalOpen(true);
  };
  return (
    <div className="p-1 flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBoxes className="text-blue-700" /> Quản Lý Kho Tài Sản KTX
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm"
        >
          <FaPlus /> Thêm Tài Sản
        </button>
      </div>

      {/* THANH TÌM KIẾM & LỌC */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0"
      >
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên thiết bị..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-gray-50 text-sm"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50 text-sm"
          value={filterTinhTrang}
          onChange={(e) => {
            setFilterTinhTrang(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="Tốt">Tốt</option>
          <option value="Hỏng">Hỏng</option>
          <option value="Đang sửa chữa">Đang sửa chữa</option>
          <option value="Thanh lý">Thanh lý</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
        >
          Tìm kiếm
        </button>
      </form>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 font-bold text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Mã & Tên thiết bị</th>
                <th className="px-6 py-3 text-center">Số lượng</th>
                <th className="px-6 py-3 text-left">Vị trí (Phòng)</th>
                <th className="px-6 py-3 text-center">Tình trạng</th>
                <th className="px-6 py-3 text-left">Ghi chú bảo trì</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : danhSach.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    Chưa có tài sản nào phù hợp.
                  </td>
                </tr>
              ) : (
                danhSach.map((ts) => (
                  <tr key={ts._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{ts.tenTS}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {ts.maTS}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {ts.soLuong}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-700">
                      {ts.phong?.maPhong
                        ? `Phòng ${ts.phong.maPhong}`
                        : "Trong kho"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusStyle(ts.tinhTrang)}`}
                      >
                        {ts.tinhTrang}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {ts.ghiChu || "-"}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(ts)}
                        title="Xem chi tiết"
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openModal(ts)}
                        title="Sửa thông tin"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleDelete(ts._id)}
                        title="Xóa tài sản"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* THANH PHÂN TRANG */}
      {totalPages > 0 && (
        <div className="bg-white px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl flex items-center justify-between shrink-0">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Tổng cộng <span className="font-medium">{totalRecords}</span> tài
              sản
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
              >
                Trước
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-bold text-blue-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* COMPONENT MODAL ĐƯỢC GỌI Ở ĐÂY */}
      <TaiSanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData} // Refresh bảng khi thêm/sửa thành công
        taiSanEdit={selectedTaiSan}
        danhSachPhong={danhSachPhong}
      />
      <ChiTietTaiSanModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        taiSan={selectedDetailItem}
      />
    </div>
  );
};

export default QuanLyTaiSan;
