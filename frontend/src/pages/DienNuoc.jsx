import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBolt,
  FaTint,
  FaPlus,
  FaSearch,
  FaTimes,
  FaCalculator,
  FaTrash,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";

export default function DienNuoc() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [danhSach, setDanhSach] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tuKhoa, setTuKhoa] = useState("");

  // --- STATE FORM (Mặc định kỳ tháng hiện tại) ---
  const [formData, setFormData] = useState({
    phongId: "",
    thangNam: "05/2026",
    dienCu: 0,
    dienMoi: 0,
    nuocCu: 0,
    nuocMoi: 0,
    donGiaDien: 3500,
    donGiaNuoc: 25000,
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // --- 1. LOAD DỮ LIỆU BAN ĐẦU ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resDN, resP] = await Promise.all([
        axios.get("http://localhost:5000/api/dien-nuoc", config),
        axios.get("http://localhost:5000/api/phong", config),
      ]);
      setDanhSach(resDN.data);
      setPhongs(resP.data);
    } catch (e) {
      console.error("Lỗi tải dữ liệu:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. LOGIC TỰ ĐỘNG ĐIỀN SỐ CŨ (AUTO-FILL) ---
  const handleRoomChange = async (phongId) => {
    // Reset form khi đổi phòng
    setFormData((prev) => ({
      ...prev,
      phongId,
      dienCu: 0,
      nuocCu: 0,
      dienMoi: 0,
      nuocMoi: 0,
    }));

    if (!phongId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/dien-nuoc/latest/${phongId}`,
        config,
      );
      console.log("Dữ liệu tháng trước nhận được:", res.data);

      setFormData((prev) => ({
        ...prev,
        dienCu: res.data.dienMoi || 0,
        nuocCu: res.data.nuocMoi || 0,
        dienMoi: res.data.dienMoi || 0,
        nuocMoi: res.data.nuocMoi || 0,
      }));
    } catch (error) {
      console.log("Phòng này chưa có dữ liệu tháng trước, bắt đầu từ 0.");
    }
  };

  // --- 3. XỬ LÝ CHỐT SỐ MỚI ---
  const handleChotSo = async (e) => {
    e.preventDefault();
    if (!formData.phongId) return alert("Vui lòng chọn phòng!");
    if (
      formData.dienMoi < formData.dienCu ||
      formData.nuocMoi < formData.nuocCu
    ) {
      return alert("Chỉ số mới không được nhỏ hơn chỉ số cũ!");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/dien-nuoc/ghi-so",
        formData,
        config,
      );
      alert("Chốt số & Tạo hóa đơn thành công!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi chốt số");
    }
  };

  // --- 4. XỬ LÝ XÓA BẢN GHI LỖI ---
  const handleXoa = async (id) => {
    if (
      window.confirm(
        "Xác nhận xóa bản ghi này? (Thao tác này không xóa hóa đơn đã xuất)",
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/dien-nuoc/${id}`, config);
        setDanhSach(danhSach.filter((item) => item._id !== id));
      } catch (e) {
        alert("Lỗi xóa dữ liệu");
      }
    }
  };

  // --- FILTER TÌM KIẾM ---
  const filtered = danhSach.filter((item) =>
    item.phong?.tenPhong?.toLowerCase().includes(tuKhoa.toLowerCase()),
  );

  if (loading)
    return (
      <div className="p-20 text-center font-black text-gray-300 italic animate-pulse">
        ĐANG ĐỒNG BỘ CHỈ SỐ...
      </div>
    );

  return (
    <div className="w-full pb-20 px-4">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3">
            <FaBolt className="text-yellow-500" /> QUẢN LÝ ĐIỆN - NƯỚC
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Ghi chỉ số & Tính toán tiêu thụ tự động
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2b78c5] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:rotate-2 hover:scale-105 transition-all flex items-center gap-2 text-xs uppercase"
        >
          <FaPlus /> Ghi chỉ số mới
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4 focus-within:shadow-md transition-all">
        <FaSearch className="text-gray-300 ml-3" />
        <input
          type="text"
          placeholder="Tìm theo tên phòng (VD: P101)..."
          className="flex-1 outline-none font-bold text-gray-600 placeholder:text-gray-200"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="p-6">Phòng / Kỳ hạn</th>
              <th className="p-6 text-center">Chỉ số Điện (kWh)</th>
              <th className="p-6 text-center">Chỉ số Nước (m³)</th>
              <th className="p-6">Thành tiền</th>
              <th className="p-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="p-6">
                  {item.phong ? (
                    <p className="font-black text-[#2b78c5] text-lg">
                      {item.phong.tenPhong}
                    </p>
                  ) : (
                    <p className="font-black text-red-400 flex items-center gap-1">
                      <FaExclamationTriangle /> N/A
                    </p>
                  )}
                  <p className="text-[10px] font-black text-gray-300 uppercase italic">
                    Tháng: {item.thangNam}
                  </p>
                </td>
                <td className="p-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
                      {item.dienCu} <FaArrowRight className="inline mx-1" />{" "}
                      {item.dienMoi}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">
                      Dùng: {item.dienMoi - item.dienCu} kWh
                    </span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">
                      {item.nuocCu} <FaArrowRight className="inline mx-1" />{" "}
                      {item.nuocMoi}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">
                      Dùng: {item.nuocMoi - item.nuocCu} m³
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-black text-gray-800 text-xl tracking-tighter">
                    {item.tongTien?.toLocaleString()}đ
                  </p>
                </td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => handleXoa(item._id)}
                    className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL GHI CHỈ SỐ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-4xl shadow-2xl relative animate-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-all"
            >
              <FaTimes size={28} />
            </button>

            <h3 className="text-2xl font-black text-gray-800 mb-8 uppercase italic flex items-center gap-3">
              <FaCalculator className="text-[#2b78c5]" /> Ghi chỉ số tháng mới
            </h3>

            <form
              onSubmit={handleChotSo}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* CỘT 1: THÔNG TIN PHÒNG */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    1. Chọn phòng cần chốt
                  </label>
                  <select
                    required
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold bg-gray-50 outline-none focus:border-[#2b78c5] transition-all"
                    value={formData.phongId}
                    onChange={(e) => handleRoomChange(e.target.value)}
                  >
                    <option value="">-- Chọn phòng --</option>
                    {phongs.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.tenPhong}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    2. Kỳ thanh toán (Tháng/Năm)
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold bg-gray-50"
                    value={formData.thangNam}
                    onChange={(e) =>
                      setFormData({ ...formData, thangNam: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* CỘT 2: CHỈ SỐ */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 bg-yellow-50/30 p-4 rounded-3xl border border-yellow-100">
                  <label className="text-[10px] font-black text-yellow-600 uppercase flex items-center gap-2">
                    <FaBolt /> Điện (kWh)
                  </label>
                  <input
                    type="number"
                    placeholder="Số cũ"
                    className="w-full bg-white rounded-xl px-4 py-3 font-bold border border-yellow-100 opacity-60"
                    value={formData.dienCu}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder="Số mới"
                    required
                    className="w-full bg-white border-2 border-yellow-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-yellow-500 shadow-sm"
                    value={formData.dienMoi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dienMoi: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-4 bg-blue-50/30 p-4 rounded-3xl border border-blue-100">
                  <label className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2">
                    <FaTint /> Nước (m³)
                  </label>
                  <input
                    type="number"
                    placeholder="Số cũ"
                    className="w-full bg-white rounded-xl px-4 py-3 font-bold border border-blue-100 opacity-60"
                    value={formData.nuocCu}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder="Số mới"
                    required
                    className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 shadow-sm"
                    value={formData.nuocMoi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nuocMoi: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="md:col-span-2 w-full bg-[#2b78c5] text-white py-5 rounded-[1.8rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all uppercase tracking-widest italic"
              >
                Xác nhận chốt số & Xuất hóa đơn
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
