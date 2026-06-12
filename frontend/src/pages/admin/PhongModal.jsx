import { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { loaiPhongApi } from "../../services/loaiPhongApi";

const PhongModal = ({ isOpen, onClose, onSubmit, phongData, loading }) => {
  const [danhSachLoai, setDanhSachLoai] = useState([]);
  const [formData, setFormData] = useState({
    maPhong: "",
    tenPhong: "",
    toaNha: "",
    tang: "",
    loaiPhong: "",
    donGia: "",
    moTa: "",
  });

  useEffect(() => {
    const fetchLoaiPhong = async () => {
      try {
        const res = await loaiPhongApi.getAll();
        if (res.success) {
          setDanhSachLoai(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách loại phòng:", error);
      }
    };
    if (isOpen) fetchLoaiPhong();
  }, [isOpen]);

  useEffect(() => {
    if (phongData && isOpen) {
      setFormData({
        maPhong: phongData.maPhong || "",
        tenPhong: phongData.tenPhong || "",
        toaNha: phongData.toaNha || "",
        tang: phongData.tang || "",
        loaiPhong: phongData.loaiPhong?._id || phongData.loaiPhong || "",
        donGia: phongData.loaiPhong?.donGia || "",
        moTa: phongData.moTa || "",
      });
    } else {
      setFormData({
        maPhong: "",
        tenPhong: "",
        toaNha: "",
        tang: "",
        loaiPhong: "",
        donGia: "",
        moTa: "",
      });
    }
  }, [phongData, isOpen]);

  // Tự động cập nhật ô giá tiền khi Admin thay đổi lựa chọn Loại phòng
  const handleSelectLoaiPhong = (e) => {
    const selectedId = e.target.value;
    const giaCuaLoai =
      danhSachLoai.find((item) => item._id === selectedId)?.donGia || "";
    setFormData({
      ...formData,
      loaiPhong: selectedId,
      donGia: giaCuaLoai, // Tự điền giá tương ứng vào ô nhập liệu
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {phongData ? "Cập Nhật Thông Tin Phòng" : "Thêm Phòng Mới"}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã Phòng *
                </label>
                <input
                  type="text"
                  name="maPhong"
                  required
                  disabled={!!phongData}
                  value={formData.maPhong}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase disabled:bg-gray-100"
                  placeholder="VD: P101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Phòng *
                </label>
                <input
                  type="text"
                  name="tenPhong"
                  required
                  value={formData.tenPhong}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Phòng 101"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tòa Nhà *
                </label>
                <input
                  type="text"
                  name="toaNha"
                  required
                  value={formData.toaNha}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="VD: TÒA A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tầng *
                </label>
                <input
                  type="number"
                  name="tang"
                  required
                  min="1"
                  value={formData.tang}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cấu Hình Loại Phòng *
              </label>
              <select
                name="loaiPhong"
                required
                value={formData.loaiPhong}
                onChange={handleSelectLoaiPhong}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">-- Chọn loại phòng --</option>
                {danhSachLoai.map((loai) => (
                  <option key={loai._id} value={loai._id}>
                    {loai.tenLoaiPhong} (Sức chứa: {loai.sucChua} người)
                  </option>
                ))}
              </select>
            </div>

            {/* Ô NHẬP GIÁ TIỀN  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá Thu Loại Phòng Này (VNĐ/Tháng) *
              </label>
              <input
                type="number"
                name="donGia"
                required
                min="0"
                value={formData.donGia}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-red-600"
                placeholder="VD: 1200000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả thêm
              </label>
              <textarea
                name="moTa"
                rows="2"
                value={formData.moTa}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu Thông Tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhongModal;
