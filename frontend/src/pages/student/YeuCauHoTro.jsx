import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { yeuCauApi } from "../../services/yeuCauApi";
import { phongApi } from "../../services/phongApi";
import {
  FaHeadset,
  FaPlus,
  FaSpinner,
  FaEye,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import ChiTietYeuCauModal from "./ChiTietYeuCauModal";

const YeuCauHoTro = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState(null);

  // Form Thêm mới
  const [formData, setFormData] = useState({
    nhomYeuCau: "Kỹ thuật",
    loaiYeuCau: "Điện",
    phong: "",
    tieuDe: "",
    noiDung: "",
    mucDo: "Bình thường",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

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
      toast.error("Lỗi tải danh sách yêu cầu!");
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

  // ----- THÊM ĐƠN MỚI -----
  const danhMucLoaiYeuCau = {
    "Kỹ thuật": ["Điện", "Nước", "Internet", "Tài sản / Vật tư", "Khác"],
    "Hành chính": [
      "Gia hạn hợp đồng",
      "Chuyển phòng",
      "Trả phòng",
      "Biểu mẫu / Giấy tờ",
      "Khác",
    ],
    Khác: ["Góp ý", "Khiếu nại", "Hỗ trợ chung"],
  };

  const handleNhomChange = (e) => {
    const nhom = e.target.value;
    setFormData({
      ...formData,
      nhomYeuCau: nhom,
      loaiYeuCau: danhMucLoaiYeuCau[nhom][0],
      phong: nhom !== "Kỹ thuật" ? "" : formData.phong,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nhomYeuCau === "Kỹ thuật" && !formData.phong) {
      return toast.warning("Vui lòng chọn phòng đang gặp sự cố kỹ thuật!");
    }
    try {
      await yeuCauApi.create(formData);
      toast.success("Đã gửi yêu cầu hỗ trợ thành công!");
      setIsModalOpen(false);
      setFormData({
        nhomYeuCau: "Kỹ thuật",
        loaiYeuCau: "Điện",
        phong: "",
        tieuDe: "",
        noiDung: "",
        mucDo: "Bình thường",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi gửi yêu cầu!");
    }
  };

  // ----- HỦY ĐƠN -----
  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy yêu cầu này không?")) {
      try {
        await yeuCauApi.cancel(id);
        toast.success("Đã hủy yêu cầu hỗ trợ!");
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể hủy yêu cầu!");
      }
    }
  };

  // ----- ĐÁNH GIÁ SAO -----
  const handleRatingSubmit = async (id, rating) => {
    try {
      await yeuCauApi.rate(id, { danhGia: rating });
      toast.success("Cảm ơn bạn đã đánh giá dịch vụ!");
      setIsDetailModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi gửi đánh giá!");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Đang xử lý":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Hoàn thành":
        return "bg-green-100 text-green-700 border-green-200";
      case "Đã hủy":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col h-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 text-white p-3 rounded-xl shadow-md">
            <FaHeadset size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Trung Tâm Hỗ Trợ
            </h2>
            <p className="text-sm text-gray-500">
              Gửi phản ánh sự cố hoặc yêu cầu giấy tờ hành chính
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-sm transition-colors w-full md:w-auto justify-center"
        >
          <FaPlus /> Gửi Yêu Cầu Mới
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0"
      >
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã yêu cầu hoặc tiêu đề..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-teal-500 bg-gray-50 text-sm"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 bg-gray-50 text-sm font-medium"
          value={filterTrangThai}
          onChange={(e) => {
            setFilterTrangThai(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Mọi trạng thái --</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
        <button
          type="submit"
          className="bg-slate-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-900 transition text-sm"
        >
          Lọc kết quả
        </button>
      </form>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="px-6 py-4 text-left">Mã YC / Ngày gửi</th>
                <th className="px-6 py-4 text-left">Nội dung yêu cầu</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Phản hồi BQL</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <FaSpinner className="animate-spin text-3xl text-teal-600 mx-auto" />
                  </td>
                </tr>
              ) : danhSach.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    Chưa có dữ liệu yêu cầu hỗ trợ.
                  </td>
                </tr>
              ) : (
                danhSach.map((yc) => (
                  <tr
                    key={yc._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-teal-700">{yc.maYC}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(yc.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {yc.tieuDe}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {yc.nhomYeuCau} - {yc.loaiYeuCau}
                        </span>
                        {yc.mucDo === "Khẩn cấp" && (
                          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                            Khẩn cấp
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${getStatusStyle(yc.trangThai)}`}
                      >
                        {yc.trangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 max-w-[150px] truncate text-xs">
                      {yc.ghiChuXuLy || "-"}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedYeuCau(yc);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Xem chi tiết & Đánh giá"
                      >
                        <FaEye size={18} />
                      </button>
                      {/* NÚT HỦY ĐƠN: Chỉ hiện ra khi đơn đang ở trạng thái Chờ xử lý */}
                      {yc.trangThai === "Chờ xử lý" && (
                        <button
                          onClick={() => handleCancel(yc._id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Thu hồi / Hủy đơn"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      )}
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
              Đang xem <span className="font-medium">{totalRecords}</span> yêu
              cầu
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
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-teal-50 text-sm font-bold text-teal-700">
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

      {/* MODAL THÊM MỚI (Dành cho Sinh Viên) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
          >
            <div className="bg-teal-600 text-white px-6 py-4 font-bold text-lg flex items-center gap-2">
              <FaHeadset /> Soạn Yêu Cầu Hỗ Trợ
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Mảng hỗ trợ *
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 p-2.5 rounded-lg outline-none focus:border-teal-500 font-medium text-slate-700"
                    value={formData.nhomYeuCau}
                    onChange={handleNhomChange}
                  >
                    <option value="Kỹ thuật">🛠 Kỹ thuật / Sửa chữa</option>
                    <option value="Hành chính">📄 Hành chính / Giấy tờ</option>
                    <option value="Khác">💡 Khác (Góp ý/Phản ánh)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Loại cụ thể *
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 p-2.5 rounded-lg outline-none focus:border-teal-500 font-medium text-slate-700"
                    value={formData.loaiYeuCau}
                    onChange={(e) =>
                      setFormData({ ...formData, loaiYeuCau: e.target.value })
                    }
                  >
                    {danhMucLoaiYeuCau[formData.nhomYeuCau].map((loai) => (
                      <option key={loai} value={loai}>
                        {loai}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.nhomYeuCau === "Kỹ thuật" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Xảy ra tại phòng *
                  </label>
                  <select
                    required
                    className="w-full border-2 border-gray-200 p-2.5 rounded-lg outline-none focus:border-teal-500"
                    value={formData.phong}
                    onChange={(e) =>
                      setFormData({ ...formData, phong: e.target.value })
                    }
                  >
                    <option value="">-- Chọn phòng sự cố --</option>
                    {danhSachPhong.map((p) => (
                      <option key={p._id} value={p._id}>
                        Phòng {p.maPhong} (Tòa {p.toaNha})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1 italic">
                    * Bắt buộc để thợ kỹ thuật biết vị trí cần sửa
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Tiêu đề ngắn gọn *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hỏng quạt trần, Xin cấp lại thẻ..."
                  className="w-full border-2 border-gray-200 p-2.5 rounded-lg outline-none focus:border-teal-500"
                  value={formData.tieuDe}
                  onChange={(e) =>
                    setFormData({ ...formData, tieuDe: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Mức độ ưu tiên
                </label>
                <select
                  className="w-full border-2 border-gray-200 p-2.5 rounded-lg outline-none focus:border-teal-500"
                  value={formData.mucDo}
                  onChange={(e) =>
                    setFormData({ ...formData, mucDo: e.target.value })
                  }
                >
                  <option value="Bình thường">
                    Bình thường (Xử lý trong giờ hành chính)
                  </option>
                  <option value="Khẩn cấp">
                    Khẩn cấp (Chập cháy, vỡ ống nước...)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Mô tả chi tiết sự cố / Yêu cầu *
                </label>
                <textarea
                  required
                  placeholder="Mô tả rõ ràng vấn đề bạn đang gặp phải..."
                  className="w-full border-2 border-gray-200 p-3 rounded-lg outline-none focus:border-teal-500 h-28 resize-none"
                  value={formData.noiDung}
                  onChange={(e) =>
                    setFormData({ ...formData, noiDung: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-gray-200 text-slate-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-colors"
              >
                Gửi Yêu Cầu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* COMPONENT CHI TIẾT */}
      <ChiTietYeuCauModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        yeuCau={selectedYeuCau}
        onSubmitRating={handleRatingSubmit}
      />
    </div>
  );
};

export default YeuCauHoTro;
