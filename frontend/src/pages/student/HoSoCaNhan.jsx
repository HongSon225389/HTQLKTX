import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { sinhVienApi } from "../../services/sinhVienApi";
import {
  FaUserCircle,
  FaSpinner,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import { toast } from "react-toastify";

const HoSoCaNhan = () => {
  const { user } = useContext(AuthContext);
  const [hoSo, setHoSo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await sinhVienApi.getMe();
        if (res.success) {
          setHoSo(res.data);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProfile();
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );

  if (!hoSo)
    return (
      <div className="text-center mt-20 text-gray-500">
        Chưa có thông tin hồ sơ!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Hồ Sơ Sinh Viên Nội Trú
      </h2>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header của thẻ */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
              <FaUserCircle className="text-7xl text-gray-300" />
            </div>
          </div>
        </div>

        {/* Nội dung thông tin */}
        <div className="pt-16 pb-8 px-8">
          <h3 className="text-2xl font-bold text-gray-900">{hoSo.hoTen}</h3>
          <p className="text-teal-600 font-semibold mb-6">Mã SV: {hoSo.maSV}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <FaIdCard className="text-teal-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Số CCCD
                  </p>
                  <p className="font-medium">{hoSo.cccd}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBirthdayCake className="text-teal-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Ngày sinh
                  </p>
                  <p className="font-medium">
                    {formatDate(hoSo.ngaySinh) || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaVenusMars className="text-teal-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Giới tính
                  </p>
                  <p className="font-medium">{hoSo.gioiTinh}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <FaPhone className="text-teal-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </p>
                  <p className="font-medium">{hoSo.sdt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaEnvelope className="text-teal-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Email liên hệ
                  </p>
                  <p className="font-medium">{hoSo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSoCaNhan;
