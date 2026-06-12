import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { donDangKyApi } from "../../services/donDangKyApi";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const DonDangKy = () => {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // State cho Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // State quản lý việc hiển thị cửa sổ nhập lý do từ chối
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDonId, setSelectedDonId] = useState(null);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDanhSach();
  }, []);

  // Tự động quay về trang 1 khi tìm kiếm hoặc lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchDanhSach = async () => {
    try {
      const res = await donDangKyApi.getAll({ limit: 100 });
      if (res.success) {
        const sortedData = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setDanhSachDon(sortedData);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đơn đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleDuyetDon = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn duyệt đơn này và tạo tài khoản cho sinh viên?",
      )
    )
      return;

    try {
      const res = await donDangKyApi.duyetDon(id);
      if (res.success) {
        toast.success("Duyệt đơn thành công! Đã tạo tài khoản cho sinh viên.");
        fetchDanhSach();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi duyệt đơn");
    }
  };

  // Mở hộp thoại nhập lý do từ chối
  const openRejectModal = (id) => {
    setSelectedDonId(id);
    setLyDoTuChoi("");
    setShowRejectModal(true);
  };

  // Gửi yêu cầu từ chối lên backend
  const handleTuChoiDon = async (e) => {
    e.preventDefault();
    if (!lyDoTuChoi.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await donDangKyApi.tuChoiDon(selectedDonId, lyDoTuChoi);
      if (res.success) {
        toast.success("Đã từ chối đơn đăng ký thành công!");
        setShowRejectModal(false);
        fetchDanhSach();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi từ chối đơn");
    } finally {
      setSubmitting(false);
    }
  };

  // Logic tìm kiếm và lọc trạng thái
  const filteredDonList = danhSachDon.filter((don) => {
    const matchSearch =
      don.hoTenKhach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      don.maSV?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "All" ? true : don.trangThai === filterStatus;
    return matchSearch && matchStatus;
  });

  // ==========================================
  // TÍNH TOÁN PHÂN TRANG
  // ==========================================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // ==========================================

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản Lý Đơn Đăng Ký
        </h2>
      </div>

      {/* Thanh công cụ tìm kiếm & bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Tìm theo tên, mã SV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <FaFilter className="text-gray-400" />
          <select
            className="block w-full md:w-48 py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ Tên / Mã SV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên Hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng Đăng Ký
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy đơn đăng ký nào phù hợp.
                </td>
              </tr>
            ) : (
              currentItems.map((don) => (
                <tr
                  key={don._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {don.hoTenKhach}
                    </div>
                    <div className="text-sm text-gray-500">
                      Mã SV: {don.maSV}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{don.sdt}</div>
                    <div className="text-sm text-gray-500">{don.cccd}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {don.loaiPhong?.tenLoaiPhong || "Chưa rõ loại phòng"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {don.soThangDangKy} tháng
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        don.trangThai === "Chờ duyệt"
                          ? "bg-yellow-100 text-yellow-800"
                          : don.trangThai === "Đã duyệt"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {don.trangThai || "Chờ duyệt"}
                    </span>
                    {don.trangThai === "Từ chối" && don.lyDoTuChoi && (
                      <div
                        className="text-xs text-red-500 max-w-[180px] truncate mt-1"
                        title={don.lyDoTuChoi}
                      >
                        Lý do: {don.lyDoTuChoi}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {don.trangThai === "Chờ duyệt" && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDuyetDon(don._id)}
                          className="inline-flex items-center space-x-1 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors border border-green-200"
                        >
                          <FaCheckCircle />
                          <span>Duyệt Đơn</span>
                        </button>

                        <button
                          onClick={() => openRejectModal(don._id)}
                          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors border border-red-200"
                        >
                          <FaTimesCircle />
                          <span>Từ Chối</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG               */}
      {/* ========================================== */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Đang xem{" "}
            <span className="font-semibold text-gray-900">
              {indexOfFirstItem + 1}
            </span>{" "}
            đến{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(indexOfLastItem, filteredDonList.length)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold text-gray-900">
              {filteredDonList.length}
            </span>{" "}
            đơn
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaChevronLeft className="text-xs mr-1" /> Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentPage === number
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ),
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Sau <FaChevronRight className="text-xs ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ----- MODAL POPUP NHẬP LÝ DO TỪ CHỐI ----- */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FaTimesCircle className="text-red-500" /> Từ Chối Đơn Đăng Ký
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Vui lòng nhập lý do cụ thể để thông báo hoặc làm căn cứ lưu trữ
                hồ sơ.
              </p>

              <form onSubmit={handleTuChoiDon}>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                  placeholder="Ví dụ: Không còn phòng trống theo yêu cầu / Không đúng đối tượng ưu tiên..."
                  value={lyDoTuChoi}
                  onChange={(e) => setLyDoTuChoi(e.target.value)}
                  required
                />

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={() => setShowRejectModal(false)}
                    disabled={submitting}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Xác nhận từ chối"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonDangKy;
