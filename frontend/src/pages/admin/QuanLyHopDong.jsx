import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaCalendarPlus,
  FaFileSignature,
  FaTrashAlt,
  FaSpinner,
} from "react-icons/fa";
import { hopDongApi } from "../../services/hopDongApi";
import { toast } from "react-toastify";
import TaoHopDongModal from "./TaoHopDongModal";
import GiaHanHopDongModal from "./GiaHanHopDongModal";

const QuanLyHopDong = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // States quản lý đóng mở Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isGiaHanOpen, setIsGiaHanOpen] = useState(false);
  const [selectedHD, setSelectedHD] = useState(null);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await hopDongApi.getAll({
        keyword,
        trangThai,
        page,
        limit: 10,
      });
      setDanhSach(res.data);
      setPagination(res.pagination);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi tải danh sách hợp đồng!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, [page, trangThai]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDanhSach();
  };

  // Hàm xử lý Thanh lý Hợp đồng
  const handleThanhLy = async (hd) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn THANH LÝ hợp đồng ${hd.maHD} của SV ${hd.sinhVien?.hoTen}?`,
      )
    ) {
      try {
        const res = await hopDongApi.thanhLy(hd._id);
        if (res.success) {
          toast.success("Thanh lý hợp đồng thành công!");
          fetchDanhSach();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lỗi khi thanh lý hợp đồng!",
        );
      }
    }
  };

  // Hàm định dạng hiển thị tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm định dạng ngày hiển thị (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📝 Quản Lý Hợp Đồng Lưu Trú
        </h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <FaPlus /> Lập Hợp Đồng Mới (Xếp Phòng)
        </button>
      </div>

      {/* THANH BỘ LỌC TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-100 rounded-xl px-3 py-2 w-full max-w-md"
        >
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm theo Mã Hợp Đồng..."
            className="bg-transparent outline-none w-full text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="hidden">
            Tìm
          </button>
        </form>

        <select
          value={trangThai}
          onChange={(e) => setTrangThai(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 outline-none focus:border-blue-500"
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="Hiệu lực">Hiệu lực</option>
          <option value="Hết hạn">Hết hạn</option>
          <option value="Đã thanh lý">Đã thanh lý</option>
        </select>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold text-sm uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">Mã HD</th>
                  <th className="py-4 px-6">Sinh Viên</th>
                  <th className="py-4 px-6">Phòng / Tòa</th>
                  <th className="py-4 px-6">Thời Hạn</th>
                  <th className="py-4 px-6">Tiền Cọc</th>
                  <th className="py-4 px-6 text-center">Trạng Thái</th>
                  <th className="py-4 px-6 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {danhSach.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      Không tìm thấy bản ghi hợp đồng nào.
                    </td>
                  </tr>
                ) : (
                  danhSach.map((hd) => (
                    <tr
                      key={hd._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-blue-600">
                        {hd.maHD}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold">
                          {hd.sinhVien?.hoTen}
                        </div>
                        <div className="text-xs text-gray-400">
                          MSV: {hd.sinhVien?.maSV}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-semibold mr-1">
                          {hd.phong?.maPhong}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({hd.phong?.toaNha})
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <div>Bắt đầu: {formatDate(hd.ngayBatDau)}</div>
                        <div className="mt-1 text-red-500 font-medium">
                          Hết hạn: {formatDate(hd.ngayKetThuc)}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {formatCurrency(hd.tienCoc)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            hd.trangThai === "Hiệu lực"
                              ? "bg-green-100 text-green-700"
                              : hd.trangThai === "Hết hạn"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {hd.trangThai}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center flex items-center justify-center gap-3">
                        {/* Nút gia hạn */}
                        <button
                          disabled={hd.trangThai === "Đã thanh lý"}
                          onClick={() => {
                            setSelectedHD(hd);
                            setIsGiaHanOpen(true);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            hd.trangThai === "Đã thanh lý"
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-amber-500 hover:bg-amber-50"
                          }`}
                          title="Gia hạn hợp đồng"
                        >
                          <FaCalendarPlus className="text-lg" />
                        </button>

                        {/* Nút thanh lý */}
                        <button
                          disabled={hd.trangThai === "Đã thanh lý"}
                          onClick={() => handleThanhLy(hd)}
                          className={`p-2 rounded-lg transition-colors ${
                            hd.trangThai === "Đã thanh lý"
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title="Thanh lý & Trả phòng"
                        >
                          <FaFileSignature className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ĐOẠN PHÂN TRANG (PAGINATION) */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-500">
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* ĐĂNG KÝ CÁC MODAL THÀNH PHẦN */}
      {isCreateOpen && (
        <TaoHopDongModal
          onClose={() => setIsCreateOpen(false)}
          onRefresh={fetchDanhSach}
        />
      )}
      {isGiaHanOpen && (
        <GiaHanHopDongModal
          contract={selectedHD}
          onClose={() => setIsGiaHanOpen(false)}
          onRefresh={fetchDanhSach}
        />
      )}
    </div>
  );
};

export default QuanLyHopDong;
