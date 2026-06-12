import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { yeuCauApi } from "../../services/yeuCauApi";
import { FaUserCog, FaTimes, FaTools } from "react-icons/fa";

const XuLyYeuCauModal = ({
  isOpen,
  onClose,
  onSuccess,
  yeuCau,
  userRole,
  danhSachTho,
}) => {
  const [formData, setFormData] = useState({
    trangThai: "Đang xử lý",
    ghiChuXuLy: "",
    nhanVienXuLy: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (yeuCau) {
      setFormData({
        trangThai:
          yeuCau.trangThai === "Chờ xử lý" ? "Đang xử lý" : yeuCau.trangThai,
        ghiChuXuLy: yeuCau.ghiChuXuLy || "",
        nhanVienXuLy: yeuCau.nhanVienXuLy?._id || "",
      });
    }
  }, [yeuCau, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await yeuCauApi.updateStatus(yeuCau._id, formData);
      toast.success("Đã cập nhật trạng thái xử lý!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi xử lý yêu cầu!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !yeuCau) return null;

  const isAdminOrManager = ["SUPER_ADMIN", "MANAGER"].includes(userRole);
  const isTechRequest = yeuCau.nhomYeuCau === "Kỹ thuật";

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div
          className={`px-6 py-4 font-bold text-lg flex justify-between items-center ${userRole === "TECHNICIAN" ? "bg-slate-900 text-white" : "bg-blue-700 text-white"}`}
        >
          <span className="flex items-center gap-2">
            <FaUserCog
              className={userRole === "TECHNICIAN" ? "text-orange-500" : ""}
            />{" "}
            Tiếp Nhận & Xử Lý Yêu Cầu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {/* TÓM TẮT ĐƠN */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
            <p>
              <span className="font-bold text-slate-500">Mã đơn:</span>{" "}
              <span className="font-bold text-slate-800">{yeuCau.maYC}</span>
            </p>
            <p>
              <span className="font-bold text-slate-500">Người gửi:</span>{" "}
              <span className="font-bold text-blue-700">
                {yeuCau.sinhVien?.hoTen ||
                  yeuCau.sinhVien?.fullName ||
                  "Không rõ"}{" "}
                - {yeuCau.sinhVien?.maSV || yeuCau.sinhVien?.mssv}
              </span>
            </p>
            <p>
              <span className="font-bold text-slate-500">
                {yeuCau.phong ? "Phòng sự cố:" : "Phòng hiện tại:"}
              </span>{" "}
              {yeuCau.phong || yeuCau.sinhVien?.phong ? (
                <span className="font-bold text-slate-800">
                  P.{(yeuCau.phong || yeuCau.sinhVien?.phong).maPhong} (Tòa{" "}
                  {(yeuCau.phong || yeuCau.sinhVien?.phong).toaNha})
                </span>
              ) : (
                <span className="italic text-gray-500">Chưa xếp phòng</span>
              )}
            </p>
            <p>
              <span className="font-bold text-slate-500">Tiêu đề:</span>{" "}
              <span className="font-bold">{yeuCau.tieuDe}</span>
            </p>
            <div className="pt-2 border-t border-slate-200 mt-2">
              <span className="font-bold text-slate-500 block mb-1">
                Chi tiết sự cố:
              </span>
              <p className="italic text-slate-700 whitespace-pre-wrap">
                {yeuCau.noiDung}
              </p>
            </div>
          </div>

          {/* CHỈ ĐỊNH THỢ */}
          {isAdminOrManager && isTechRequest && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <label className="block text-xs font-bold uppercase text-orange-800 mb-2 flex items-center gap-2">
                <FaTools /> Phân Công Kỹ Thuật Viên
              </label>
              <select
                className="w-full border p-2.5 rounded-lg outline-none focus:border-orange-500 bg-white"
                value={formData.nhanVienXuLy}
                onChange={(e) =>
                  setFormData({ ...formData, nhanVienXuLy: e.target.value })
                }
              >
                <option value="">-- Chưa phân công / Tự nhận việc --</option>

                {/*  Thêm .filter để chỉ lấy thợ kỹ thuật */}
                {danhSachTho
                  ?.filter(
                    (tho) =>
                      tho.role === "TECHNICIAN" || tho.role === "technician",
                  )
                  .map((tho) => (
                    <option key={tho._id} value={tho._id}>
                      {tho.fullName} (Thợ Kỹ Thuật)
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* CẬP NHẬT TRẠNG THÁI */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Cập nhật trạng thái *
            </label>
            <select
              className={`w-full border-2 p-2.5 rounded-lg outline-none font-bold ${userRole === "TECHNICIAN" ? "focus:border-orange-500" : "focus:border-blue-500"}`}
              value={formData.trangThai}
              onChange={(e) =>
                setFormData({ ...formData, trangThai: e.target.value })
              }
            >
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đang xử lý">⏳ Đang tiếp nhận / Đang xử lý</option>
              <option value="Hoàn thành">✅ Đã hoàn thành / Xong</option>
              <option value="Đã hủy">❌ Từ chối / Hủy</option>
            </select>
          </div>

          {/* GHI CHÚ */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Ghi chú / Kết quả xử lý
            </label>
            <textarea
              className={`w-full border-2 p-3 rounded-lg outline-none h-24 ${userRole === "TECHNICIAN" ? "focus:border-orange-500" : "focus:border-blue-500"}`}
              placeholder="Nhập phản hồi cho sinh viên (VD: Đã thay bóng đèn mới, Đã duyệt gia hạn...)"
              value={formData.ghiChuXuLy}
              onChange={(e) =>
                setFormData({ ...formData, ghiChuXuLy: e.target.value })
              }
            />
          </div>
          {/* HIỂN THỊ ĐÁNH GIÁ CỦA SINH VIÊN (Chỉ hiện khi đơn đã hoàn thành và có điểm) */}
          {yeuCau.trangThai === "Hoàn thành" && yeuCau.danhGia > 0 && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-4 mt-4">
              <label className="block text-xs font-bold uppercase text-yellow-800 mb-2">
                ⭐ Đánh Giá Từ Sinh Viên
              </label>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${star <= yeuCau.danhGia ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 font-bold text-yellow-700">
                  {yeuCau.danhGia} / 5
                </span>
              </div>
              {yeuCau.binhLuan && (
                <p className="text-sm text-yellow-900 italic">
                  "{yeuCau.binhLuan}"
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-slate-700 rounded-lg font-bold hover:bg-gray-300"
          >
            Đóng
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className={`px-5 py-2.5 text-white rounded-lg font-bold shadow-sm ${userRole === "TECHNICIAN" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isProcessing ? "Đang lưu..." : "Xác Nhận Xử Lý"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default XuLyYeuCauModal;
