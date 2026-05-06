import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaTools,
  FaHome,
  FaFileInvoiceDollar,
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

  const statCards = [
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
      title: "Phòng nợ điện nước",
      value: stats.phongNoTien,
      bgColor: "bg-[#e74c3c]",
      icon: (
        <FaFileInvoiceDollar className="text-5xl opacity-30 absolute bottom-4 right-4" />
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
    <div className="w-full">
      {/* 4 Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} text-white p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-36 rounded-2xl`}
          >
            <div className="z-10">
              <h3 className="text-sm font-semibold tracking-wide uppercase opacity-80">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn - Tỷ lệ lấp đầy */}
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

        {/* Biểu đồ vùng (AreaChart) - Tiêu thụ thật */}
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

                {/* TRỤC Y BÊN TRÁI CHO ĐIỆN */}
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

                {/* TRỤC Y BÊN PHẢI CHO NƯỚC */}
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

                {/* AREA ĐIỆN DÙNG TRỤC TRÁI */}
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

                {/* AREA NƯỚC DÙNG TRỤC PHẢI */}
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
