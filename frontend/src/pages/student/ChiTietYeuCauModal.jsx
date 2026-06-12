import React, { useState } from "react";
import { FaStar, FaCheckCircle, FaTimes } from "react-icons/fa";

const ChiTietYeuCauModal = ({
  isOpen,
  onClose,
  yeuCau,
  onSubmitRating,
  userRole = "STUDENT",
}) => {
  const [rating, setRating] = useState(5);

  if (!isOpen || !yeuCau) return null;

  const handleRate = (e) => {
    e.preventDefault();
    if (onSubmitRating) {
      onSubmitRating(yeuCau._id, rating);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-slate-800 text-white px-6 py-4 font-bold text-lg flex justify-between items-center shrink-0">
          <span>Chi Tiết Yêu Cầu #{yeuCau.maYC}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] custom-scrollbar flex-1">
          {/* THÔNG TIN NGƯỜI GỬI & PHÒNG */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2 text-sm">
            <div className="flex justify-between border-b border-blue-200 pb-2">
              <span className="font-bold text-slate-500 uppercase text-xs">
                Người gửi
              </span>
              <span className="font-bold text-blue-800">
                {yeuCau.sinhVien?.hoTen ||
                  yeuCau.sinhVien?.fullName ||
                  "Không rõ"}{" "}
                - {yeuCau.sinhVien?.maSV || yeuCau.sinhVien?.mssv}
              </span>
            </div>

            {/* LOGIC ĐỒNG BỘ HIỂN THỊ PHÒNG THÔNG MINH */}
            {(() => {
              const displayRoom = yeuCau.phong || yeuCau.sinhVien?.phong;
              if (displayRoom) {
                return (
                  <div className="flex justify-between pt-1 items-center">
                    <span className="font-bold text-slate-500 uppercase text-xs">
                      {yeuCau.phong ? "Phòng sự cố" : "Phòng hiện tại"}
                    </span>
                    <span className="font-bold text-slate-800">
                      P.{displayRoom.maPhong} (Tòa {displayRoom.toaNha})
                    </span>
                  </div>
                );
              } else {
                return (
                  <div className="flex justify-between pt-1 items-center">
                    <span className="font-bold text-slate-500 uppercase text-xs">
                      Phòng
                    </span>
                    <span className="italic text-gray-500 text-sm">
                      Chưa xếp phòng
                    </span>
                  </div>
                );
              }
            })()}
          </div>

          {/* CHI TIẾT NỘI DUNG ĐƠN */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div>
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">
                Mảng / Phân loại
              </span>
              <span className="text-sm font-medium text-slate-700 bg-white border px-2 py-1 rounded">
                {yeuCau.nhomYeuCau} - {yeuCau.loaiYeuCau}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">
                Tiêu đề
              </span>
              <p className="font-bold text-slate-800">{yeuCau.tieuDe}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">
                Mô tả chi tiết
              </span>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {yeuCau.noiDung}
              </p>
            </div>
            {yeuCau.nhanVienXuLy && (
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">
                  Nhân viên tiếp nhận
                </span>
                <p className="text-sm font-medium text-teal-700">
                  {yeuCau.nhanVienXuLy.fullName}
                </p>
              </div>
            )}
          </div>

          {/* PHẢN HỒI BAN QUẢN LÝ */}
          <div className="border-t border-gray-200 pt-4">
            <span className="text-xs text-gray-500 uppercase font-bold block mb-2">
              Phản hồi từ Ban Quản Lý / Kỹ thuật
            </span>
            {yeuCau.ghiChuXuLy ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-800 font-medium whitespace-pre-wrap">
                {yeuCau.ghiChuXuLy}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Hệ thống đang xử lý, chưa có phản hồi.
              </p>
            )}
          </div>

          {/* FORM ĐÁNH GIÁ SAO (Chỉ hiện khi đơn đã HOÀN THÀNH, chưa đánh giá VÀ PHẢI LÀ SINH VIÊN) */}
          {userRole === "STUDENT" &&
            yeuCau.trangThai === "Hoàn thành" &&
            !yeuCau.danhGia && (
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                  <p className="text-sm font-bold text-amber-800 mb-3">
                    Yêu cầu đã hoàn thành. Vui lòng đánh giá chất lượng dịch vụ!
                  </p>
                  <form
                    onSubmit={handleRate}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="mt-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm"
                    >
                      Gửi Đánh Giá
                    </button>
                  </form>
                </div>
              </div>
            )}

          {/* HIỂN THỊ SAO ĐÃ ĐÁNH GIÁ */}
          {yeuCau.danhGia && (
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between bg-green-50 p-3 rounded-lg mt-2">
              <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                <FaCheckCircle />{" "}
                {userRole === "STUDENT"
                  ? "Bạn đã đánh giá:"
                  : "Đánh giá của SV:"}
              </span>
              <div className="flex text-amber-400 gap-1">
                {[...Array(yeuCau.danhGia)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietYeuCauModal;
