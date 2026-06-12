import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { hopDongApi } from "../../services/hopDongApi";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

const TaoHopDongModal = ({ onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    maHD: "",
    sinhVien: "",
    phong: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    tienCoc: "",
  });

  const [listSinhVien, setListSinhVien] = useState([]);
  const [listPhong, setListPhong] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Lấy dữ liệu danh sách sinh viên chưa có phòng & phòng còn chỗ trống
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [svRes, phongRes] = await Promise.all([
          axiosClient.get("/sinh-vien"),
          axiosClient.get("/phong"),
        ]);

        const svEmpty = (svRes.data || []).filter((sv) => !sv.phong);
        const phongAvailable = (phongRes.data || []).filter(
          (p) =>
            p.trangThai !== "Bảo trì" &&
            p.soNguoiHienTai < p.loaiPhong?.sucChua,
        );

        setListSinhVien(svEmpty);
        setListPhong(phongAvailable);
      } catch (error) {
        toast.error("Không thể tải danh sách dữ liệu phụ!");
      }
    };
    loadDependencies();
  }, []);

  // 🌟 LOGIC MỚI: Tự động sinh mã hợp đồng khi chọn Sinh Viên
  useEffect(() => {
    if (formData.sinhVien) {
      // Tìm sinh viên đang được chọn trong danh sách
      const selectedSV = listSinhVien.find(
        (sv) => sv._id === formData.sinhVien,
      );
      if (selectedSV && selectedSV.maSV) {
        const currentYear = new Date().getFullYear(); // Lấy năm hiện tại (VD: 2026)
        // Cập nhật mã hợp đồng theo công thức HD[Năm]-[Mã SV]
        setFormData((prev) => ({
          ...prev,
          maHD: `HD${currentYear}-${selectedSV.maSV}`,
        }));
      }
    } else {
      // Nếu bỏ chọn sinh viên thì xóa mã hợp đồng
      setFormData((prev) => ({ ...prev, maHD: "" }));
    }
  }, [formData.sinhVien, listSinhVien]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.ngayBatDau) >= new Date(formData.ngayKetThuc)) {
      toast.warning("Ngày bắt đầu phải nhỏ hơn ngày kết thúc hợp đồng!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await hopDongApi.create(formData);
      if (res.success) {
        toast.success("Tạo hợp đồng và xếp phòng thành công!");
        onRefresh();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo hợp đồng!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold">
            📝 Thiết Lập Hợp Đồng Lưu Trú Mới
          </h2>
          <button onClick={onClose} className="hover:text-gray-200">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Mã Hợp Đồng *
            </label>
            <input
              type="text"
              readOnly
              placeholder="Tự động sinh khi chọn SV..."
              className="w-full border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed rounded-xl px-3 py-2 text-sm outline-none"
              value={formData.maHD}
              // Đã loại bỏ onChange vì trường này giờ được auto-fill
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Tiền Đặt Cọc (VND) *
            </label>
            <input
              type="number"
              required
              placeholder="VD: 500000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={formData.tienCoc}
              onChange={(e) =>
                setFormData({ ...formData, tienCoc: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Chọn Sinh Viên Đăng Ký *
            </label>
            <select
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={formData.sinhVien}
              onChange={(e) =>
                setFormData({ ...formData, sinhVien: e.target.value })
              }
            >
              <option value="">-- Chọn sinh viên chưa có phòng --</option>
              {listSinhVien.map((sv) => (
                <option key={sv._id} value={sv._id}>
                  {sv.hoTen} ({sv.maSV})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Chọn Phòng Chỉ Định *
            </label>
            <select
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={formData.phong}
              onChange={(e) =>
                setFormData({ ...formData, phong: e.target.value })
              }
            >
              <option value="">-- Chọn phòng còn chỗ trống --</option>
              {/* Dùng [...listPhong] để copy mảng trước khi sort, tránh làm lỗi state gốc */}
              {[...listPhong]
                .sort((a, b) => {
                  const toaNhaCompare = (a.toaNha || "").localeCompare(
                    b.toaNha || "",
                  );
                  if (toaNhaCompare !== 0) return toaNhaCompare;
                  return (a.maPhong || "").localeCompare(
                    b.maPhong || "",
                    undefined,
                    { numeric: true },
                  );
                })
                .map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.toaNha} - Phòng {p.maPhong} (Còn{" "}
                    {p.loaiPhong?.sucChua - p.soNguoiHienTai} chỗ)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Ngày Bắt Đầu *
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={formData.ngayBatDau}
              onChange={(e) =>
                setFormData({ ...formData, ngayBatDau: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Ngày Kết Thúc *
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={formData.ngayKetThuc}
              onChange={(e) =>
                setFormData({ ...formData, ngayKetThuc: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium text-gray-600"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
            >
              {submitting ? "Đang xử lý..." : "Lưu Hợp Đồng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaoHopDongModal;
