import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
  FaPrint,
} from "react-icons/fa";

export default function HoaDon() {
  const [danhSachHD, setDanhSachHD] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trangThaiFilter, setTrangThaiFilter] = useState(""); // Rỗng = Tất cả
  const [tuKhoa, setTuKhoa] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // --- 1. Lấy danh sách hóa đơn (có kèm filter trạng thái) ---
  const fetchHoaDon = async () => {
    try {
      setLoading(true);
      // Gọi API theo query bạn đã viết ở Backend
      const res = await axios.get(
        `http://localhost:5000/api/hoadon?trangThai=${trangThaiFilter}`,
        config,
      );
      setDanhSachHD(res.data);
    } catch (e) {
      console.error("Lỗi tải hóa đơn:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoaDon();
  }, [trangThaiFilter]); // Tự động load lại khi bấm chọn lọc trạng thái

  // --- 2. Xác nhận thanh toán ---
  const handleThanhToan = async (id) => {
    if (window.confirm("Xác nhận sinh viên đã nộp đủ tiền cho hóa đơn này?")) {
      try {
        await axios.put(
          `http://localhost:5000/api/hoadon/pay/${id}`,
          {},
          config,
        );
        alert("Xác nhận thanh toán thành công!");
        fetchHoaDon(); // Refresh lại danh sách
      } catch (e) {
        alert("Lỗi khi xử lý thanh toán");
      }
    }
  };

  // Lọc theo từ khóa tìm kiếm (Mã hóa đơn hoặc Tên phòng)
  const filteredData = danhSachHD.filter(
    (hd) =>
      hd.maHD.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      hd.phong?.tenPhong.toLowerCase().includes(tuKhoa.toLowerCase()),
  );

  if (loading)
    return (
      <div className="p-10 text-center font-black text-gray-400 italic">
        ĐANG TRUY XUẤT HÓA ĐƠN...
      </div>
    );

  const handleInHoaDon = (hd) => {
    const printWindow = window.open("", "_blank", "width=850,height=900");

    // Tính toán số lượng tiêu thụ
    const tieuThuDien = hd.dienMoi - hd.dienCu || 0;
    const tieuThuNuoc = hd.nuocMoi - hd.nuocCu || 0;

    const htmlContent = `
    <html>
      <head>
        <title>Phiếu Thu KTX - ${hd.maHD}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; line-height: 1.6; }
          .container { border: 2px solid #2b78c5; padding: 20px; border-radius: 10px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { color: #2b78c5; margin: 0; text-transform: uppercase; }
          .header p { margin: 5px 0; font-size: 14px; }
          
          .title { text-align: center; font-size: 22px; font-weight: bold; margin: 20px 0; border-top: 1px dashed #ccc; padding-top: 10px; }
          
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .info-item { font-size: 15px; }

          .detail-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .detail-table th { background: #f8f9fa; color: #2b78c5; text-align: left; }
          .detail-table th, .detail-table td { padding: 12px; border: 1px solid #dee2e6; font-size: 14px; }
          
          .total-section { text-align: right; margin-top: 20px; font-size: 18px; }
          .total-amount { color: #e11d48; font-weight: 800; font-size: 22px; }

          .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
          .signature-space { height: 80px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Ban Quản lý Ký túc xá Bách Khoa</h2>
            <p>Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
            <p>Điện thoại: (024) 3869 2942</p>
          </div>

          <div class="title">BIÊN LAI THU TIỀN DỊCH VỤ</div>
          
          <div class="info-grid">
            <div class="info-item"><strong>Mã hóa đơn:</strong> ${hd.maHD}</div>
            <div class="info-item"><strong>Kỳ thanh toán:</strong> ${hd.kyThanhToan}</div>
            <div class="info-item"><strong>Phòng:</strong> ${hd.phong?.tenPhong || "N/A"}</div>
            <div class="info-item"><strong>Ngày in:</strong> ${new Date().toLocaleDateString("vi-VN")}</div>
          </div>

          <table class="detail-table">
            <thead>
              <tr>
                <th>Hạng mục</th>
                <th>Chỉ số cũ</th>
                <th>Chỉ số mới</th>
                <th>Tiêu thụ</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Điện năng (kWh)</td>
                <td>${hd.dienCu || "---"}</td>
                <td>${hd.dienMoi || "---"}</td>
                <td><strong>${tieuThuDien}</strong></td>
                <td>${(hd.tienDien || 0).toLocaleString()}đ</td>
              </tr>
              <tr>
                <td>Nước sinh hoạt (m³)</td>
                <td>${hd.nuocCu || "---"}</td>
                <td>${hd.nuocMoi || "---"}</td>
                <td><strong>${tieuThuNuoc}</strong></td>
                <td>${(hd.tienNuoc || 0).toLocaleString()}đ</td>
              </tr>
              <!-- ĐÃ THÊM DÒNG TIỀN PHÒNG NỘI TRÚ Ở ĐÂY -->
              <tr>
                <td><strong>Tiền phòng nội trú</strong></td>
                <td>---</td>
                <td>---</td>
                <td><strong>1 tháng</strong></td>
                <td><strong>${(hd.tienPhong || 0).toLocaleString()}đ</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <span>TỔNG CỘNG THANH TOÁN:</span><br/>
            <span class="total-amount">${hd.tongTien?.toLocaleString()} VNĐ</span>
          </div>

          <p style="font-size: 12px; font-style: italic; margin-top: 20px;">* Ghi chú: Vui lòng kiểm tra kỹ các chỉ số trước khi rời quầy thu phí.</p>

          <div class="footer">
            <div>
              <p><strong>Người nộp tiền</strong></p>
              <div class="signature-space"></div>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p><strong>Người lập phiếu</strong></p>
              <div class="signature-space"></div>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
        <script>
          window.onload = () => { window.print(); window.close(); };
        </script>
      </body>
    </html>
  `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="w-full pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3">
            <FaFileInvoiceDollar className="text-green-500" /> QUẢN LÝ THU PHÍ
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Hóa đơn điện nước & Dịch vụ nội trú
          </p>
        </div>

        {/* Bộ lọc trạng thái nhanh */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 gap-1">
          {[
            { label: "Tất cả", value: "" },
            { label: "Chưa thanh toán", value: "Chưa thanh toán" },
            { label: "Đã đóng tiền", value: "Đã thanh toán" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setTrangThaiFilter(btn.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                trangThaiFilter === btn.value
                  ? "bg-[#2b78c5] text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4 focus-within:shadow-md transition-all">
        <FaSearch className="text-gray-300 ml-3" />
        <input
          type="text"
          placeholder="Tìm theo mã hóa đơn hoặc tên phòng..."
          className="flex-1 outline-none font-bold text-gray-600 placeholder:text-gray-200"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />
      </div>

      {/* Bảng Hóa Đơn */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="p-6 font-black text-gray-400 text-[10px] uppercase">
                Mã hóa đơn / Loại
              </th>
              <th className="p-6 font-black text-gray-400 text-[10px] uppercase">
                Phòng / Kỳ
              </th>
              <th className="p-6 font-black text-gray-400 text-[10px] uppercase">
                Tổng tiền
              </th>
              <th className="p-6 font-black text-gray-400 text-[10px] uppercase text-center">
                Trạng thái
              </th>
              <th className="p-6 font-black text-gray-400 text-[10px] uppercase text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.map((hd) => (
              <tr
                key={hd._id}
                className="group hover:bg-green-50/20 transition-all"
              >
                <td className="p-6">
                  <p className="font-black text-gray-700 group-hover:text-black">
                    {hd.maHD}
                  </p>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md uppercase">
                    {hd.loaiHD}
                  </span>
                </td>
                <td className="p-6">
                  <p className="font-black text-[#2b78c5]">
                    {hd.phong?.tenPhong || "N/A"}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 italic">
                    Kỳ thanh toán: {hd.kyThanhToan}
                  </p>
                </td>
                <td className="p-6">
                  <p className="font-black text-red-500 text-lg tracking-tighter">
                    {hd.tongTien?.toLocaleString()}đ
                  </p>
                </td>
                <td className="p-6 text-center">
                  {hd.trangThai === "Đã thanh toán" ? (
                    <span className="inline-flex items-center gap-1.5 text-green-500 font-black text-[10px] uppercase bg-green-50 px-4 py-2 rounded-xl">
                      <FaCheckCircle /> Đã hoàn thành
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-orange-500 font-black text-[10px] uppercase bg-orange-50 px-4 py-2 rounded-xl">
                      <FaClock /> Đang chờ thu
                    </span>
                  )}
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    {hd.trangThai === "Chưa thanh toán" && (
                      <button
                        onClick={() => handleThanhToan(hd._id)}
                        className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all"
                      >
                        <FaMoneyBillWave /> Thu tiền
                      </button>
                    )}
                    <button
                      onClick={() => handleInHoaDon(hd)}
                      className="p-3 text-gray-300 hover:text-[#2b78c5] hover:bg-white rounded-xl transition-all"
                      title="Xuất file PDF / In hóa đơn"
                    >
                      <FaPrint />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-20 text-center font-black text-gray-300 uppercase italic tracking-widest">
            Không tìm thấy dữ liệu hóa đơn nào
          </div>
        )}
      </div>
    </div>
  );
}
