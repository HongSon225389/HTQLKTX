import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { hoaDonApi } from "../../services/hoaDonApi";
import ChiTietHoaDonModal from "../admin/ChiTietHoaDonModal";
import {
  FaFileInvoiceDollar,
  FaEye,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";

const SinhVienHoaDon = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quản lý Modal chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Bộ lọc
  const [filterThangNam, setFilterThangNam] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Tải dữ liệu khi thay đổi trang hoặc bộ lọc
  useEffect(() => {
    fetchMyInvoices();
  }, [currentPage, filterThangNam, filterTrangThai]);

  const fetchMyInvoices = async () => {
    setLoading(true);
    try {
      const res = await hoaDonApi.getAll({
        thangNam: filterThangNam,
        trangThai: filterTrangThai,
        page: currentPage,
        limit: 10,
      });
      if (res.success) {
        setDanhSach(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.totalRecords || 0);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách hóa đơn của bạn!");
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

  const handleXemChiTiet = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  // Tự động sinh mảng 12 tháng gần nhất cho bộ lọc
  const generateMonths = () => {
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

  // SẮP XẾP: Tháng mới nhất luôn lên đầu (Parse "05/2026" thành 202605 để so sánh)
  const sortedDanhSach = [...danhSach].sort((a, b) => {
    const getMonthValue = (str) => {
      if (!str) return 0;
      const [m, y] = str.split("/");
      return parseInt(y) * 100 + parseInt(m);
    };
    return getMonthValue(b.thangNam) - getMonthValue(a.thangNam);
  });

  // Tính toán nhanh số tiền chưa thanh toán để làm thẻ nhắc nhở
  const chuaThanhToanInvoices = sortedDanhSach.filter(
    (hd) => hd.trangThai === "Chưa thanh toán",
  );
  const tongTienConNo = chuaThanhToanInvoices.reduce(
    (sum, hd) => sum + hd.tongTien,
    0,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-gray-800">
      {/* TIÊU ĐỀ CHÍNH */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-md">
          <FaFileInvoiceDollar size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-emerald-900">
            Hóa Đơn & Học Phí KTX
          </h2>
          <p className="text-sm text-gray-500">
            Tra cứu và kiểm tra chi tiết các khoản thu hàng tháng của bạn
          </p>
        </div>
      </div>

      {/* THẺ TỔNG QUAN NHẮC NHỞ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            tongTienConNo > 0
              ? "bg-red-50 border-red-100 text-red-900 shadow-sm"
              : "bg-emerald-50 border-emerald-100 text-emerald-900 shadow-sm"
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Tổng tiền chưa đóng
            </p>
            <p className="text-2xl font-black">{formatMoney(tongTienConNo)}</p>
          </div>
          {tongTienConNo > 0 ? (
            <FaExclamationCircle
              className="text-red-500 animate-pulse"
              size={32}
            />
          ) : (
            <FaCheckCircle className="text-emerald-500" size={32} />
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Phiếu chờ thanh toán
            </p>
            <p className="text-2xl font-black text-gray-800">
              {chuaThanhToanInvoices.length}{" "}
              <span className="text-sm font-normal text-gray-500">hóa đơn</span>
            </p>
          </div>
          <FaCalendarAlt className="text-emerald-500" size={28} />
        </div>
      </div>

      {/* BỘ LỌC */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm">
        <select
          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:border-emerald-500 outline-none"
          value={filterThangNam}
          onChange={(e) => {
            setFilterThangNam(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Chọn kỳ thu (Tất cả) --</option>
          {generateMonths().map((m) => (
            <option key={m} value={m}>
              Kỳ tháng {m}
            </option>
          ))}
        </select>

        <select
          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:border-emerald-500 outline-none"
          value={filterTrangThai}
          onChange={(e) => {
            setFilterTrangThai(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Trạng thái thanh toán --</option>
          <option value="Chưa thanh toán">Chưa thanh toán</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
        </select>
      </div>

      {/* BẢNG DANH SÁCH HÓA ĐƠN */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mã Phiếu & Kỳ
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tiền Phòng
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Điện Nước
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Tổng Cần Đóng
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <FaSpinner className="animate-spin text-3xl text-emerald-500 mx-auto" />
                  </td>
                </tr>
              ) : sortedDanhSach.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Bạn không có hóa đơn nào trong danh sách.
                  </td>
                </tr>
              ) : (
                sortedDanhSach.map((hd) => (
                  <tr
                    key={hd._id}
                    className="hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">
                        Kỳ: {hd.thangNam}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono uppercase mt-0.5">
                        {hd.maHoaDon}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {formatMoney(hd.tienPhong)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {formatMoney(hd.tienDienNuoc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-black text-emerald-600 text-base">
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleXemChiTiet(hd._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <FaEye /> Xem Chi Tiết
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
        <div className="bg-white px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Đang xem{" "}
              <span className="font-medium">{sortedDanhSach.length}</span> /{" "}
              <span className="font-medium">{totalRecords}</span> phiếu
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
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-emerald-50 text-sm font-bold text-emerald-700">
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

      {/* CHI TIẾT HÓA ĐƠN MODAL */}
      <ChiTietHoaDonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hoaDonId={selectedId}
      />
    </div>
  );
};

export default SinhVienHoaDon;
