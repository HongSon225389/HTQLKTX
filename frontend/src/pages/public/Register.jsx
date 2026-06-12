import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { guestApi } from "../../services/guestApi";

const Register = () => {
  const navigate = useNavigate();
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hoTenKhach: "",
    maSV: "",
    cccd: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    sdt: "",
    email: "",
    loaiPhong: "",
    ngayBatDauDuKien: "",
    soThangDangKy: 6, // Mặc định 6 tháng
  });

  // Gọi API lấy danh sách loại phòng ngay khi mở trang
  useEffect(() => {
    const fetchLoaiPhong = async () => {
      try {
        const res = await guestApi.getLoaiPhong();
        if (res.success) {
          setLoaiPhongs(res.data);
          // Gán mặc định loại phòng đầu tiên nếu có
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, loaiPhong: res.data[0]._id }));
          }
        }
      } catch (error) {
        toast.error("Không tải được danh sách loại phòng");
      }
    };
    fetchLoaiPhong();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        maDon: `DK${Date.now().toString().slice(-6)}`,
      };

      const res = await guestApi.guiDonDangKy(submitData);
      if (res.success) {
        toast.success("Gửi đơn đăng ký thành công! Vui lòng chờ BQL duyệt.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đơn!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700">
            Đăng Ký Lưu Trú KTX
          </h2>
          <p className="mt-2 text-gray-500">
            Vui lòng điền đầy đủ thông tin bên dưới
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chia 2 cột cho các trường thông tin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ và Tên
              </label>
              <input
                type="text"
                name="hoTenKhach"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã Sinh Viên
              </label>
              <input
                type="text"
                name="maSV"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số CCCD (Dùng làm mật khẩu)
              </label>
              <input
                type="text"
                name="cccd"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày Sinh
              </label>
              <input
                type="date"
                name="ngaySinh"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giới Tính
              </label>
              <select
                name="gioiTinh"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số Điện Thoại
              </label>
              <input
                type="text"
                name="sdt"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin lưu trú
              </h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Chọn Loại Phòng
              </label>
              <select
                name="loaiPhong"
                required
                value={formData.loaiPhong}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="" disabled>
                  -- Chọn loại phòng --
                </option>
                {loaiPhongs.map((lp) => (
                  <option key={lp._id} value={lp._id}>
                    {lp.tenLoaiPhong} - {(lp.donGia || 0).toLocaleString()}{" "}
                    VNĐ/tháng
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày chuyển vào dự kiến
              </label>
              <input
                type="date"
                name="ngayBatDauDuKien"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thời gian ở (Tháng)
              </label>
              <input
                type="number"
                name="soThangDangKy"
                min="1"
                value={formData.soThangDangKy}
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Quay lại đăng nhập
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "opacity-70" : ""}`}
            >
              {loading ? "Đang gửi..." : "Gửi Đơn Đăng Ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
