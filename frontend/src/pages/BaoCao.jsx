// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   FaChartPie,
//   FaUsers,
//   FaMoneyBillWave,
//   FaFileInvoiceDollar,
//   FaTools,
//   FaBed,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaTrashAlt,
//   FaBox,
// } from "react-icons/fa";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// export default function BaoCao() {
//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");
//   const config = { headers: { Authorization: `Bearer ${token}` } };

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!token) return navigate("/login");
//       try {
//         const [resDash, resChart] = await Promise.all([
//           axios.get("http://localhost:5000/api/thong-ke/dashboard", config),
//           axios.get("http://localhost:5000/api/thong-ke/bieu-do", config),
//         ]);
//         setDashboardData(resDash.data);
//         setChartData(resChart.data);
//       } catch (error) {
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token");
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   if (loading || !dashboardData) {
//     return (
//       <div className="p-20 text-center font-black text-blue-500 animate-pulse uppercase tracking-widest">
//         Đang tổng hợp dữ liệu...
//       </div>
//     );
//   }

//   const phongDangO =
//     dashboardData.tongPhong -
//     dashboardData.choConTrong -
//     dashboardData.phongDaDay;
//   const pieData = [
//     { name: "Đã đầy", value: dashboardData.phongDaDay, color: "#ef4444" },
//     { name: "Còn trống", value: dashboardData.choConTrong, color: "#22c55e" },
//     {
//       name: "Đang ở",
//       value: phongDangO > 0 ? phongDangO : 0,
//       color: "#3b82f6",
//     },
//   ];

//   const StatCard = ({ icon, title, value, subtext, colorClass, bgClass }) => (
//     <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 flex items-center gap-6 hover:-translate-y-1 transition-transform duration-300">
//       <div
//         className={`w-16 h-16 min-w-[4rem] rounded-2xl flex items-center justify-center text-2xl ${bgClass} ${colorClass} shadow-inner`}
//       >
//         {icon}
//       </div>
//       <div>
//         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
//           {title}
//         </p>
//         <h3 className={`text-2xl font-black ${colorClass}`}>{value}</h3>
//         {subtext && (
//           <p className="text-xs font-bold text-gray-400 mt-1">{subtext}</p>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full pb-10 px-4">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3 italic">
//             <FaChartPie className="text-blue-600" /> BÁO CÁO HOẠT ĐỘNG
//           </h2>
//           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
//             Tổng quan dữ liệu Ký túc xá
//           </p>
//         </div>
//       </div>

//       {/* DÒNG 1: TỔNG QUAN CHÍNH (Thu nhập, Sinh viên, Nợ, Trống) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           icon={<FaMoneyBillWave />}
//           title="Thu nhập Admin"
//           value={`${dashboardData.tongDoanhThu.toLocaleString("vi-VN")} đ`}
//           subtext="Đã thanh toán"
//           colorClass="text-green-600"
//           bgClass="bg-green-100"
//         />
//         <StatCard
//           icon={<FaUsers />}
//           title="Sinh viên"
//           value={dashboardData.tongSinhVien}
//           subtext="Đang lưu trú"
//           colorClass="text-blue-600"
//           bgClass="bg-blue-50"
//         />
//         <StatCard
//           icon={<FaFileInvoiceDollar />}
//           title="Phòng nợ tiền"
//           value={dashboardData.phongNoTien}
//           subtext="Hóa đơn chưa thu"
//           colorClass="text-red-500"
//           bgClass="bg-red-50"
//         />
//         <StatCard
//           icon={<FaBed />}
//           title="Phòng trống"
//           value={dashboardData.choConTrong}
//           subtext="Sẵn sàng cho thuê"
//           colorClass="text-emerald-500"
//           bgClass="bg-emerald-50"
//         />
//       </div>

//       {/* DÒNG 2: PHÂN CẤP VẬT TƯ THIẾT BỊ */}
//       <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
//         <FaBox className="text-gray-400" /> Tình trạng cơ sở vật chất
//       </h3>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <StatCard
//           icon={<FaCheckCircle />}
//           title="Sử dụng tốt"
//           value={dashboardData.chiTietVatTu.tot}
//           colorClass="text-green-500"
//           bgClass="bg-green-50"
//         />
//         <StatCard
//           icon={<FaExclamationTriangle />}
//           title="Hư hỏng"
//           value={dashboardData.chiTietVatTu.hong}
//           colorClass="text-red-500"
//           bgClass="bg-red-50"
//         />
//         <StatCard
//           icon={<FaTools />}
//           title="Đang sửa chữa"
//           value={dashboardData.chiTietVatTu.dangSua}
//           colorClass="text-orange-500"
//           bgClass="bg-orange-50"
//         />
//         <StatCard
//           icon={<FaTrashAlt />}
//           title="Đã thanh lý"
//           value={dashboardData.chiTietVatTu.thanhLy}
//           colorClass="text-gray-500"
//           bgClass="bg-gray-100"
//         />
//       </div>

//       {/* DÒNG 3: BIỂU ĐỒ */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* BIỂU ĐỒ CỘT: ĐIỆN NƯỚC */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
//           <h3 className="text-lg font-black text-gray-700 uppercase tracking-widest mb-6">
//             Mức sử dụng Điện / Nước (6 kỳ gần nhất)
//           </h3>
//           <div className="h-80 w-full">
//             {chartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#f3f4f6"
//                   />
//                   <XAxis
//                     dataKey="name"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 12, fontWeight: "bold", fill: "#9ca3af" }}
//                     dy={10}
//                   />
//                   <YAxis
//                     yAxisId="left"
//                     orientation="left"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 12, fontWeight: "bold", fill: "#9ca3af" }}
//                   />
//                   <YAxis
//                     yAxisId="right"
//                     orientation="right"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 12, fontWeight: "bold", fill: "#9ca3af" }}
//                   />
//                   <Tooltip
//                     cursor={{ fill: "#f3f4f6" }}
//                     contentStyle={{
//                       borderRadius: "1rem",
//                       border: "none",
//                       boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
//                     }}
//                   />
//                   <Legend
//                     wrapperStyle={{
//                       paddingTop: "20px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                     }}
//                   />
//                   <Bar
//                     yAxisId="left"
//                     name="Điện (kWh)"
//                     dataKey="dien"
//                     fill="#facc15"
//                     radius={[4, 4, 0, 0]}
//                     barSize={30}
//                   />
//                   <Bar
//                     yAxisId="right"
//                     name="Nước (Khối)"
//                     dataKey="nuoc"
//                     fill="#3b82f6"
//                     radius={[4, 4, 0, 0]}
//                     barSize={30}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest">
//                 Chưa có dữ liệu chốt điện nước
//               </div>
//             )}
//           </div>
//         </div>

//         {/* BIỂU ĐỒ TRÒN: TÌNH TRẠNG PHÒNG */}
//         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center">
//           <h3 className="text-lg font-black text-gray-700 uppercase tracking-widest mb-2 self-start">
//             Tỉ lệ lấp đầy phòng
//           </h3>
//           <div className="h-64 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "1rem",
//                     border: "none",
//                     boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="flex flex-col gap-3 w-full mt-4">
//             {pieData.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase"
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: item.color }}
//                   ></div>
//                   {item.name}
//                 </div>
//                 <span>{item.value} phòng</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
    chiTietDoanhThu: { tong: 0, dien: 0, nuoc: 0, phong: 0 }, // Khởi tạo State Doanh Thu
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

  // Format tiền tệ VNĐ
  const formatTien = (tien) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(tien);
  };

  // Mảng chứa Card Hoạt động KTX
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

  // Mảng chứa Card Doanh Thu
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
