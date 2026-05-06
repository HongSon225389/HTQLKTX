import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaTools,
  FaHome,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaBolt,
  FaTint,
  FaBed,
} from "react-icons/fa";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as LineTooltip,
  Legend as LineLegend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    tongSinhVien: 0,
    thietBiHong: 0,
    choConTrong: 0,
    phongNoTien: 0,
    tongPhong: 0,
    phongDaDay: 0,
    chiTietDoanhThu: { tong: 0, dien: 0, nuoc: 0, phong: 0 },
  });
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resChart] = await Promise.all([
          axios.get("http://localhost:5000/api/thong-ke/dashboard", config),
          axios.get("http://localhost:5000/api/thong-ke/bieu-do", config),
        ]);

        setStats(resStats.data);
        setChartData(resChart.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Dashboard:", error);
      }
    };
    fetchData();
  }, []);

  const formatTien = (tien) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(tien);
  };

  const hoatDongCards = [
    {
      title: "Tổng sinh viên",
      value: stats.tongSinhVien,
      bgColor: "bg-[#2b78c5]",
      icon: (
        <FaUserGraduate className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
    {
      title: "Thiết bị cần sửa",
      value: stats.thietBiHong,
      bgColor: "bg-[#f39c12]",
      icon: (
        <FaTools className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
    {
      title: "Chỗ còn trống",
      value: stats.choConTrong,
      bgColor: "bg-[#27ae60]",
      icon: (
        <FaHome className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
    {
      title: "Phòng nợ tiền",
      value: stats.phongNoTien,
      bgColor: "bg-[#e74c3c]",
      icon: (
        <FaFileInvoiceDollar className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
  ];

  const doanhThuCards = [
    {
      title: "TỔNG DOANH THU",
      value: formatTien(stats.chiTietDoanhThu.tong),
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-700",
      icon: (
        <FaMoneyBillWave className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
    {
      title: "DOANH THU PHÒNG",
      value: formatTien(stats.chiTietDoanhThu.phong),
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      icon: <FaBed className="text-5xl opacity-30 absolute bottom-4 right-4" />,
    },
    {
      title: "DOANH THU ĐIỆN",
      value: formatTien(stats.chiTietDoanhThu.dien),
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      icon: (
        <FaBolt className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
    {
      title: "DOANH THU NƯỚC",
      value: formatTien(stats.chiTietDoanhThu.nuoc),
      bgColor: "bg-gradient-to-br from-cyan-400 to-blue-500",
      icon: (
        <FaTint className="text-5xl opacity-30 absolute bottom-4 right-4" />
      ),
    },
  ];

  const phongDangO =
    (stats.tongPhong || 0) - (stats.choConTrong || 0) - (stats.phongDaDay || 0);
  const pieData = [
    { name: "Đã đầy", value: stats.phongDaDay || 0 },
    { name: "Còn trống", value: stats.choConTrong || 0 },
    { name: "Đang ở", value: phongDangO > 0 ? phongDangO : 0 },
  ];
  const PIE_COLORS = ["#e74c3c", "#27ae60", "#2b78c5"];

  return (
    <div className="w-full pb-10">
      {/* SECTION 1: BÁO CÁO DOANH THU CHI TIẾT */}
      <h2 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-wide px-2 border-l-4 border-green-500">
        Báo cáo Doanh Thu (Đã thu)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {doanhThuCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} text-white p-6 shadow-lg relative overflow-hidden flex flex-col justify-between h-32 rounded-2xl transform hover:-translate-y-1 transition-all`}
          >
            <div className="z-10">
              <h3 className="text-xs font-bold tracking-widest uppercase opacity-90">
                {stat.title}
              </h3>
            </div>
            <div className="z-10">
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      {/* SECTION 2: TÌNH HÌNH HOẠT ĐỘNG KTX */}
      <h2 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-wide px-2 border-l-4 border-blue-500">
        Tình hình hoạt động KTX
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {hoatDongCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} text-white p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-32 rounded-2xl`}
          >
            <div className="z-10">
              <h3 className="text-xs font-semibold tracking-wide uppercase opacity-80">
                {stat.title}
              </h3>
            </div>
            <div className="z-10">
              <p className="text-4xl font-black">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      {/* SECTION 3: KHU VỰC BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
          <h3 className="text-center text-gray-800 font-black mb-6 uppercase italic">
            Tỷ lệ lấp đầy Phòng KTX
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <PieTooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [`${value} phòng`]}
                />
                <PieLegend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ vùng */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
          <h3 className="text-center text-gray-800 font-black mb-6 uppercase italic">
            Biến động tiêu thụ - 6 tháng gần nhất
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorDien" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f39c12" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f39c12" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNuoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#f39c12", fontSize: 12, fontWeight: "bold" }}
                  label={{
                    value: "kWh",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#f39c12",
                    fontSize: 10,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#3498db", fontSize: 12, fontWeight: "bold" }}
                  label={{
                    value: "m³",
                    angle: 90,
                    position: "insideRight",
                    fill: "#3498db",
                    fontSize: 10,
                  }}
                />
                <LineTooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <LineLegend verticalAlign="top" height={36} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="dien"
                  stroke="#f39c12"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDien)"
                  name="Điện (kWh)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="nuoc"
                  stroke="#3498db"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNuoc)"
                  name="Nước (m³)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
