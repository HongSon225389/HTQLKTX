import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { thongKeApi } from "../../services/thongKeApi";
import {
  FaCoins,
  FaFileInvoiceDollar,
  FaDoorClosed,
  FaBed,
  FaBoxes,
  FaExclamationTriangle,
  FaWrench,
  FaFileSignature,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TongQuan = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await thongKeApi.getTongQuan();
      if (res.success) setDashboardData(res.data);
    } catch (e) {
      toast.error("Lỗi đồng bộ dữ liệu tổng quan hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  const { cards, charts, hopDongSapHetHan } = dashboardData;

  return (
    <div className="p-1 space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Tổng Quan Hệ Thống</h2>

      {/* 📊 KHU VỰC LƯỚI 8 THỂ THỐNG KÊ (HÀNG 4 x 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Thẻ 1: Tổng Doanh Thu */}
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              Tổng Doanh Thu
            </p>
            <h3 className="text-2xl font-black text-blue-900">
              {(cards.tongDoanhThu || 0).toLocaleString("vi-VN")}{" "}
              <span className="text-sm font-normal">đ</span>
            </h3>
          </div>
          <div className="bg-blue-200 text-blue-600 p-3 rounded-xl">
            <FaCoins size={22} />
          </div>
        </div>

        {/* Thẻ 2: Hóa Đơn Chưa Thu */}
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
              Hóa Đơn Chưa Thu
            </p>
            <h3 className="text-2xl font-black text-rose-900">
              {cards.soDonChuaThu || 0}{" "}
              <span className="text-sm font-medium">đơn</span>
            </h3>
            <p className="text-xs text-rose-500 font-bold mt-1 bg-rose-100 px-2 py-0.5 rounded-md inline-block">
              (Nợ: {(cards.tongTienNo || 0).toLocaleString("vi-VN")} đ)
            </p>
          </div>
          <div className="bg-rose-200 text-rose-600 p-3 rounded-xl">
            <FaFileInvoiceDollar size={22} />
          </div>
        </div>

        {/* Thẻ 3: Phòng Đang Trống */}
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              Phòng Đang Trống
            </p>
            <h3 className="text-2xl font-black text-emerald-900">
              {cards.phongDangTrong || 0}{" "}
              <span className="text-sm font-medium">phòng</span>
            </h3>
          </div>
          <div className="bg-emerald-200 text-emerald-600 p-3 rounded-xl">
            <FaDoorClosed size={22} />
          </div>
        </div>

        {/* Thẻ 4: Số Chỗ Trống */}
        <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
              Số Chỗ Trống
            </p>
            <h3 className="text-2xl font-black text-teal-900">
              {cards.soChoTrong || 0}{" "}
              <span className="text-sm font-medium">giường</span>
            </h3>
          </div>
          <div className="bg-teal-200 text-teal-600 p-3 rounded-xl">
            <FaBed size={22} />
          </div>
        </div>

        {/* Thẻ 5: Tổng Thiết Bị Tài Sản */}
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              Tổng Số Thiết Bị
            </p>
            <h3 className="text-2xl font-black text-indigo-900">
              {cards.tongSoThietBi || 0}{" "}
              <span className="text-sm font-medium">mặt hàng</span>
            </h3>
          </div>
          <div className="bg-indigo-200 text-indigo-600 p-3 rounded-xl">
            <FaBoxes size={22} />
          </div>
        </div>

        {/* Thẻ 6: Số Thiết Bị Hư Hỏng */}
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              Thiết Bị Hư Hỏng
            </p>
            <h3 className="text-2xl font-black text-amber-900">
              {cards.thietBiHuHong || 0}{" "}
              <span className="text-sm font-medium">thiết bị</span>
            </h3>
          </div>
          <div className="bg-amber-200 text-amber-600 p-3 rounded-xl">
            <FaExclamationTriangle size={22} />
          </div>
        </div>

        {/* Thẻ 7: Yêu Cầu Chờ Xử Lý */}
        <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sky-600 font-bold text-xs uppercase tracking-wider mb-1">
              Sự Cố Chờ Sửa
            </p>
            <h3 className="text-2xl font-black text-sky-900">
              {cards.yeuCauChoXuLy || 0}{" "}
              <span className="text-sm font-medium">đơn</span>
            </h3>
          </div>
          <div className="bg-sky-200 text-sky-600 p-3 rounded-xl">
            <FaWrench size={22} />
          </div>
        </div>

        {/* Thẻ 8: Yêu Cầu Duyệt Đơn */}
        <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
              Đơn Hành Chính Chờ
            </p>
            <h3 className="text-2xl font-black text-purple-900">
              {cards.yeuCauChoDuyet || 0}{" "}
              <span className="text-sm font-medium">đơn</span>
            </h3>
          </div>
          <div className="bg-purple-200 text-purple-600 p-3 rounded-xl">
            <FaFileSignature size={22} />
          </div>
        </div>
      </div>

      {/* 📉 KHU VỰC BIỂU ĐỒ VÀ BẢNG PHỤ CẢNH BÁO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI (Bao gồm 2 loại biểu đồ chiếm 2/3 không gian) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biểu đồ Doanh thu 6 tháng */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">
              Thống kê doanh thu 6 tháng gần đây
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.doanhThu}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(value) =>
                      value >= 1000000 ? `${value / 1000000}Tr` : value
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()} đ`,
                      "Doanh thu",
                    ]}
                  />
                  <Bar
                    dataKey="Doanh thu"
                    fill="#3b82f6"
                    barSize={35}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ tiêu thụ Điện Nước */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">
              Xu hướng tiêu thụ điện & nước (6 tháng)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.dienNuoc}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(value) =>
                      value >= 1000 ? `${value / 1000}K` : value
                    }
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Điện (kWh)"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Nước (m³)"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 🚨 CỘT PHẢI: BẢNG CẢNH BÁO HỢP ĐỒNG HẾT HẠN (<15 NGÀY) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-sm font-bold text-red-600 uppercase mb-4 tracking-wider flex items-center gap-2">
            <FaClock className="animate-pulse" /> Hợp đồng sắp hết hạn (&lt; 15
            ngày)
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {hopDongSapHetHan?.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center py-10">
                Không có hợp đồng nào sắp hết hạn.
              </p>
            ) : (
              hopDongSapHetHan?.map((hd) => {
                const conLai = Math.ceil(
                  (new Date(hd.ngayKetThuc) - new Date()) /
                    (1000 * 60 * 60 * 24),
                );

                return (
                  <div
                    key={hd._id}
                    className="border-l-4 border-red-500 bg-red-50/50 p-3 rounded-r-xl space-y-1 transition-colors hover:bg-red-50"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-black text-slate-800">
                        {hd.sinhVien?.hoTen}
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
                        P.{hd.phong?.maPhong}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>MSSV: {hd.sinhVien?.maSV}</span>
                      <span className="text-red-600 font-bold">
                        {conLai < 0
                          ? `Đã quá hạn ${Math.abs(conLai)} ngày`
                          : `Còn ${conLai} ngày`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongQuan;
