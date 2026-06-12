import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { sinhVienApi } from "../../services/sinhVienApi";
import {
  FaSpinner,
  FaSearch,
  FaUserGraduate,
  FaPlus,
  FaEdit,
  FaLock,
  FaUnlock,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import SinhVienModal from "./SinhVienModal";
import ChiTietSinhVienModal from "./ChiTietSinhVienModal";

const QuanLySinhVien = () => {
  const [danhSachSV, setDanhSachSV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // STATE LỌC PHÒNG MỚI
  const [locPhong, setLocPhong] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSV, setSelectedSV] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSV, setViewingSV] = useState(null);

  useEffect(() => {
    fetchDanhSach();
  }, []);

  // Tự động quay về trang 1 mỗi khi người dùng gõ tìm kiếm hoặc đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locPhong]);

  const fetchDanhSach = async () => {
    try {
      const res = await sinhVienApi.getAll();
      if (res.success) {
        setDanhSachSV(res.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedSV(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sv) => {
    setSelectedSV(sv);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSV(null);
  };

  const openViewModal = (sv) => {
    setViewingSV(sv);
    setIsViewModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    setModalLoading(true);
    try {
      if (selectedSV) {
        const res = await sinhVienApi.update(selectedSV._id, formData);
        if (res.success) toast.success("Cập nhật thông tin thành công!");
      } else {
        const res = await sinhVienApi.create(formData);
        if (res.success)
          toast.success("Thêm sinh viên và cấp tài khoản thành công!");
      }
      fetchDanhSach();
      handleCloseModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleLock = async (sv) => {
    if (!sv.user || !sv.user._id) {
      toast.warning("Sinh viên này chưa có tài khoản hệ thống!");
      return;
    }

    const isLocked = sv.user.trangThai === "LOCKED";
    const actionText = isLocked ? "Mở khóa" : "Khóa";

    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${actionText} tài khoản của ${sv.hoTen} không?`,
      )
    ) {
      try {
        let res;
        if (isLocked) {
          res = await sinhVienApi.unlockAccount(sv.user._id);
        } else {
          res = await sinhVienApi.lockAccount(sv.user._id);
        }

        if (res.success) {
          toast.success(`Đã ${actionText.toLowerCase()} tài khoản thành công!`);
          fetchDanhSach();
        }
      } catch (error) {
        toast.error(`Có lỗi xảy ra khi ${actionText.toLowerCase()} tài khoản`);
      }
    }
  };

  // ==========================================
  // LOGIC TÌM KIẾM KẾP HỢP LỌC PHÒNG
  // ==========================================
  const filteredList = danhSachSV.filter((sv) => {
    // 1. Kiểm tra từ khóa tìm kiếm
    const matchSearch =
      sv.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.maSV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.cccd?.includes(searchTerm);

    // 2. Kiểm tra bộ lọc phòng
    let matchPhong = true;
    if (locPhong === "CO_PHONG") matchPhong = !!sv.phong; // Có ID phòng
    if (locPhong === "KHONG_PHONG") matchPhong = !sv.phong; // Phòng là null

    return matchSearch && matchPhong;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserGraduate className="text-blue-600" /> Quản Lý Sinh Viên
        </h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FaPlus /> Thêm Sinh Viên
        </button>
      </div>

      {/* THANH TÌM KIẾM VÀ BỘ LỌC */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Tìm theo tên, mã SV, hoặc số CCCD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* THÊM DROP DOWN LỌC PHÒNG */}
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            value={locPhong}
            onChange={(e) => setLocPhong(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 cursor-pointer"
          >
            <option value="">-- Tất cả tình trạng lưu trú --</option>
            <option value="CO_PHONG">Đang có phòng</option>
            <option value="KHONG_PHONG">Chưa có / Đã trả phòng</option>
          </select>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Họ Tên / Mã SV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thông tin cá nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Phòng ở
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy sinh viên nào.
                  </td>
                </tr>
              ) : (
                currentItems.map((sv) => (
                  <tr key={sv._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {sv.hoTen}
                      </div>
                      <div className="text-sm text-blue-600 font-semibold">
                        {sv.maSV}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Giới tính: {sv.gioiTinh}
                      </div>
                      <div className="text-sm text-gray-500">
                        CCCD: {sv.cccd}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sv.sdt}</div>
                      <div className="text-sm text-gray-500">{sv.email}</div>
                    </td>
                    {/* CỘT HIỂN THỊ PHÒNG Ở */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {sv.phong ? (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-bold text-xs">
                          P.{sv.phong.maPhong}{" "}
                          {sv.phong.toaNha ? `(${sv.phong.toaNha})` : ""}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-xs">
                          Chưa xếp phòng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewModal(sv)}
                        className="text-gray-500 hover:text-gray-800 mr-4 transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye className="inline text-lg" />
                      </button>
                      <button
                        onClick={() => openEditModal(sv)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        title="Sửa thông tin"
                      >
                        <FaEdit className="inline text-lg" />
                      </button>
                      <button
                        onClick={() => handleToggleLock(sv)}
                        className={`${
                          sv.user?.trangThai === "LOCKED"
                            ? "text-green-500 hover:text-green-700"
                            : "text-red-500 hover:text-red-700"
                        } transition-colors`}
                        title={
                          sv.user?.trangThai === "LOCKED"
                            ? "Mở khóa tài khoản"
                            : "Khóa tài khoản"
                        }
                      >
                        {sv.user?.trangThai === "LOCKED" ? (
                          <FaUnlock className="inline text-lg" />
                        ) : (
                          <FaLock className="inline text-lg" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* GIAO DIỆN PHÂN TRANG */}
        {filteredList.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Đang xem{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredList.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{filteredList.length}</span>{" "}
                  sinh viên
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1 ? "z-10 bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <SinhVienModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        sinhVienData={selectedSV}
        loading={modalLoading}
      />
      <ChiTietSinhVienModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        sinhVien={viewingSV}
      />
    </div>
  );
};

export default QuanLySinhVien;
