import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { phongApi } from "../../services/phongApi";
import { loaiPhongApi } from "../../services/loaiPhongApi";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaPlus,
  FaDoorOpen,
  FaUserFriends,
  FaTools,
  FaEye,
  FaEdit,
  FaBuilding,
} from "react-icons/fa";
import PhongModal from "./PhongModal";
import ChiTietPhongModal from "./ChiTietPhongModal";

const QuanLyPhong = () => {
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("All");

  // Quản lý trạng thái đóng mở các Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPhong, setSelectedPhong] = useState(null);
  const [viewingPhongId, setViewingPhongId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 20;
  useEffect(() => {
    fetchDanhSach();
  }, []);

  const fetchDanhSach = async () => {
    try {
      const res = await phongApi.getAll();
      if (res.success) {
        setDanhSachPhong(res.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTrangThai]);
  const openAddModal = () => {
    setSelectedPhong(null);
    setIsModalOpen(true);
  };

  const openEditModal = (phong) => {
    setSelectedPhong(phong);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    setModalLoading(true);
    try {
      if (formData.loaiPhong && formData.donGia) {
        await loaiPhongApi.update(formData.loaiPhong, {
          donGia: formData.donGia,
        });
      }

      if (selectedPhong) {
        const res = await phongApi.update(selectedPhong._id, formData);
        if (res.success) toast.success("Cập nhật thông tin phòng thành công!");
      } else {
        const res = await phongApi.create(formData);
        if (res.success) toast.success("Khởi tạo phòng mới thành công!");
      }

      fetchDanhSach();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleMaintenance = async (phong) => {
    if (phong.trangThai === "Bảo trì") {
      if (window.confirm(`Mở lại hoạt động cho phòng ${phong.tenPhong}?`)) {
        try {
          const res = await phongApi.open(phong._id);
          if (res.success) {
            toast.success("Mở lại phòng thành công!");
            fetchDanhSach();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi khi mở phòng");
        }
      }
    } else {
      if (phong.soNguoiHienTai > 0) {
        toast.warning("Không thể bảo trì phòng đang có người ở!");
        return;
      }
      if (
        window.confirm(
          `Chuyển phòng ${phong.tenPhong} sang trạng thái Bảo trì?`,
        )
      ) {
        try {
          const res = await phongApi.maintenance(phong._id);
          if (res.success) {
            toast.success("Đã khóa bảo trì phòng!");
            fetchDanhSach();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi khi bảo trì phòng");
        }
      }
    }
  };

  const getStatusColor = (trangThai) => {
    switch (trangThai) {
      case "Trống":
        return "bg-green-100 text-green-800 border-green-500";
      case "Đang ở":
        return "bg-blue-100 text-blue-800 border-blue-500";
      case "Đầy":
        return "bg-red-100 text-red-800 border-red-500";
      case "Bảo trì":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  const filteredPhong = danhSachPhong
    .filter((phong) => {
      const matchSearch =
        phong.maPhong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phong.tenPhong?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        filterTrangThai === "All" ? true : phong.trangThai === filterTrangThai;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      // Sắp xếp theo Tòa nhà trước
      const toaNhaCompare = a.toaNha.localeCompare(b.toaNha);
      if (toaNhaCompare !== 0) return toaNhaCompare;

      // Nếu cùng tòa thì sắp xếp theo Tên phòng
      return a.tenPhong.localeCompare(b.tenPhong, undefined, { numeric: true });
    });
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredPhong.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredPhong.length / roomsPerPage);
  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBuilding className="text-blue-600" /> Sơ Đồ Ký Túc Xá
        </h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FaPlus /> Thêm Phòng Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 text-sm"
            placeholder="Tìm theo mã phòng, tên phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="block w-full md:w-48 py-2 px-3 border border-gray-300 bg-white rounded-lg text-sm"
          value={filterTrangThai}
          onChange={(e) => setFilterTrangThai(e.target.value)}
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="Trống">Trống</option>
          <option value="Đang ở">Đang ở</option>
          <option value="Đầy">Đầy</option>
          <option value="Bảo trì">Bảo trì</option>
        </select>
      </div>

      {/* KHỐI RENDER CÓ CHIA NHÓM THEO TÒA NHÀ */}
      <div className="space-y-10">
        {Object.keys(
          currentRooms.reduce((acc, phong) => {
            const toa = phong.toaNha || "Chưa xác định";
            if (!acc[toa]) acc[toa] = [];
            acc[toa].push(phong);
            return acc;
          }, {}),
        )
          .sort() // Sắp xếp theo tên Tòa (A, B, C...)
          .map((toa) => (
            <div key={toa}>
              {/* Tiêu đề khu vực */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                <FaBuilding className="text-blue-600" /> Khu vực:{" "}
                {toa.toUpperCase()}
              </h3>

              {/* Grid phòng của khu vực đó */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentRooms
                  .filter((p) => p.toaNha === toa)
                  .map((phong) => {
                    const percent = phong.loaiPhong?.sucChua
                      ? Math.round(
                          (phong.soNguoiHienTai / phong.loaiPhong.sucChua) *
                            100,
                        )
                      : 0;
                    return (
                      <div
                        key={phong._id}
                        className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden flex flex-col ${getStatusColor(phong.trangThai).split(" ")[2]}`}
                      >
                        <div className="p-4 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {phong.tenPhong}
                              </h3>
                              <p className="text-xs text-gray-500 font-medium">
                                Mã: {phong.maPhong}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusColor(phong.trangThai).split(" ").slice(0, 2).join(" ")}`}
                            >
                              {phong.trangThai}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1 mt-4">
                            <p>
                              Tầng: {phong.tang} | Loại:{" "}
                              {phong.loaiPhong?.tenLoaiPhong}
                            </p>
                          </div>
                          <div className="mt-5">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                <FaUserFriends /> Sĩ số
                              </span>
                              <span>
                                {phong.soNguoiHienTai} /{" "}
                                {phong.loaiPhong?.sucChua}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${percent === 100 ? "bg-red-500" : "bg-blue-500"}`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 border-t px-4 py-3 flex justify-between items-center">
                          <button
                            onClick={() => {
                              setViewingPhongId(phong._id);
                              setIsViewModalOpen(true);
                            }}
                            className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                          >
                            <FaEye /> Xem
                          </button>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => openEditModal(phong)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleToggleMaintenance(phong)}
                              className={
                                phong.trangThai === "Bảo trì"
                                  ? "text-green-500"
                                  : "text-yellow-500"
                              }
                            >
                              {phong.trangThai === "Bảo trì" ? (
                                <FaDoorOpen />
                              ) : (
                                <FaTools />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pb-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trước
          </button>
          <span className="text-sm font-medium text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sau
          </button>
        </div>
      )}
      <PhongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        phongData={selectedPhong}
        loading={modalLoading}
      />
      <ChiTietPhongModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        phongId={viewingPhongId}
      />
    </div>
  );
};

export default QuanLyPhong;
