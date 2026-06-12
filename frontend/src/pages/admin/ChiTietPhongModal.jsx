import { useState, useEffect } from "react";
import { FaTimes, FaBed, FaUserGraduate, FaSpinner } from "react-icons/fa";
import { phongApi } from "../../services/phongApi";
import { toast } from "react-toastify";

const ChiTietPhongModal = ({ isOpen, onClose, phongId }) => {
  const [phongData, setPhongData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChiTiet = async () => {
      if (!phongId || !isOpen) return;

      setLoading(true);
      try {
        const res = await phongApi.getById(phongId);
        if (res.success) {
          setPhongData(res.data);
        }
      } catch (error) {
        toast.error("Lỗi khi tải thông tin chi tiết phòng");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchChiTiet();
  }, [phongId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaBed /> Chi Tiết Ký Túc Xá
          </h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Nội dung */}
        {loading || !phongData ? (
          <div className="flex justify-center items-center p-10 flex-grow">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Header thông tin phòng */}
            <div className="p-6 bg-blue-50 border-b border-blue-100 shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">
                    {phongData.tenPhong}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Mã phòng:{" "}
                    <span className="font-semibold text-gray-800">
                      {phongData.maPhong}
                    </span>{" "}
                    | Tòa nhà:{" "}
                    <span className="font-semibold text-gray-800">
                      {phongData.toaNha}
                    </span>{" "}
                    (Tầng {phongData.tang})
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {phongData.trangThai}
                  </span>
                  <p className="text-sm font-medium text-gray-600 mt-2">
                    Sĩ số:{" "}
                    <span className="text-blue-600 font-bold">
                      {phongData.soNguoiHienTai}
                    </span>{" "}
                    / {phongData.loaiPhong?.sucChua || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng danh sách sinh viên */}
            <div className="p-6 overflow-y-auto">
              <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserGraduate className="text-blue-600" /> Sinh viên đang lưu
                trú
              </h5>

              {phongData.danhSachSinhVien &&
              phongData.danhSachSinhVien.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Mã SV
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Họ và Tên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          SĐT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {phongData.danhSachSinhVien.map((sv) => (
                        <tr key={sv._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">
                            {sv.maSV}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {sv.hoTen}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {sv.sdt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium">
                    Hiện tại phòng này đang trống.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChiTietPhongModal;
