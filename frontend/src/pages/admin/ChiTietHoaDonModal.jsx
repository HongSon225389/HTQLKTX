import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaPrint,
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { hoaDonApi } from "../../services/hoaDonApi";

const ChiTietHoaDonModal = ({ isOpen, onClose, hoaDonId }) => {
  const [data, setData] = useState(null);
  const [chiTietTinh, setChiTietTinh] = useState(null); // State lưu đơn giá và sĩ số phòng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && hoaDonId) {
      fetchChiTiet();
    }
  }, [isOpen, hoaDonId]);

  const fetchChiTiet = async () => {
    setLoading(true);
    try {
      const res = await hoaDonApi.getById(hoaDonId);
      if (res.success) {
        setData(res.data);
        setChiTietTinh(res.chiTietTinhToan);
      }
    } catch (error) {
      toast.error("Không thể tải chi tiết hóa đơn!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  // Tính toán các thông số phục vụ việc hiển thị công thức rõ ràng
  const dienCu = data?.chiSoDienNuoc?.soDienCu || 0;
  const dienMoi = data?.chiSoDienNuoc?.soDienMoi || 0;
  const nuocCu = data?.chiSoDienNuoc?.soNuocCu || 0;
  const nuocMoi = data?.chiSoDienNuoc?.soNuocMoi || 0;

  const kwhTieuThu = dienMoi - dienCu;
  const m3TieuThu = nuocMoi - nuocCu;

  const giaDien = chiTietTinh?.donGiaDien || 3500;
  const giaNuoc = chiTietTinh?.donGiaNuoc || 25000;
  const soNguoiTrongPhong = chiTietTinh?.soNguoiChiaDeu || 1;

  const tongTienDienCaPhong = kwhTieuThu * giaDien;
  const tongTienNuocCaPhong = m3TieuThu * giaNuoc;
  const tongDienNuocCuaCaPhong = tongTienDienCaPhong + tongTienNuocCaPhong;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm print:bg-white print:fixed print:inset-0 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all print:shadow-none print:w-full print:max-w-full print:max-h-full print:block">
        {/* Header Modal - Cố định không cuộn */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white shrink-0 print:hidden">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaFileInvoice /> Chi Tiết Hóa Đơn & Minh Bạch Số Liệu
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 flex-1 flex flex-col justify-center">
            Đang tải dữ liệu biên lai...
          </div>
        ) : !data ? (
          <div className="p-10 text-center text-red-500 flex-1 flex flex-col justify-center">
            Dữ liệu không tồn tại!
          </div>
        ) : (
          <div className="p-6 md:p-8 print:p-0 overflow-y-auto flex-1 custom-scrollbar">
            {/* Tiêu đề Biên lai */}
            <div className="text-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wider">
                Ban Quản Lý Ký Túc Xá
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Biên lai chi tiết tiền phòng & dịch vụ hàng tháng
              </p>
              <div className="mt-3 inline-block bg-gray-100 px-4 py-1 rounded-full text-xs font-mono font-bold text-gray-600">
                Mã HĐ: {data.maHoaDon}
              </div>
            </div>

            {/* Thông tin chung */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-500 text-xs">Họ và tên SV:</p>
                <p className="font-bold text-gray-800 uppercase">
                  {data.sinhVien?.hoTen}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Mã SV:</p>
                <p className="font-bold text-gray-800">{data.sinhVien?.maSV}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Phòng - Tòa:</p>
                <p className="font-bold text-gray-800">
                  {data.phong?.maPhong} - {data.phong?.toaNha}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Kỳ thu tiền:</p>
                <p className="font-bold text-gray-800">{data.thangNam}</p>
              </div>
            </div>

            {/* Bảng chi tiết tiền */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-gray-800 text-left">
                  <th className="pb-2 text-gray-600 font-bold">
                    Nội dung khoản thu
                  </th>
                  <th className="pb-2 text-right text-gray-600 font-bold">
                    Thành tiền cá nhân
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* 1. Tiền phòng */}
                <tr>
                  <td className="py-4">
                    <p className="font-bold text-gray-800">
                      1. Tiền phòng (Giá giường cố định)
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      *Tính theo chính sách hợp đồng đầu người
                    </p>
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900">
                    {formatMoney(data.tienPhong)}
                  </td>
                </tr>

                {/* 2. Tiền điện nước minh bạch công thức */}
                <tr>
                  <td className="py-4 pr-4">
                    <p className="font-bold text-gray-800">
                      2. Tiền điện & nước (Chia đều đầu người)
                    </p>
                    <div className="mt-2 text-xs text-gray-600 space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-dashed border-blue-200">
                      <div>
                        <span className="font-medium text-gray-700">
                          ⚡ Tiền điện cả phòng:
                        </span>
                        <div className="text-gray-500 mt-0.5">
                          ({dienMoi} - {dienCu}) kWh × {formatMoney(giaDien)} ={" "}
                          <span className="font-bold text-gray-800">
                            {formatMoney(tongTienDienCaPhong)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">
                          💧 Tiền nước cả phòng:
                        </span>
                        <div className="text-gray-500 mt-0.5">
                          ({nuocMoi} - {nuocCu}) m³ × {formatMoney(giaNuoc)} ={" "}
                          <span className="font-bold text-gray-800">
                            {formatMoney(tongTienNuocCaPhong)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-blue-200/60 pt-1.5 flex justify-between text-gray-800 font-semibold">
                        <span>🏢 Tổng cộng dịch vụ cả phòng:</span>
                        <span className="text-gray-900 font-bold">
                          {formatMoney(tongDienNuocCuaCaPhong)}
                        </span>
                      </div>

                      <div className="text-blue-700 font-medium">
                        ➡️ Chia đều: {formatMoney(tongDienNuocCuaCaPhong)} ÷{" "}
                        {soNguoiTrongPhong} sinh viên ={" "}
                        <span className="font-black text-sm text-blue-600">
                          {formatMoney(data.tienDienNuoc)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900 align-top pt-4">
                    {formatMoney(data.tienDienNuoc)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-800">
                  <td className="pt-3 font-black text-gray-800 text-base uppercase">
                    Tổng cộng cần đóng
                  </td>
                  <td className="pt-3 font-black text-blue-600 text-right text-xl">
                    {formatMoney(data.tongTien)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* TRẠNG THÁI - QR CODE - CHỮ KÝ */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-8 gap-6">
              {/* Cột 1: Trạng thái */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-xs text-gray-500 mb-2">
                  Trạng thái phiếu:
                </span>
                {data.trangThai === "Đã thanh toán" ? (
                  <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs border border-green-200">
                    <FaCheckCircle /> ĐÃ THANH TOÁN
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-xs border border-red-200">
                    <FaTimesCircle /> CHƯA THANH TOÁN
                  </div>
                )}
                {data.ngayThanhToan && (
                  <span className="text-[10px] text-gray-400 mt-1">
                    {new Date(data.ngayThanhToan).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>

              {/* Cột 2: Mã QR Thanh Toán */}
              {data.trangThai === "Chưa thanh toán" &&
                chiTietTinh?.thongTinNganHang && (
                  <div className="flex flex-col items-center border-2 border-dashed border-blue-200 p-2 rounded-xl bg-blue-50/30 print:hidden">
                    <p className="text-[10px] font-bold text-blue-700 mb-1 uppercase tracking-wider">
                      Quét mã để thanh toán
                    </p>
                    <img
                      src={`https://img.vietqr.io/image/${chiTietTinh.thongTinNganHang.bankId}-${chiTietTinh.thongTinNganHang.bankAccount}-compact2.png?amount=${data.tongTien}&addInfo=${data.maHoaDon}&accountName=${chiTietTinh.thongTinNganHang.bankName}`}
                      alt="QR Thanh Toán"
                      className="w-32 h-32 object-contain rounded-lg bg-white p-1"
                    />
                    <p className="text-[9px] text-gray-500 mt-1">
                      Nội dung:{" "}
                      <span className="font-mono font-bold text-gray-700">
                        {data.maHoaDon}
                      </span>
                    </p>
                  </div>
                )}

              {/* Cột 3: Chữ ký */}
              <div className="text-center mt-4 sm:mt-0">
                <p className="text-xs text-gray-500 mb-10">
                  Người xác nhận thu tiền
                </p>
                <p className="font-semibold text-gray-700 text-xs">
                  (Ký và ghi rõ họ tên)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons - Cố định không cuộn */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 shrink-0 border-t border-gray-200 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
          >
            Đóng lại
          </button>
          {!loading && data && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
            >
              <FaPrint /> In Phiếu Biên Lai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChiTietHoaDonModal;
