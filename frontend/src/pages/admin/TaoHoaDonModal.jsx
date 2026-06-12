import React, { useState, useEffect } from "react";
import { FaTimes, FaBolt, FaTint, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { phongApi } from "../../services/phongApi"; // Để lấy danh sách phòng
import { chiSoDienNuocApi } from "../../services/chiSoDienNuocApi";
import { hoaDonApi } from "../../services/hoaDonApi";
const TaoHoaDonModal = ({ isOpen, onClose, onSuccess }) => {
  const [listPhong, setListPhong] = useState([]);
  const [loading, setLoading] = useState(false);

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    phong: "",
    thangNam: "",
    hanThanhToan: "",
    dienCu: "",
    dienMoi: "",
    nuocCu: "",
    nuocMoi: "",
  });
  const [hasOldData, setHasOldData] = useState(false); // Trạng thái khóa/mở ô nhập
  // Tự động set kỳ thu là tháng hiện tại khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();

      // Mặc định hạn thanh toán là ngày 10 tháng sau
      const nextMonth = new Date(year, today.getMonth() + 1, 10);
      const hanThanhToanDefault = nextMonth.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        thangNam: `${month}/${year}`,
        hanThanhToan: hanThanhToanDefault,
      }));

      fetchPhong();
    }
  }, [isOpen]);
  useEffect(() => {
    if (formData.phong) {
      const fetchSoCu = async () => {
        try {
          const res = await chiSoDienNuocApi.getMoiNhatCuaPhong(formData.phong);
          const dataChiSo = res.data ? res.data : res;

          if (dataChiSo && dataChiSo.soDienMoi !== undefined) {
            setHasOldData(true); // TÌM THẤY SỐ CŨ -> BẬT CHẾ ĐỘ KHÓA
            setFormData((prev) => ({
              ...prev,
              dienCu: dataChiSo.soDienMoi,
              nuocCu: dataChiSo.soNuocMoi,
            }));
          }
        } catch (error) {
          // LỖI 404 (PHÒNG MỚI TINH) -> MỞ KHÓA CHO NHẬP TAY
          setHasOldData(false);
          setFormData((prev) => ({ ...prev, dienCu: "", nuocCu: "" })); // Xóa trắng để Admin tự gõ
        }
      };
      fetchSoCu();
    }
  }, [formData.phong]);
  const fetchPhong = async () => {
    try {
      const res = await phongApi.getAll({ limit: 1000 });
      // Chỉ lấy những phòng đang có người ở
      const phongCoNguoi = res.data.filter((p) => p.soNguoiHienTai > 0);
      setListPhong(phongCoNguoi);
    } catch (error) {
      toast.error("Không tải được danh sách phòng");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Logic tự sinh Mã Hóa Đơn để hiển thị cho Admin xem
  const getSelectedMaPhong = () => {
    const phong = listPhong.find((p) => p._id === formData.phong);
    return phong ? phong.maPhong : "XXX";
  };
  const generatedMaHoaDon = `HD${formData.thangNam.replace("/", "")}-${getSelectedMaPhong()}`;

  // Tính toán số lượng tiêu thụ hiển thị realtime
  const tieuThuDien =
    (Number(formData.dienMoi) || 0) - (Number(formData.dienCu) || 0);
  const tieuThuNuoc =
    (Number(formData.nuocMoi) || 0) - (Number(formData.nuocCu) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tieuThuDien < 0 || tieuThuNuoc < 0) {
      return toast.error("Chỉ số mới không được nhỏ hơn chỉ số cũ!");
    }

    setLoading(true);
    try {
      // 1. GỌI API CHỐT SỐ ĐIỆN NƯỚC TRƯỚC
      const dataChotSo = {
        maCS: `CS${formData.thangNam.replace("/", "")}-${getSelectedMaPhong()}`,
        phong: formData.phong,
        thangNam: formData.thangNam,
        soDienCu: Number(formData.dienCu),
        soDienMoi: Number(formData.dienMoi),
        soNuocCu: Number(formData.nuocCu),
        soNuocMoi: Number(formData.nuocMoi),
      };

      const resChotSo = await chiSoDienNuocApi.chotSo(dataChotSo);

      // Lấy ID của bản ghi chốt số vừa tạo (tùy thuộc vào cấu trúc trả về của axiosClient)
      const chiSoId = resChotSo.data._id;

      // 2. GỌI API TẠO HÓA ĐƠN HÀNG LOẠT
      const dataHoaDon = {
        maHoaDon: generatedMaHoaDon, // Mã gốc
        phong: formData.phong,
        chiSoDienNuoc: chiSoId, // Truyền ID chốt số sang
        hanThanhToan: formData.hanThanhToan,
      };

      const resHoaDon = await hoaDonApi.create(dataHoaDon);

      toast.success(resHoaDon.message || "Tạo hóa đơn thành công!");
      onSuccess(); // Đóng modal và load lại bảng
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Có lỗi xảy ra!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            Lập Hóa Đơn & Chốt Điện Nước
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái: Thông tin cơ bản */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Kỳ Thu (Tháng/Năm) *
                </label>
                <input
                  type="text"
                  name="thangNam"
                  placeholder="VD: 06/2026"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.thangNam}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Chọn Phòng *
                </label>
                <select
                  name="phong"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.phong}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn phòng đang có người ở --</option>
                  {[...listPhong]
                    .sort(
                      (a, b) =>
                        a.toaNha.localeCompare(b.toaNha) ||
                        a.maPhong.localeCompare(b.maPhong),
                    )
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.toaNha} - Phòng {p.maPhong} ({p.soNguoiHienTai}{" "}
                        người)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hạn thanh toán *
                </label>
                <input
                  type="date"
                  name="hanThanhToan"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={formData.hanThanhToan}
                  onChange={handleChange}
                />
              </div>

              {/* Ô hiển thị Mã Hóa Đơn tự sinh */}
              <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 mt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                  Mã hóa đơn gốc (Tự động):
                </p>
                <p className="font-mono font-bold text-blue-700 text-lg">
                  {generatedMaHoaDon}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  *Hệ thống sẽ tự thêm mã SV vào đuôi
                </p>
              </div>
            </div>

            {/* Cột phải: Chốt chỉ số */}
            <div className="col-span-2 md:col-span-1 space-y-6">
              {/* Box Điện */}
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                <h4 className="font-bold text-orange-600 mb-3 flex items-center gap-2">
                  <FaBolt /> Chỉ số Điện
                </h4>
                <div className="flex gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Số cũ
                    </label>
                    <input
                      type="number"
                      name="dienCu"
                      required
                      min="0"
                      readOnly={hasOldData}
                      // className="w-full border border-gray-300 rounded-lg px-2 py-1.5"
                      className={`w-full border border-gray-300 rounded-lg px-2 py-1.5 ${
                        hasOldData
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white"
                      }`}
                      value={formData.dienCu}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Số mới
                    </label>
                    <input
                      type="number"
                      name="dienMoi"
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5"
                      value={formData.dienMoi}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-orange-700 text-right">
                  Tiêu thụ: {tieuThuDien >= 0 ? tieuThuDien : 0} kWh
                </div>
              </div>

              {/* Box Nước */}
              <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl">
                <h4 className="font-bold text-cyan-600 mb-3 flex items-center gap-2">
                  <FaTint /> Chỉ số Nước
                </h4>
                <div className="flex gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Số cũ
                    </label>
                    <input
                      type="number"
                      name="nuocCu"
                      required
                      min="0"
                      readOnly={hasOldData}
                      // className="w-full border border-gray-300 rounded-lg px-2 py-1.5"
                      className={`w-full border border-gray-300 rounded-lg px-2 py-1.5 ${
                        hasOldData
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white"
                      }`}
                      value={formData.nuocCu}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Số mới
                    </label>
                    <input
                      type="number"
                      name="nuocMoi"
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5"
                      value={formData.nuocMoi}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-cyan-700 text-right">
                  Tiêu thụ: {tieuThuNuoc >= 0 ? tieuThuNuoc : 0} m³
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Lập Hóa Đơn & Chốt Số"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaoHoaDonModal;
