import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFileContract,
  FaPlus,
  FaSearch,
  FaTrashAlt,
  FaUserPlus,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function HopDong() {
  const [contracts, setContracts] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // --- States Phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Bạn có thể sửa thành 20 nếu muốn

  // --- States Gia hạn ---
  const [isGiaHanModalOpen, setIsGiaHanModalOpen] = useState(false);
  const [selectedHD, setSelectedHD] = useState(null);
  const [giaHanForm, setGiaHanForm] = useState({
    ngayBatDau: new Date().toISOString().split("T")[0],
    ngayKetThuc: "",
  });

  const [formData, setFormData] = useState({
    sinhVienId: "",
    phongId: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    tienCoc: 0,
    daDongTien: false,
    ghiChu: "",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Tải dữ liệu (Gửi kèm page và limit)
  const fetchData = async () => {
    try {
      setLoading(true);
      const resHD = await axios.get(
        `http://localhost:5000/api/hopdong?page=${currentPage}&limit=${itemsPerPage}`,
        config,
      );

      setContracts(resHD.data.data);
      setTotalPages(resHD.data.pagination.totalPages);

      const [resSV, resP] = await Promise.all([
        axios.get("http://localhost:5000/api/sinhvien", config),
        axios.get("http://localhost:5000/api/phong", config),
      ]);
      setStudents(resSV.data.filter((sv) => !sv.phong));
      setRooms(
        resP.data.filter(
          (p) => p.trangThai !== "Hết chỗ" && p.trangThai !== "Đang sửa",
        ),
      );
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Tự động load lại khi đổi trang

  // Logic Lọc (Lưu ý: Tìm kiếm này chỉ áp dụng trên dữ liệu đang hiển thị ở trang đó)
  const filteredContracts = contracts.filter((item) => {
    const matchesStatus =
      filterStatus === "Tất cả" || item.trangThai === filterStatus;
    const matchesSearch =
      item.maHD?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sinhVien?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sinhVien?.maSV?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/hopdong/tao",
        formData,
        config,
      );
      alert("Tạo hợp đồng thành công!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi tạo hợp đồng");
    }
  };

  const handleThanhLy = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn thanh lý?")) {
      try {
        await axios.put(
          `http://localhost:5000/api/hopdong/thanh-ly/${id}`,
          {},
          config,
        );
        fetchData();
      } catch (error) {
        alert("Lỗi khi thanh lý");
      }
    }
  };

  const handleOpenGiaHan = (hd) => {
    setSelectedHD(hd);
    setGiaHanForm({
      ...giaHanForm,
      ngayBatDau: new Date().toISOString().split("T")[0],
    });
    setIsGiaHanModalOpen(true);
  };

  const handleGiaHanSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/hopdong/gia-han/${selectedHD._id}`,
        { ngayKetThucMoi: giaHanForm.ngayKetThuc },
        config,
      );
      alert("Gia hạn thành công!");
      setIsGiaHanModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi gia hạn");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-blue-500 animate-pulse">
        ĐANG TRUY XUẤT HỢP ĐỒNG...
      </div>
    );

  return (
    <div className="w-full pb-10 px-4">
      {/* Header & Search Bar (Giữ nguyên) */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          <FaFileContract className="text-blue-600" /> QUẢN LÝ HỢP ĐỒNG
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <FaPlus /> Ký hợp đồng mới
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 mb-8 flex items-center gap-4">
        <FaSearch className="text-gray-300 ml-3" />
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="flex-1 outline-none font-bold text-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {["Tất cả", "Có hiệu lực", "Đã thanh lý", "Hết hạn"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${filterStatus === status ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-6">Mã HD / Sinh viên</th>
              <th className="p-6">Phòng</th>
              <th className="p-6">Thời hạn</th>
              <th className="p-6">Tiền cọc</th>
              <th className="p-6">Trạng thái</th>
              <th className="p-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredContracts.map((item) => (
              <tr key={item._id} className="hover:bg-blue-50/20 transition-all">
                <td className="p-6">
                  <p className="font-black text-blue-600 mb-1">{item.maHD}</p>
                  <p className="text-sm font-bold text-gray-700">
                    {item.sinhVien?.hoTen || "N/A"}
                  </p>
                </td>
                <td className="p-6">
                  <span className="bg-gray-100 px-4 py-1.5 rounded-xl font-black text-gray-500 text-[10px]">
                    {item.phong?.tenPhong || "N/A"}
                  </span>
                </td>
                <td className="p-6 text-xs font-bold text-gray-500">
                  <p>
                    Từ: {new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    Đến:{" "}
                    {new Date(item.ngayKetThuc).toLocaleDateString("vi-VN")}
                  </p>
                </td>
                <td className="p-6">
                  <p className="font-black text-gray-800">
                    {item.tienCoc?.toLocaleString()}đ
                  </p>
                  <span
                    className={`text-[9px] font-black uppercase ${item.daDongTien ? "text-green-500" : "text-red-400"}`}
                  >
                    {item.daDongTien ? "● Đã nộp" : "○ Chưa nộp"}
                  </span>
                </td>
                <td className="p-6">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${item.trangThai === "Có hiệu lực" ? "bg-green-100 text-green-600" : item.trangThai === "Hết hạn" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {item.trangThai}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <div className="flex justify-center gap-2">
                    {item.trangThai === "Có hiệu lực" && (
                      <button
                        onClick={() => handleThanhLy(item._id)}
                        className="text-red-300 hover:text-red-500 p-2"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                    {item.trangThai === "Hết hạn" && (
                      <button
                        onClick={() => handleOpenGiaHan(item)}
                        className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl font-black text-[10px] hover:bg-blue-100 transition-all"
                      >
                        <FaCalendarAlt /> GIA HẠN
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- THANH ĐIỀU HƯỚNG PHÂN TRANG --- */}
      <div className="flex justify-between items-center mt-8 px-6">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Trang {currentPage} / {totalPages} (Tối đa 100 Hợp đồng gần nhất)
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`p-3 rounded-xl border transition-all ${currentPage === 1 ? "bg-gray-50 text-gray-200" : "bg-white text-blue-600 hover:bg-blue-50"}`}
          >
            <FaChevronLeft size={10} />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border text-gray-400 hover:bg-gray-50"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`p-3 rounded-xl border transition-all ${currentPage === totalPages ? "bg-gray-50 text-gray-200" : "bg-white text-blue-600 hover:bg-blue-50"}`}
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* --- MODAL TẠO MỚI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2 uppercase italic">
              <FaUserPlus className="text-blue-600" /> Ký hợp đồng thuê phòng
            </h3>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                  Sinh viên
                </label>
                <select
                  required
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 font-bold focus:border-blue-500 outline-none"
                  value={formData.sinhVienId}
                  onChange={(e) =>
                    setFormData({ ...formData, sinhVienId: e.target.value })
                  }
                >
                  <option value="">-- Chọn sinh viên --</option>
                  {students.map((sv) => (
                    <option key={sv._id} value={sv._id}>
                      {sv.hoTen} ({sv.maSV})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                  Phòng
                </label>
                <select
                  required
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 font-bold focus:border-blue-500 outline-none"
                  value={formData.phongId}
                  onChange={(e) =>
                    setFormData({ ...formData, phongId: e.target.value })
                  }
                >
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.tenPhong} - {p.loaiPhong?.tenLoai || p.loaiPhong}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                  Bắt đầu
                </label>
                <input
                  type="date"
                  required
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 font-bold"
                  value={formData.ngayBatDau}
                  onChange={(e) =>
                    setFormData({ ...formData, ngayBatDau: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                  Kết thúc
                </label>
                <input
                  type="date"
                  required
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 font-bold"
                  value={formData.ngayKetThuc}
                  onChange={(e) =>
                    setFormData({ ...formData, ngayKetThuc: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                  Tiền cọc
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-4 top-4 text-gray-300" />
                  <input
                    type="number"
                    required
                    className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl pl-10 pr-4 py-3 font-bold"
                    value={formData.tienCoc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tienCoc: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-lg text-blue-600"
                  checked={formData.daDongTien}
                  onChange={(e) =>
                    setFormData({ ...formData, daDongTien: e.target.checked })
                  }
                />
                <span className="text-sm font-black text-gray-600">
                  Đã nộp tiền cọc
                </span>
              </div>
              <div className="col-span-2 flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 uppercase tracking-widest transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL GIA HẠN --- */}
      {isGiaHanModalOpen && selectedHD && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2 uppercase italic">
                <FaCalendarAlt className="text-blue-600" /> Gia hạn hợp đồng
              </h3>
              <button
                onClick={() => setIsGiaHanModalOpen(false)}
                className="text-gray-300 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleGiaHanSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase">
                    Sinh viên
                  </label>
                  <p className="font-bold text-gray-700">
                    {selectedHD.sinhVien?.hoTen}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase">
                    Phòng hiện tại
                  </label>
                  <p className="font-bold text-blue-600">
                    {selectedHD.phong?.tenPhong}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1 ml-2">
                    Ngày bắt đầu gia hạn
                  </label>
                  <input
                    type="date"
                    readOnly
                    className="w-full border-2 border-gray-100 bg-gray-100 rounded-xl px-5 py-3 font-bold text-gray-400 cursor-not-allowed"
                    value={giaHanForm.ngayBatDau}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1 ml-2">
                    Ngày kết thúc mới
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-5 py-3 font-bold focus:border-blue-500 outline-none transition-all"
                    value={giaHanForm.ngayKetThuc}
                    onChange={(e) =>
                      setGiaHanForm({
                        ...giaHanForm,
                        ngayKetThuc: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 uppercase tracking-widest transition-all"
                >
                  Xác nhận gia hạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
