import React, { useState, useEffect } from "react";
import {
  FaFileSignature,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { hopDongApi } from "../../services/hopDongApi"; // Sửa lại đường dẫn nếu cần
import { toast } from "react-toastify";

const ThongTinHopDong = () => {
  const [hopDong, setHopDong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHopDong = async () => {
      try {
        const res = await hopDongApi.getMyHopDong(); // Gọi API getMyHopDong
        if (res.success && res.data) {
          setHopDong(res.data);
        }
      } catch (error) {
        // 1. In thẳng lỗi đỏ ra màn hình Console để chúng ta đọc
        console.error("LỖI CHÍNH XÁC LÀ:", error);

        // 2. Hiện trực tiếp tên lỗi lên cái thông báo Toast
        if (error.response?.status !== 404) {
          toast.error(`Chi tiết lỗi: ${error.message || "Lỗi không xác định"}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHopDong();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-teal-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <FaFileSignature className="text-teal-600" /> Thông Tin Hợp Đồng Lưu Trú
      </h2>

      {!hopDong ? (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center h-64">
          <FaInfoCircle className="text-4xl mb-3 text-orange-400" />
          <h3 className="text-lg font-bold mb-1">Chưa có hợp đồng lưu trú</h3>
          <p className="text-sm">
            Bạn hiện không có hợp đồng nào đang có hiệu lực trong hệ thống.
          </p>
          <p className="text-sm">
            Vui lòng liên hệ Ban quản lý Ký túc xá để được hướng dẫn xếp phòng.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-teal-600 px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h3 className="text-lg font-bold">Chi Tiết Hợp Đồng</h3>
              <p className="text-teal-100 text-sm">Mã HĐ: {hopDong.maHD}</p>
            </div>
            <span className="bg-white text-teal-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase shadow-sm">
              {hopDong.trangThai}
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cột 1: Thông tin phòng */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> Địa điểm lưu trú
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-semibold text-gray-800 text-lg mb-1">
                      Phòng {hopDong.phong?.maPhong}
                    </p>
                    <p className="text-sm text-gray-600">
                      Khu vực: {hopDong.phong?.toaNha}
                    </p>
                    <p className="text-sm text-gray-600">
                      Loại: {hopDong.phong?.loaiPhong?.tenLoaiPhong}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FaMoneyBillWave /> Tài chính
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      Tiền cọc đã thu:
                    </span>
                    <span className="font-bold text-lg text-gray-800">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(hopDong.tienCoc)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột 2: Thời hạn */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaCalendarAlt /> Thời hạn hợp đồng
                </h4>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase">
                        Ngày bắt đầu
                      </p>
                      <p className="font-semibold text-gray-800 text-lg">
                        {new Date(hopDong.ngayBatDau).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-red-500 font-bold uppercase">
                        Ngày hết hạn (Dự kiến)
                      </p>
                      <p className="font-semibold text-red-600 text-lg">
                        {new Date(hopDong.ngayKetThuc).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Icon mờ làm background */}
                  <FaCalendarAlt className="absolute -bottom-4 -right-4 text-8xl text-blue-100 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThongTinHopDong;
