import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loaiPhongApi } from "../../services/loaiPhongApi";
import {
  FaSpinner,
  FaPlus,
  FaEdit,
  FaPowerOff,
  FaCheck,
  FaTags,
} from "react-icons/fa";

const QuanLyLoaiPhong = () => {
  const [danhSachLoaiPhong, setDanhSachLoaiPhong] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal (Form Thêm/Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    maLoaiPhong: "",
    tenLoaiPhong: "",
    sucChua: "",
    donGia: "",
  });

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const fetchDanhSach = async () => {
    try {
      const res = await loaiPhongApi.getAll();
      if (res.success) {
        setDanhSachLoaiPhong(res.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách loại phòng");
    } finally {
      setLoading(false);
    }
  };

  // Format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Đóng mở Modal
  const openModal = (loaiPhong = null) => {
    if (loaiPhong) {
      setEditingId(loaiPhong._id);
      setFormData({
        maLoaiPhong: loaiPhong.maLoaiPhong,
        tenLoaiPhong: loaiPhong.tenLoaiPhong,
        sucChua: loaiPhong.sucChua,
        donGia: loaiPhong.donGia,
      });
    } else {
      setEditingId(null);
      setFormData({
        maLoaiPhong: "",
        tenLoaiPhong: "",
        sucChua: "",
        donGia: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ maLoaiPhong: "", tenLoaiPhong: "", sucChua: "", donGia: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý Thêm / Sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await loaiPhongApi.update(editingId, formData);
        if (res.success) toast.success("Cập nhật loại phòng thành công!");
      } else {
        const res = await loaiPhongApi.create(formData);
        if (res.success) toast.success("Thêm loại phòng thành công!");
      }
      fetchDanhSach();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý Bật / Tắt trạng thái
  const handleToggleStatus = async (id, currentStatus) => {
    const isActivating = currentStatus === "INACTIVE";
    const actionText = isActivating ? "Kích hoạt" : "Ngừng sử dụng";

    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} loại phòng này?`)) {
      try {
        const apiCall = isActivating
          ? loaiPhongApi.activate(id)
          : loaiPhongApi.deactivate(id);
        const res = await apiCall;
        if (res.success) {
          toast.success(`Đã ${actionText.toLowerCase()} thành công!`);
          fetchDanhSach();
        }
      } catch (error) {
        toast.error(`Lỗi khi ${actionText.toLowerCase()}`);
      }
    }
  };

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
          <FaTags className="text-blue-600" /> Quản Lý Loại Phòng
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FaPlus /> Thêm Loại Phòng
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên Loại Phòng
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Sức Chứa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Đơn Giá / Tháng
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {danhSachLoaiPhong.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Chưa có loại phòng nào. Hãy thêm mới!
                </td>
              </tr>
            ) : (
              danhSachLoaiPhong.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {item.maLoaiPhong}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {item.tenLoaiPhong}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                    {item.sucChua} người
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">
                    {formatCurrency(item.donGia)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.trangThai === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.trangThai === "ACTIVE"
                        ? "Đang áp dụng"
                        : "Đã ngừng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      title="Sửa thông tin"
                    >
                      <FaEdit className="inline text-lg" />
                    </button>
                    {item.trangThai === "ACTIVE" ? (
                      <button
                        onClick={() =>
                          handleToggleStatus(item._id, item.trangThai)
                        }
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Ngừng sử dụng"
                      >
                        <FaPowerOff className="inline text-lg" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleToggleStatus(item._id, item.trangThai)
                        }
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Kích hoạt lại"
                      >
                        <FaCheck className="inline text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TÍCH HỢP MODAL THÊM / SỬA NGAY TẠI ĐÂY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-blue-600 px-6 py-4 text-white">
              <h3 className="text-xl font-bold">
                {editingId ? "Cập Nhật Loại Phòng" : "Thêm Loại Phòng Mới"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã Loại Phòng *
                  </label>
                  <input
                    type="text"
                    name="maLoaiPhong"
                    required
                    value={formData.maLoaiPhong}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    placeholder="VD: LP4, VIP8..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên Loại Phòng *
                  </label>
                  <input
                    type="text"
                    name="tenLoaiPhong"
                    required
                    value={formData.tenLoaiPhong}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: Phòng 4 người thường"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sức Chứa *
                    </label>
                    <input
                      type="number"
                      name="sucChua"
                      min="1"
                      required
                      value={formData.sucChua}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="VD: 4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đơn Giá (VNĐ) *
                    </label>
                    <input
                      type="number"
                      name="donGia"
                      min="0"
                      required
                      value={formData.donGia}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="VD: 1000000"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400"
                  disabled={submitting}
                >
                  {submitting ? "Đang lưu..." : "Lưu Thông Tin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyLoaiPhong;
