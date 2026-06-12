import { useState, useEffect } from "react";
import { phongApi } from "../../services/phongApi";
import {
  FaBed,
  FaUserFriends,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ThongTinPhong = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRoom = async () => {
      try {
        const res = await phongApi.getMyRoom();
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchMyRoom();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <FaSpinner className="animate-spin text-3xl text-green-600" />
      </div>
    );
  }

  if (!data || !data.phong) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-gray-700">
          Chưa có thông tin phòng
        </h3>
        <p className="text-gray-500 mt-2">
          Bạn hiện chưa được Ban Quản Lý xếp vào phòng nào.
        </p>
      </div>
    );
  }

  const { phong, banCungPhong } = data;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <FaBed className="text-green-600" /> Thông Tin Phòng Ở Của Bạn
      </h2>

      {/* THÔNG TIN CHI TIẾT PHÒNG */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-green-800">{phong.tenPhong}</h3>
          <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
            ĐANG LƯU TRÚ
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Khu vực</p>
            <p className="font-semibold text-gray-800">
              Tòa: {phong.toaNha} (Tầng {phong.tang})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Loại cấu hình</p>
            <p className="font-semibold text-gray-800">
              {phong.loaiPhong?.tenLoaiPhong}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Mã phòng hệ thống</p>
            <p className="font-semibold text-gray-800">{phong.maPhong}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
              <FaMoneyBillWave className="text-green-600" /> Đơn giá / Tháng
            </p>
            <p className="font-semibold text-red-600">
              {phong.loaiPhong?.donGia
                ? phong.loaiPhong.donGia.toLocaleString("vi-VN") + " VNĐ"
                : "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BẠN CÙNG PHÒNG */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <FaUserFriends className="text-blue-600 text-lg" />
          <h3 className="text-lg font-bold text-gray-800">
            Bạn Cùng Phòng ({banCungPhong.length} người)
          </h3>
        </div>

        {banCungPhong.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mã SV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Họ và Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Liên hệ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banCungPhong.map((sv) => (
                  <tr key={sv._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {sv.maSV}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {sv.hoTen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{sv.sdt}</div>
                      <div className="text-xs text-gray-400">{sv.email}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Hiện tại bạn đang ở một mình trong phòng này.
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongTinPhong;
