import React from "react";
import { FaTimes, FaBoxOpen } from "react-icons/fa";

const ChiTietTaiSanModal = ({ isOpen, onClose, taiSan }) => {
  if (!isOpen || !taiSan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaBoxOpen className="text-orange-400" /> Hồ Sơ Chi Tiết Tài Sản
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Mã Tài Sản
              </span>
              <span className="col-span-2 font-mono font-bold text-slate-800 bg-gray-100 px-2 py-0.5 rounded w-max">
                {taiSan.maTS}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Tên Thiết Bị
              </span>
              <span className="col-span-2 font-bold text-slate-900">
                {taiSan.tenTS}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Vị Trí Hiện Tại
              </span>
              <span className="col-span-2 font-bold text-blue-600">
                {taiSan.phong?.maPhong
                  ? `Phòng ${taiSan.phong.maPhong} - Tòa ${taiSan.phong.toaNha}`
                  : "Đang lưu trong Kho"}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Số Lượng
              </span>
              <span className="col-span-2 font-medium">
                {taiSan.soLuong} chiếc
              </span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Tình Trạng
              </span>
              <span className="col-span-2 font-bold">{taiSan.tinhTrang}</span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Ngày Mua Về
              </span>
              <span className="col-span-2 text-slate-700">
                {taiSan.ngayMua
                  ? new Date(taiSan.ngayMua).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Ngày Lắp Đặt
              </span>
              <span className="col-span-2 font-medium text-slate-700">
                {!taiSan.phong ? (
                  <span className="italic text-gray-400">
                    Không áp dụng (Hàng trong kho)
                  </span>
                ) : taiSan.ngayLapDat ? (
                  new Date(taiSan.ngayLapDat).toLocaleDateString("vi-VN")
                ) : (
                  "Chưa cập nhật"
                )}
              </span>
            </div>

            <div className="grid grid-cols-3 border-b pb-3 border-gray-100">
              <span className="font-semibold text-gray-500 uppercase text-xs">
                Cập Nhật Cuối
              </span>
              <span className="col-span-2 text-slate-500 italic text-xs">
                {new Date(taiSan.updatedAt).toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="flex flex-col pt-2">
              <span className="font-semibold text-gray-500 uppercase text-xs mb-2">
                Ghi Chú / Bệnh Trạng:
              </span>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[60px] text-gray-700 whitespace-pre-wrap">
                {taiSan.ghiChu || "Không có ghi chú nào."}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietTaiSanModal;
