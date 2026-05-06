import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBox,
  FaPlus,
  FaSearch,
  FaTools,
  FaTrashAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaWarehouse,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VatTu() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    maVT: "",
    tenVT: "",
    phong: "",
    tinhTrang: "Tốt",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    if (!token) return navigate("/login");

    try {
      setLoading(true);

      const [resHD, resP] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/vattu?page=${currentPage}&search=${searchTerm}&tinhTrang=${filterStatus}`,
          config,
        ),
        axios.get("http://localhost:5000/api/phong", config),
      ]);

      setItems(resHD.data.data);
      setTotalPages(resHD.data.pagination.totalPages);
      setRooms(resP.data);
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filterStatus, searchTerm]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.phong) {
      alert("Vui lòng chọn phòng lắp đặt thiết bị!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/vattu/tao",
        formData,
        config,
      );
      alert(res.data.message);
      setIsModalOpen(false);
      setFormData({ maVT: "", tenVT: "", phong: "", tinhTrang: "Tốt" });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi thêm vật tư");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/vattu/sua/${id}`,
        { tinhTrang: status },
        config,
      );
      fetchData();
    } catch (error) {
      alert("Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa thiết bị này khỏi hệ thống?")
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/vattu/xoa/${id}`, config);
        fetchData();
      } catch (error) {
        alert("Lỗi khi xóa vật tư");
      }
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-black text-blue-500 animate-pulse uppercase tracking-[0.2em]">
        Đang kiểm kê cơ sở vật chất...
      </div>
    );

  return (
    <div className="w-full pb-10 px-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3 italic">
            <FaBox className="text-blue-600" /> CƠ SỞ VẬT CHẤT
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Quản lý thiết bị & Tài sản Ký túc xá
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
        >
          <FaPlus /> Thêm thiết bị
        </button>
      </div>

      {/* TÌM KIẾM & BỘ LỌC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo Mã hoặc Tên vật tư..."
            className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-4 pl-14 pr-5 font-bold text-gray-600 outline-none focus:shadow-md transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 overflow-x-auto pb-2">
          {["Tất cả", "Tốt", "Hỏng hóc", "Đang sửa chữa", "Đã thanh lý"].map(
            (st) => (
              <button
                key={st}
                onClick={() => {
                  setFilterStatus(st);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {st}
              </button>
            ),
          )}
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-6">Mã VT / Tên thiết bị</th>
              <th className="p-6">Vị trí (Phòng)</th>
              <th className="p-6 text-center">Tình trạng</th>
              <th className="p-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-blue-50/20 transition-all">
                <td className="p-6">
                  <p className="font-black text-blue-600 mb-1">{item.maVT}</p>
                  <p className="text-sm font-bold text-gray-700 uppercase">
                    {item.tenVT}
                  </p>
                </td>
                <td className="p-6">
                  <span className="bg-gray-100 px-4 py-1.5 rounded-xl font-black text-gray-500 text-[10px]">
                    {item.phong?.tenPhong || "Chưa xác định"}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                      item.tinhTrang === "Tốt"
                        ? "bg-green-100 text-green-600"
                        : item.tinhTrang === "Hỏng hóc"
                          ? "bg-red-100 text-red-600"
                          : item.tinhTrang === "Đang sửa chữa"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {item.tinhTrang}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    {/* NẾU TỐT -> Chỉ cho phép Báo hỏng */}
                    {item.tinhTrang === "Tốt" && (
                      <button
                        onClick={() => handleUpdateStatus(item._id, "Hỏng hóc")}
                        className="text-orange-400 hover:bg-orange-100 p-2 rounded-xl transition-all"
                        title="Báo hỏng thiết bị"
                      >
                        <FaExclamationTriangle />
                      </button>
                    )}

                    {/* NẾU HỎNG HÓC -> Cho phép mang đi sửa HOẶC thanh lý bỏ đi */}
                    {item.tinhTrang === "Hỏng hóc" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(item._id, "Đang sửa chữa")
                          }
                          className="text-blue-500 hover:bg-blue-100 p-2 rounded-xl transition-all"
                          title="Mang đi sửa chữa"
                        >
                          <FaTools />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(item._id, "Đã thanh lý")
                          }
                          className="text-gray-500 hover:bg-gray-200 p-2 rounded-xl transition-all"
                          title="Thanh lý (Bỏ đi)"
                        >
                          <FaBox />{" "}
                        </button>
                      </>
                    )}

                    {/* NẾU ĐANG SỬA CHỮA -> Cho phép xác nhận đã sửa xong (Tốt) */}
                    {item.tinhTrang === "Đang sửa chữa" && (
                      <button
                        onClick={() => handleUpdateStatus(item._id, "Tốt")}
                        className="text-green-500 hover:bg-green-100 p-2 rounded-xl transition-all"
                        title="Đã sửa xong"
                      >
                        <FaCheckCircle />
                      </button>
                    )}

                    {/* Nút XÓA HOÀN TOÀN KHỎI HỆ THỐNG */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all"
                      title="Xóa khỏi cơ sở dữ liệu"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="p-20 text-center text-gray-300 font-bold italic uppercase tracking-widest">
            Không tìm thấy thiết bị nào...
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      <div className="flex justify-between items-center mt-8 px-6">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Trang {currentPage} / {totalPages}
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
              className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg" : "bg-white border text-gray-400"}`}
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

      {/* MODAL THÊM MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2 uppercase italic">
                <FaTools className="text-blue-600" /> Nhập thiết bị mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">
                    Mã vật tư
                  </label>
                  <input
                    type="text"
                    placeholder="VD: QUAT-101"
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                    value={formData.maVT}
                    onChange={(e) =>
                      setFormData({ ...formData, maVT: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">
                    Tên thiết bị
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Quạt trần Vinawind"
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                    value={formData.tenVT}
                    onChange={(e) =>
                      setFormData({ ...formData, tenVT: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">
                    Vị trí lắp đặt
                  </label>
                  <select
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all cursor-pointer"
                    value={formData.phong}
                    onChange={(e) =>
                      setFormData({ ...formData, phong: e.target.value })
                    }
                  >
                    <option value="">-- Chọn phòng lắp đặt --</option>
                    {rooms.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.tenPhong}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 uppercase tracking-widest transition-all"
                >
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
