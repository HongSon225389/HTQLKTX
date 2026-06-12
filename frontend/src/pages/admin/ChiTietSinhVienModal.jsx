import {
  FaTimes,
  FaUserCircle,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
  FaBed,
} from "react-icons/fa";

const ChiTietSinhVienModal = ({ isOpen, onClose, sinhVien }) => {
  if (!isOpen || !sinhVien) return null;

  // Hàm format ngày tháng giống hệt bên trang sinh viên
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaIdCard /> Hồ Sơ Chi Tiết
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <FaUserCircle className="text-7xl text-gray-300" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {sinhVien.hoTen}
              </h3>
              <p className="text-blue-600 font-semibold text-lg">
                Mã SV: {sinhVien.maSV}
              </p>
              <span
                className={`mt-2 px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                  sinhVien.trangThai === "DA_ROI" ||
                  sinhVien.trangThai === "LOCKED"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {sinhVien.trangThai === "DA_ROI"
                  ? "Đã rời KTX"
                  : sinhVien.trangThai === "LOCKED"
                    ? "Đang bị khóa"
                    : "Đang nội trú"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div className="flex items-start gap-3">
              <FaIdCard className="text-gray-400 text-lg mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Số CCCD
                </p>
                <p className="font-medium text-gray-900">{sinhVien.cccd}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaBirthdayCake className="text-gray-400 text-lg mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Ngày sinh
                </p>
                <p className="font-medium text-gray-900">
                  {formatDate(sinhVien.ngaySinh)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaVenusMars className="text-gray-400 text-lg mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Giới tính
                </p>
                <p className="font-medium text-gray-900">
                  {sinhVien.gioiTinh || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-gray-400 text-lg mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Quê quán
                </p>
                <p className="font-medium text-gray-900">
                  {sinhVien.queQuan || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaPhone className="text-gray-400 text-lg mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Số điện thoại
                </p>
                <p className="font-medium text-gray-900">{sinhVien.sdt}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="text-gray-400 text-lg mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Email
                </p>
                <p className="font-medium text-gray-900">{sinhVien.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <FaBed className="text-blue-500 text-xl mt-1" />
              <div>
                <p className="text-xs text-blue-600 uppercase font-bold">
                  Phòng đang ở
                </p>
                <p className="font-semibold text-gray-900">
                  {sinhVien.phong
                    ? `${sinhVien.phong.tenPhong} (Mã: ${sinhVien.phong.maPhong})`
                    : "Chưa được xếp phòng"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietSinhVienModal;
