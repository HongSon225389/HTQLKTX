import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { hopDongApi } from "../../services/hopDongApi";
import { toast } from "react-toastify";

const GiaHanHopDongModal = ({ contract, onClose, onRefresh }) => {
  const [ngayKetThucMoi, setNgayKetThucMoi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGiaHan = async (e) => {
    e.preventDefault();

    if (new Date(ngayKetThucMoi) <= new Date(contract.ngayKetThuc)) {
      toast.warning(
        "Ngày hết hạn mới phải lớn hơn ngày hết hạn cũ của hợp đồng!",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await hopDongApi.giaHan(contract._id, ngayKetThucMoi);
      toast.success(res.message || "Gia hạn hợp đồng lưu trú thành công!");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi gia hạn hợp đồng!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-amber-500 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-md font-bold">📅 Gia Hạn Hợp Đồng</h2>
          <button onClick={onClose} className="hover:text-gray-200">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleGiaHan} className="p-6">
          <div className="mb-4 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
              <span className="font-semibold text-gray-500">Mã Hợp Đồng:</span>{" "}
              {contract?.maHD}
            </div>
            <div className="mt-1">
              <span className="font-semibold text-gray-500">Sinh Viên:</span>{" "}
              {contract?.sinhVien?.hoTen}
            </div>
            <div className="mt-1">
              <span className="font-semibold text-gray-500">
                Ngày Hết Hạn Cũ:
              </span>{" "}
              <span className="text-red-500 font-medium">
                {new Date(contract?.ngayKetThuc).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Chọn Ngày Hết Hạn Mới *
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500"
              value={ngayKetThucMoi}
              onChange={(e) => setNgayKetThucMoi(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
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
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
            >
              {submitting ? "Đang xử lý..." : "Xác Nhận Gia Hạn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiaHanHopDongModal;
