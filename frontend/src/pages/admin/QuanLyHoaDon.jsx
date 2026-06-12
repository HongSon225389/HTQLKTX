import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { hoaDonApi } from "../../services/hoaDonApi";
import TaoHoaDonModal from "./TaoHoaDonModal";
import {
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEye,
  FaCheckCircle,
  FaTrash,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import ChiTietHoaDonModal from "./ChiTietHoaDonModal";
const QuanLyHoaDon = () => {
  const [danhSachHoaDon, setDanhSachHoaDon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // State Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterThangNam, setFilterThangNam] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // State cho Modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHoaDonId, setSelectedHoaDonId] = useState(null);
  // Gọi API mỗi khi page hoặc bộ lọc thay đổi
  useEffect(() => {
    fetchDanhSach();
  }, [currentPage, filterThangNam, filterTrangThai]);

  // Reset về trang 1 nếu người dùng gõ tìm kiếm
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchDanhSach();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await hoaDonApi.getAll({
        keyword: searchTerm,
        trangThai: filterTrangThai,
        thangNam: filterThangNam,
        page: currentPage,
        limit: 20, // CHUẨN YÊU CẦU: Mỗi trang 20 dòng
      });
      if (res.success) {
        setDanhSachHoaDon(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalRecords(res.pagination.totalRecords);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // LOGIC SẮP XẾP ƯU TIÊN 3 CẤP (Tháng mới nhất -> Tên Phòng -> Tên SV)
  const sortedData = [...danhSachHoaDon].sort((a, b) => {
    // 1. So sánh Tháng (Parse VD: "05/2026" -> 202605)
    const getMonthValue = (str) => {
      if (!str) return 0;
      const [m, y] = str.split("/");
      return parseInt(y) * 100 + parseInt(m);
    };
    const monthDiff = getMonthValue(b.thangNam) - getMonthValue(a.thangNam); // B - A để xếp Giảm dần (Mới nhất lên đầu)
    if (monthDiff !== 0) return monthDiff;

    // 2. So sánh Tên Phòng (Tăng dần A-Z)
    const phongCompare = (a.phong?.maPhong || "").localeCompare(
      b.phong?.maPhong || "",
    );
    if (phongCompare !== 0) return phongCompare;

    // 3. So sánh Tên Sinh Viên (Tăng dần A-Z)
    return (a.sinhVien?.hoTen || "").localeCompare(b.sinhVien?.hoTen || "");
  });

  // Tự động sinh danh sách 12 tháng gần nhất cho Dropdown
  const generateMonthList = () => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      list.push(`${m}/${y}`);
      now.setMonth(now.getMonth() - 1);
    }
    return list;
  };
  const listThangNam = generateMonthList();
  // ACTION 1: Xem chi tiết
  const handleXemChiTiet = (id) => {
    setSelectedHoaDonId(id);
    setIsDetailModalOpen(true);
  };

  // ACTION 2: Xác nhận thu tiền
  const handleThanhToan = async (id) => {
    if (window.confirm("Xác nhận đã thu tiền mặt cho hóa đơn này?")) {
      try {
        const res = await hoaDonApi.xacNhanThanhToan(id);
        toast.success(res.message || "Xác nhận thanh toán thành công!");
        fetchDanhSach(); // Load lại dữ liệu để cập nhật cục diện
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lỗi xác nhận thanh toán!",
        );
      }
    }
  };

  // ACTION 3: Xóa hóa đơn
  const handleXoaHoaDon = async (id) => {
    if (
      window.confirm(
        "Hành động này không thể hoàn tác! Bạn có chắc chắn muốn xóa hóa đơn này?",
      )
    ) {
      try {
        const res = await hoaDonApi.delete(id);
        toast.success(res.message || "Đã xóa hóa đơn!");
        fetchDanhSach();
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi xóa hóa đơn!");
      }
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaFileInvoiceDollar className="text-blue-600" /> Quản Lý Hóa Đơn &
          Thu Phí
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FaPlus /> Tạo Hóa Đơn Mới
        </button>
      </div>

      {/* THANH CÔNG CỤ (FILTERS) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 text-sm"
            placeholder="Tìm theo mã HĐ, tên SV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white min-w-[150px]"
          value={filterThangNam}
          onChange={(e) => setFilterThangNam(e.target.value)}
        >
          <option value="">-- Tất cả các kỳ --</option>
          {listThangNam.map((thang) => (
            <option key={thang} value={thang}>
              Kỳ: {thang}
            </option>
          ))}
        </select>

        <select
          className="py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white min-w-[180px]"
          value={filterTrangThai}
          onChange={(e) => setFilterTrangThai(e.target.value)}
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="Chưa thanh toán">Chưa thanh toán</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
        </select>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hóa đơn & SV
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Phòng / Kỳ
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tiền Phòng
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Điện Nước
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Tổng Cộng
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
                  <td colSpan="7" className="px-6 py-10 text-center">
                    <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy dữ liệu hóa đơn nào.
                  </td>
                </tr>
              ) : (
                sortedData.map((hd) => (
                  <tr
                    key={hd._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">
                        {hd.sinhVien?.hoTen || "Không rõ"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {hd.sinhVien?.maSV}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 uppercase">
                        {hd.maHoaDon}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">
                        {hd.phong?.maPhong}
                      </div>
                      <div className="text-xs text-gray-500">
                        {hd.phong?.toaNha}
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        Kỳ: {hd.thangNam}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-medium">
                      {formatMoney(hd.tienPhong)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-medium">
                      {formatMoney(hd.tienDienNuoc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600 text-base">
                      {formatMoney(hd.tongTien)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          hd.trangThai === "Đã thanh toán"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {hd.trangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        {/* Nút Xem */}
                        <button
                          onClick={() => handleXemChiTiet(hd._id)}
                          title="Xem chi tiết"
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <FaEye size={18} />
                        </button>

                        {hd.trangThai === "Chưa thanh toán" && (
                          <>
                            {/* Nút Thanh Toán */}
                            <button
                              onClick={() => handleThanhToan(hd._id)}
                              title="Xác nhận thu tiền"
                              className="text-green-500 hover:text-green-700"
                            >
                              <FaCheckCircle size={18} />
                            </button>

                            {/* Nút Xóa */}
                            <button
                              onClick={() => handleXoaHoaDon(hd._id)}
                              title="Xóa hóa đơn"
                              className="text-red-400 hover:text-red-600"
                            >
                              <FaTrash size={16} />
                            </button>
                          </>
                        )}
                      </div>
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
        <div className="bg-white px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">{sortedData.length}</span> trên
                tổng số <span className="font-medium">{totalRecords}</span> hóa
                đơn
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                >
                  Trước
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-bold text-blue-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                >
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <TaoHoaDonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchDanhSach();
        }}
      />
      <ChiTietHoaDonModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        hoaDonId={selectedHoaDonId}
      />
    </div>
  );
};

export default QuanLyHoaDon;
