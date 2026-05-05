import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaBuilding,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export default function Phong() {
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [danhSachLoaiPhong, setDanhSachLoaiPhong] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- States cho Tìm kiếm và Lọc ---
  const [tuKhoa, setTuKhoa] = useState(""); // Tìm theo số phòng
  const [locTrangThai, setLocTrangThai] = useState(""); // Lọc theo tình trạng

  // States cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    tenPhong: "",
    loaiPhong: "",
    trangThai: "Trống",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [resPhong, resLoai] = await Promise.all([
        axios.get("http://localhost:5000/api/phong", config),
        axios.get("http://localhost:5000/api/loaiphong", config),
      ]);
      setDanhSachPhong(resPhong.data);
      setDanhSachLoaiPhong(resLoai.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredPhong = danhSachPhong.filter((phong) => {
    const trungTen = phong.tenPhong
      .toLowerCase()
      .includes(tuKhoa.toLowerCase());
    const trungTrangThai =
      locTrangThai === "" || phong.trangThai === locTrangThai;
    return trungTen && trungTrangThai;
  });

  // --- GOM NHÓM DỮ LIỆU ĐÃ LỌC ---
  const groupedPhong = filteredPhong.reduce((acc, phong) => {
    const parts = phong.tenPhong.split("-");
    const khuVuc =
      parts.length > 1 ? parts[0].toUpperCase() : "DANH SÁCH CHUNG";
    if (!acc[khuVuc]) acc[khuVuc] = [];
    acc[khuVuc].push(phong);
    return acc;
  }, {});

  const getStatusStyle = (trangThai) => {
    switch (trangThai) {
      case "Trống":
        return {
          card: "bg-green-50 border-green-400 text-green-700",
          badge: "bg-green-500",
        };
      case "Đang ở":
        return {
          card: "bg-blue-50 border-blue-400 text-blue-700",
          badge: "bg-blue-500",
        };
      case "Đã đầy":
        return {
          card: "bg-red-50 border-red-400 text-red-700",
          badge: "bg-red-500",
        };
      case "Đang sửa":
        return {
          card: "bg-yellow-50 border-yellow-400 text-yellow-700",
          badge: "bg-yellow-500",
        };
      default:
        return {
          card: "bg-gray-50 border-gray-400 text-gray-700",
          badge: "bg-gray-500",
        };
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-gray-400 tracking-widest">
        ĐANG TẢI DỮ LIỆU...
      </div>
    );

  return (
    <div className="w-full pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
            QUẢN LÝ PHÒNG KTX
          </h2>
          <p className="text-gray-400 text-sm font-bold uppercase">
            Hệ thống phân khu thông minh
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditMode(false);
            setFormData({ tenPhong: "", loaiPhong: "", trangThai: "Trống" });
            setIsModalOpen(true);
          }}
          className="bg-[#2b78c5] text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaPlus /> THÊM PHÒNG
        </button>
      </div>

      {/* --- THANH TÌM KIẾM VÀ LỌC --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm số phòng (VD: B1-101)..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#2b78c5] rounded-2xl outline-none font-bold transition-all"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#2b78c5] rounded-2xl outline-none font-bold appearance-none cursor-pointer"
            value={locTrangThai}
            onChange={(e) => setLocTrangThai(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Trống">Còn trống</option>
            <option value="Đang ở">Đang có người</option>
            <option value="Đã đầy">Đã đầy phòng</option>
            <option value="Đang sửa">Đang bảo trì</option>
          </select>
        </div>
      </div>

      {/* --- HIỂN THỊ DANH SÁCH PHÒNG --- */}
      {Object.keys(groupedPhong).length > 0 ? (
        Object.keys(groupedPhong)
          .sort()
          .map((khuVuc) => (
            <div key={khuVuc} className="mb-12 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#2b78c5] p-2 rounded-xl text-white">
                  <FaBuilding size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-700 uppercase">
                  {khuVuc}
                </h3>
                <span className="bg-blue-50 text-[#2b78c5] px-3 py-1 rounded-lg text-xs font-black">
                  {groupedPhong[khuVuc].length} PHÒNG
                </span>
                <div className="flex-1 h-[2px] bg-gray-50 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {groupedPhong[khuVuc].map((phong) => {
                  const style = getStatusStyle(phong.trangThai);
                  return (
                    <div
                      key={phong._id}
                      className={`relative rounded-3xl border-2 p-6 transition-all group hover:-translate-y-2 hover:shadow-2xl ${style.card}`}
                    >
                      <div
                        className={`absolute top-0 left-0 w-2.5 h-full ${style.badge} rounded-l-full`}
                      ></div>

                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-2xl font-black tracking-tighter">
                          {phong.tenPhong}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-lg text-white font-black uppercase ${style.badge}`}
                        >
                          {phong.trangThai}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm font-bold opacity-80">
                        <p className="flex items-center gap-2">
                          <FaBed /> {phong.loaiPhong?.tenLoai || "N/A"}
                        </p>
                        <p className="flex items-center gap-2">
                          <FaUsers /> {phong.loaiPhong?.sucChua || 0} người
                        </p>
                        <p className="flex items-center gap-2">
                          <FaMoneyBillWave />{" "}
                          {phong.loaiPhong?.giaTien?.toLocaleString() || 0} đ
                        </p>
                      </div>

                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setIsEditMode(true);
                            setCurrentId(phong._id);
                            setFormData({
                              tenPhong: phong.tenPhong,
                              loaiPhong: phong.loaiPhong?._id,
                              trangThai: phong.trangThai,
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("Xác nhận xóa?")) {
                              await axios.delete(
                                `http://localhost:5000/api/phong/${phong._id}`,
                                config,
                              );
                              fetchData();
                            }
                          }}
                          className="p-2 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase tracking-widest">
            Không tìm thấy phòng nào khớp với bộ lọc
          </p>
          <button
            onClick={() => {
              setTuKhoa("");
              setLocTrangThai("");
            }}
            className="mt-4 text-[#2b78c5] font-black underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* --- MODAL (Giữ nguyên) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative animate-zoomIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <h3 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tighter">
              {isEditMode ? "Cập nhật thông tin" : "Thêm phòng mới"}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (isEditMode)
                    await axios.put(
                      `http://localhost:5000/api/phong/${currentId}`,
                      formData,
                      config,
                    );
                  else
                    await axios.post(
                      "http://localhost:5000/api/phong",
                      formData,
                      config,
                    );
                  setIsModalOpen(false);
                  fetchData();
                } catch (error) {
                  alert("Thao tác lỗi!");
                }
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                  Số phòng (Gợi ý: Tòa-Số)
                </label>
                <input
                  type="text"
                  required
                  placeholder="B1-101"
                  className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-[#2b78c5] bg-gray-50 transition-all"
                  value={formData.tenPhong}
                  onChange={(e) =>
                    setFormData({ ...formData, tenPhong: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                  Loại phòng
                </label>
                <select
                  required
                  className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-[#2b78c5] bg-gray-50 appearance-none cursor-pointer"
                  value={formData.loaiPhong}
                  onChange={(e) =>
                    setFormData({ ...formData, loaiPhong: e.target.value })
                  }
                >
                  <option value="">-- Chọn loại --</option>
                  {danhSachLoaiPhong.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.tenLoai}
                    </option>
                  ))}
                </select>
              </div>
              {isEditMode && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                    Trạng thái phòng
                  </label>
                  <select
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-[#2b78c5] bg-gray-50 appearance-none cursor-pointer"
                    value={formData.trangThai}
                    onChange={(e) =>
                      setFormData({ ...formData, trangThai: e.target.value })
                    }
                  >
                    <option value="Trống">Trống</option>
                    <option value="Đang ở">Đang ở</option>
                    <option value="Đã đầy">Đã đầy</option>
                    <option value="Đang sửa">Đang sửa</option>
                  </select>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#2b78c5] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest mt-4"
              >
                Xác nhận lưu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
