import React from "react";
import {
  FaWrench,
  FaCheckCircle,
  FaExclamationCircle,
  FaTools,
} from "react-icons/fa";

const QuanLySuCo = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500 text-white p-3 rounded-xl shadow-md">
          <FaWrench size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">
            Danh Sách Yêu Cầu Sửa Chữa
          </h2>
          <p className="text-sm text-gray-500">
            Tiếp nhận và cập nhật tiến độ khắc phục sự cố KTX
          </p>
        </div>
      </div>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">
              Đang chờ xử lý
            </p>
            <p className="text-2xl font-black text-red-500">3</p>
          </div>
          <FaExclamationCircle className="text-red-100" size={40} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">
              Đang tiến hành
            </p>
            <p className="text-2xl font-black text-blue-500">1</p>
          </div>
          <FaTools className="text-blue-100" size={40} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">
              Đã hoàn thành
            </p>
            <p className="text-2xl font-black text-green-500">12</p>
          </div>
          <FaCheckCircle className="text-green-100" size={40} />
        </div>
      </div>

      {/* Khung chứa Danh sách sẽ ghép API sau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-gray-400 flex flex-col items-center justify-center">
        <FaWrench size={48} className="mb-4 opacity-20" />
        <p className="font-medium text-lg">Chưa có dữ liệu sự cố</p>
        <p className="text-sm">
          Vui lòng chờ ghép nối API Backend để hiển thị danh sách phòng báo
          hỏng!
        </p>
      </div>
    </div>
  );
};

export default QuanLySuCo;
