import { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

const SinhVienModal = ({
  isOpen,
  onClose,
  onSubmit,
  sinhVienData,
  loading,
}) => {
  const [formData, setFormData] = useState({
    maSV: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "Nam", // Mặc định là Nam
    cccd: "",
    sdt: "",
    email: "",
    queQuan: "",
  });

  // Tự động điền dữ liệu nếu là form Cập Nhật (Sửa)
  useEffect(() => {
    if (sinhVienData && isOpen) {
      setFormData({
        maSV: sinhVienData.maSV || "",
        hoTen: sinhVienData.hoTen || "",
        // Xử lý cắt chuỗi ngày tháng chuẩn ISO (YYYY-MM-DD) để gán vào input type="date"
        ngaySinh: sinhVienData.ngaySinh
          ? sinhVienData.ngaySinh.slice(0, 10)
          : "",
        gioiTinh: sinhVienData.gioiTinh || "Nam",
        cccd: sinhVienData.cccd || "",
        sdt: sinhVienData.sdt || "",
        email: sinhVienData.email || "",
        queQuan: sinhVienData.queQuan || "",
      });
    } else {
      // Xóa trắng form nếu là form Thêm Mới
      setFormData({
        maSV: "",
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "Nam",
        cccd: "",
        sdt: "",
        email: "",
        queQuan: "",
      });
    }
  }, [sinhVienData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Nếu modal không mở thì không render gì cả
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in-up">
        {/* Header của Modal */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">
            {sinhVienData
              ? "Cập Nhật Thông Tin Sinh Viên"
              : "Thêm Sinh Viên Mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Nội dung Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã Sinh Viên *
                </label>
                <input
                  type="text"
                  name="maSV"
                  value={formData.maSV}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: 20225389"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Lê Hồng Sơn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số CCCD *
                </label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập 12 số CCCD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  name="gioiTinh"
                  value={formData.gioiTinh}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: 0912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: lehongson@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quê Quán
                </label>
                <input
                  type="text"
                  name="queQuan"
                  value={formData.queQuan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Hà Nội"
                />
              </div>
            </div>
          </div>

          {/* Footer của Modal (Nút bấm) */}
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-blue-400"
            >
              <FaSave />
              <span>{loading ? "Đang lưu..." : "Lưu Thông Tin"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SinhVienModal;
