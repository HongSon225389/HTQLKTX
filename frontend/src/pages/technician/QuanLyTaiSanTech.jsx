import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taiSanApi } from "../../services/taiSanApi";
import { phongApi } from "../../services/phongApi"; // Bổ sung API phòng
import {
  FaBoxes,
  FaTools,
  FaSpinner,
  FaExchangeAlt,
  FaSearch,
  FaPlus,
  FaEye,
} from "react-icons/fa";
import ChiTietTaiSanModal from "../admin/ChiTietTaiSanModal";
const QuanLyTaiSanTech = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  // Quản lý Modal Cập nhật trạng thái
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusForm, setStatusForm] = useState({
    tinhTrang: "Tốt",
    ghiChu: "",
  });

  // Quản lý Modal Thêm mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    maTS: "",
    tenTS: "",
    phong: "",
    soLuong: 1,
    tinhTrang: "Tốt",
    ghiChu: "",
    ngayMua: "",
    ngayLapDat: "",
  });

  // Phân trang & Tìm kiếm
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
      toast.error("Lỗi đồng bộ danh sách thiết bị!");
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

  // ----- XỬ LÝ CẬP NHẬT TRẠNG THÁI -----
  const handleOpenStatusModal = (ts) => {
    setSelectedItem(ts);
    setStatusForm({ tinhTrang: ts.tinhTrang, ghiChu: ts.ghiChu || "" });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await taiSanApi.update(selectedItem._id, statusForm);
      toast.success("Đã ghi nhận nhật ký sửa chữa thiết bị!");
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  // ----- XỬ LÝ THÊM MỚI TÀI SẢN -----
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await taiSanApi.create(addFormData);
      toast.success("Đã nạp thiết bị mới vào hệ thống!");
      setIsAddModalOpen(false);
      setAddFormData({
        maTS: "",
        tenTS: "",
        phong: "",
        soLuong: 1,
        tinhTrang: "Tốt",
        ghiChu: "",
        ngayMua: "",
        ngayLapDat: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm thiết bị thất bại!");
    }
  };
  const handleViewDetail = (ts) => {
    setSelectedDetailItem(ts);
    setIsDetailModalOpen(true);
  };
  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white p-3 rounded-xl shadow-md">
            <FaBoxes size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Hệ Thống Thiết Bị & Tài Sản
            </h2>
            <p className="text-sm text-gray-500">
              Tra cứu và cập nhật trạng thái vận hành thiết bị KTX
            </p>
          </div>
        </div>

        {/* NÚT THÊM MỚI CHO THỢ */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm transition-colors"
        >
          <FaPlus /> Thêm Thiết Bị
        </button>
      </div>

      {/* THANH TÌM KIẾM DÀNH CHO THỢ */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0"
      >
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tra cứu nhanh mã thiết bị, tên đồ dùng..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500 bg-gray-50 text-sm"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500 bg-gray-50 text-sm font-medium"
          value={filterTinhTrang}
          onChange={(e) => {
            setFilterTinhTrang(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Mọi trạng thái --</option>
          <option value="Hỏng">🔴 Đang hỏng</option>
          <option value="Đang sửa chữa">🟡 Đang sửa chữa</option>
          <option value="Tốt">🟢 Hoạt động tốt</option>
        </select>
        <button
          type="submit"
          className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-800 transition text-sm"
        >
          Tìm
        </button>
      </form>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="px-6 py-3 text-left">Thiết bị</th>
                <th className="px-6 py-3 text-left">Vị trí phòng</th>
                <th className="px-6 py-3 text-center">Tình trạng</th>
                <th className="px-6 py-3 text-left">Nhật ký sự cố / Bảo trì</th>
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
                    Không tìm thấy thiết bị nào.
                  </td>
                </tr>
              ) : (
                danhSach.map((ts) => (
                  <tr key={ts._id} className="hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{ts.tenTS}</div>
                      <div className="text-xs font-mono text-gray-400">
                        {ts.maTS} (SL: {ts.soLuong})
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700">
                      {ts.phong?.maPhong
                        ? `Phòng ${ts.phong.maPhong}`
                        : "Trong Kho"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          ts.tinhTrang === "Tốt"
                            ? "bg-green-100 text-green-700"
                            : ts.tinhTrang === "Đang sửa chữa"
                              ? "bg-amber-100 text-amber-700"
                              : ts.tinhTrang === "Thanh lý"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ts.tinhTrang}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500 italic max-w-xs truncate">
                      {ts.ghiChu || "Không có báo cáo"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(ts)}
                          title="Xem chi tiết"
                          className="inline-flex items-center justify-center text-teal-700 bg-teal-50 hover:bg-teal-100 p-2 rounded-lg transition-colors"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenStatusModal(ts)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FaTools /> Cập Nhật
                        </button>
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
        <div className="bg-white px-6 py-4 border border-t-0 border-gray-200 rounded-b-xl flex items-center justify-between shrink-0">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Đang xem <span className="font-medium">{totalRecords}</span> thiết
              bị
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Trước
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-orange-50 text-sm font-bold text-orange-600">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* 1. POPUP BÁO CÁO FIX SỰ CỐ */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleUpdateStatus}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col"
          >
            <div className="bg-slate-900 text-white px-6 py-4 font-bold flex items-center gap-2">
              <FaExchangeAlt className="text-orange-400" /> Đổi Trạng Thái Tài
              Sản
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm">
                Thiết bị:{" "}
                <strong className="text-slate-900">{selectedItem.tenTS}</strong>{" "}
                ({selectedItem.maTS})
              </p>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Tình trạng thực tế *
                </label>
                <select
                  className="w-full border p-2 rounded-lg font-medium outline-none focus:border-orange-500"
                  value={statusForm.tinhTrang}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, tinhTrang: e.target.value })
                  }
                >
                  <option value="Tốt">🟢 Đã khắc phục - Tốt</option>
                  <option value="Đang sửa chữa">
                    🟡 Đang sửa chữa / Chờ linh kiện
                  </option>
                  <option value="Hỏng">🔴 Hỏng - Chờ xử lý</option>
                  <option value="Thanh lý">⚪ Đã thanh lý</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Ghi chú sửa chữa
                </label>
                <textarea
                  className="w-full border p-2 rounded-lg h-24 text-sm outline-none focus:border-orange-500"
                  value={statusForm.ghiChu}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, ghiChu: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-200 text-slate-700 rounded-lg font-medium"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. POPUP THÊM MỚI THIẾT BỊ (DÀNH CHO THỢ) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
          >
            <div className="bg-slate-900 text-white px-6 py-4 font-bold text-lg flex items-center gap-2">
              <FaPlus className="text-orange-500" /> Nạp Thiết Bị Mới Vào
              Kho/Phòng
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Mã tài sản *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border p-2 rounded-lg bg-gray-50 font-mono outline-none focus:border-orange-500"
                  placeholder="VD: DH-01"
                  value={addFormData.maTS}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, maTS: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Tên tài sản / Thiết bị *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border p-2 rounded-lg outline-none focus:border-orange-500"
                  placeholder="VD: Điều hòa Panasonic 9000BTU"
                  value={addFormData.tenTS}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, tenTS: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Số lượng *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full border p-2 rounded-lg outline-none focus:border-orange-500"
                    value={addFormData.soLuong}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        soLuong: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Lắp đặt tại phòng
                  </label>
                  <select
                    className="w-full border p-2 rounded-lg outline-none focus:border-orange-500"
                    value={addFormData.phong}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, phong: e.target.value })
                    }
                  >
                    <option value="">-- Để trong kho --</option>
                    {danhSachPhong.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.maPhong} ({p.toaNha})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Ngày mua vật tư
                  </label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded-lg outline-none focus:border-orange-500"
                    value={addFormData.ngayMua}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        ngayMua: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Ngày thi công / lắp đặt
                  </label>
                  <input
                    type="date"
                    disabled={!addFormData.phong}
                    title={
                      !addFormData.phong
                        ? "Chỉ chọn ngày lắp khi đã xếp vào phòng"
                        : ""
                    }
                    className={`w-full border p-2 rounded-lg outline-none ${
                      !addFormData.phong
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "focus:border-orange-500"
                    }`}
                    value={!addFormData.phong ? "" : addFormData.ngayLapDat}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        ngayLapDat: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Tình trạng ban đầu
                </label>
                <select
                  className="w-full border p-2 rounded-lg outline-none focus:border-orange-500"
                  value={addFormData.tinhTrang}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      tinhTrang: e.target.value,
                    })
                  }
                >
                  <option value="Tốt">Hoạt động tốt</option>
                  <option value="Đang sửa chữa">Đang sửa chữa</option>
                  <option value="Hỏng">Hỏng</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Thông số / Ghi chú
                </label>
                <textarea
                  className="w-full border p-2 rounded-lg h-20 outline-none focus:border-orange-500"
                  placeholder="Thông số kỹ thuật hoặc ghi chú thêm..."
                  value={addFormData.ghiChu}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, ghiChu: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-sm"
              >
                Lưu Thiết Bị
              </button>
            </div>
          </form>
        </div>
      )}
      <ChiTietTaiSanModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        taiSan={selectedDetailItem}
      />
    </div>
  );
};

export default QuanLyTaiSanTech;
