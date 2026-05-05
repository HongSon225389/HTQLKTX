import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaSearch,
  FaTrash,
  FaUserGraduate,
  FaTimes,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaEdit,
  FaBirthdayCake,
  FaTransgender,
} from "react-icons/fa";

export default function SinhVien() {
  // --- States dữ liệu ---
  const [danhSachSV, setDanhSachSV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tuKhoa, setTuKhoa] = useState("");

  // --- States Modal & Form ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Thêm/Sửa
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal Chi tiết
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    maSV: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    queQuan: "",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // --- 1. Tải dữ liệu ---
  const fetchData = async () => {
    try {
      setLoading(true);
      // Backend trả về danh sách SV (hàm layDanhSachSV đã gộp thêm trường hopDong)
      const res = await axios.get("http://localhost:5000/api/sinhvien", config);
      setDanhSachSV(res.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. Xử lý Modal Chi tiết ---
  const handleOpenDetail = (sv) => {
    setSelectedStudent(sv);
    setIsDetailModalOpen(true);
  };

  // --- 3. Xử lý Thêm/Sửa (Chỉ thông tin cá nhân) ---
  const handleOpenEdit = (e, sv) => {
    e.stopPropagation();
    setIsEditMode(true);
    setSelectedStudent(sv);
    setFormData({
      maSV: sv.maSV,
      hoTen: sv.hoTen,
      ngaySinh: sv.ngaySinh ? sv.ngaySinh.split("T")[0] : "",
      gioiTinh: sv.gioiTinh,
      queQuan: sv.queQuan,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/sinhvien/${selectedStudent._id}`,
          formData,
          config,
        );
        alert("Cập nhật thông tin thành công!");
      } else {
        await axios.post(
          "http://localhost:5000/api/sinhvien/dang-ky",
          formData,
          config,
        );
        alert("Thêm sinh viên thành công!");
      }
      closeModal();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // --- 4. Xử lý Xóa ---
  const handleXoa = async (e, id) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa sinh viên này? Hợp đồng liên quan sẽ bị xóa.",
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/sinhvien/${id}`, config);
        fetchData();
      } catch (error) {
        alert("Lỗi khi xóa dữ liệu!");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsEditMode(false);
    setSelectedStudent(null);
    setFormData({
      maSV: "",
      hoTen: "",
      ngaySinh: "",
      gioiTinh: "Nam",
      queQuan: "",
    });
  };

  const filteredSV = danhSachSV.filter(
    (sv) =>
      sv.hoTen?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      sv.maSV?.includes(tuKhoa),
  );

  if (loading)
    return (
      <div className="p-10 text-center font-black text-[#2b78c5] animate-pulse">
        ĐANG TRUY XUẤT DỮ LIỆU...
      </div>
    );

  return (
    <div className="w-full pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3">
            <FaUserGraduate className="text-[#2b78c5]" /> QUẢN LÝ SINH VIÊN
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            Hồ sơ nội trú & Tình trạng hợp đồng
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
          className="bg-[#2b78c5] text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaUserPlus /> THÊM SINH VIÊN
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <FaSearch className="text-gray-300 ml-3" />
        <input
          type="text"
          placeholder="Tìm kiếm theo MSSV hoặc Tên..."
          className="flex-1 outline-none font-bold text-gray-600"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr className="text-[10px] font-black text-gray-400 uppercase">
              <th className="p-6">MSSV</th>
              <th className="p-6">Họ và Tên</th>
              <th className="p-6">Phòng</th>
              <th className="p-6">Trạng thái HĐ</th>
              <th className="p-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredSV.map((sv) => (
              <tr
                key={sv._id}
                onClick={() => handleOpenDetail(sv)}
                className="group hover:bg-blue-50/30 cursor-pointer transition-all"
              >
                <td className="p-6 font-bold text-gray-500">{sv.maSV}</td>
                <td className="p-6 font-black text-[#2b78c5]">{sv.hoTen}</td>
                <td className="p-6">
                  {sv.phong ? (
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-black text-[10px] uppercase">
                      {sv.phong.tenPhong}
                    </span>
                  ) : (
                    <span className="text-gray-300 italic text-xs">
                      Chưa xếp phòng
                    </span>
                  )}
                </td>
                <td className="p-6">
                  {sv.hopDong ? (
                    <span className="text-green-500 flex items-center gap-1 font-bold text-xs">
                      <FaCheckCircle className="text-[10px]" /> Đã ký HĐ
                    </span>
                  ) : (
                    <span className="text-red-300 flex items-center gap-1 font-bold text-xs">
                      <FaTimes className="text-[10px]" /> Chưa có HĐ
                    </span>
                  )}
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={(e) => handleOpenEdit(e, sv)}
                      className="p-2 text-blue-400 hover:bg-white rounded-xl shadow-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => handleXoa(e, sv._id)}
                      className="p-2 text-red-200 hover:text-red-500 hover:bg-white rounded-xl shadow-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL 1: THÊM/SỬA THÔNG TIN CÁ NHÂN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[150] p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl relative animate-in zoom-in duration-300">
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-gray-300 hover:text-red-500"
            >
              <FaTimes size={24} />
            </button>
            <h3 className="text-2xl font-black text-gray-800 uppercase italic mb-8 border-b-4 border-[#2b78c5] inline-block">
              {isEditMode ? "Cập nhật hồ sơ" : "Thêm sinh viên mới"}
            </h3>
            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 gap-6"
            >
              <input
                type="text"
                placeholder="Mã số sinh viên"
                required
                readOnly={isEditMode}
                className={`w-full border-2 rounded-2xl px-6 py-4 font-bold ${isEditMode ? "bg-gray-100 text-gray-400" : "bg-gray-50 focus:border-[#2b78c5]"}`}
                value={formData.maSV}
                onChange={(e) =>
                  setFormData({ ...formData, maSV: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Họ và tên"
                required
                className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-4 font-bold focus:border-[#2b78c5]"
                value={formData.hoTen}
                onChange={(e) =>
                  setFormData({ ...formData, hoTen: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-4 font-bold"
                  value={formData.ngaySinh}
                  onChange={(e) =>
                    setFormData({ ...formData, ngaySinh: e.target.value })
                  }
                />
                <select
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-4 font-bold"
                  value={formData.gioiTinh}
                  onChange={(e) =>
                    setFormData({ ...formData, gioiTinh: e.target.value })
                  }
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Quê quán"
                className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-4 font-bold focus:border-[#2b78c5]"
                value={formData.queQuan}
                onChange={(e) =>
                  setFormData({ ...formData, queQuan: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-[#2b78c5] text-white py-5 rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all uppercase italic"
              >
                {isEditMode ? "Lưu thay đổi" : "Xác nhận thêm mới"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CHI TIẾT HỒ SƠ & HỢP ĐỒNG --- */}
      {isDetailModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-gray-300 hover:text-red-500"
            >
              <FaTimes size={24} />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <FaUserGraduate size={40} className="text-[#2b78c5]" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 text-center">
                {selectedStudent?.hoTen || "N/A"}
              </h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                MSSV: {selectedStudent?.maSV || "N/A"}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <p className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <FaBirthdayCake className="text-pink-400" />
                {selectedStudent?.ngaySinh
                  ? new Date(selectedStudent.ngaySinh).toLocaleDateString(
                      "vi-VN",
                    )
                  : "Chưa cập nhật"}
              </p>
              <p className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <FaTransgender className="text-purple-400" />{" "}
                {selectedStudent?.gioiTinh || "N/A"}
              </p>
              <p className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <FaMapMarkerAlt className="text-red-400" />{" "}
                {selectedStudent?.queQuan || "N/A"}
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaFileContract className="text-blue-500" /> Dữ liệu lưu trú
              </h4>

              {/* Ưu tiên hiển thị phòng từ Hợp đồng nếu hồ sơ SV bị thiếu */}
              {selectedStudent?.hopDong || selectedStudent?.phong ? (
                <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-blue-800 uppercase">
                      Phòng
                    </span>
                    <span className="font-black text-blue-600 text-lg">
                      {selectedStudent.phong?.tenPhong ||
                        selectedStudent.hopDong?.phong?.tenPhong ||
                        "Đang xác định..."}
                    </span>
                  </div>
                  {selectedStudent.hopDong && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Mã HĐ: {selectedStudent.hopDong.maHD}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Hạn:{" "}
                        {selectedStudent.hopDong.ngayKetThuc
                          ? new Date(
                              selectedStudent.hopDong.ngayKetThuc,
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 text-center">
                  <p className="text-gray-400 font-bold text-sm italic">
                    Chưa thực hiện ký hợp đồng nội trú
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icons
function FaCheckCircle(props) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-97.336-216-216S137.336 40 256 40s216 97.336 216 216-97.336 216-216 216zm119.35-285.95l-148.2 148.2-64.75-64.75c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l101.5 101.5c4.686 4.686 12.284 4.686 16.971 0l184.935-184.935c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.687-4.686-12.285-4.686-16.971 0z"></path>
    </svg>
  );
}
