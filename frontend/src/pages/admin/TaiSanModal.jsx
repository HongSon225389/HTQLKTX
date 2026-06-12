import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taiSanApi } from "../../services/taiSanApi";

const TaiSanModal = ({
  isOpen,
  onClose,
  onSuccess,
  taiSanEdit,
  danhSachPhong,
}) => {
  const [formData, setFormData] = useState({
    maTS: "",
    tenTS: "",
    phong: "",
    soLuong: 1,
    tinhTrang: "Tốt",
    ghiChu: "",
    ngayMua: "",
    ngayLapDat: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Lắng nghe mỗi khi mở modal hoặc đổi tài sản đang edit
  useEffect(() => {
    if (taiSanEdit) {
      setFormData({
        maTS: taiSanEdit.maTS,
        tenTS: taiSanEdit.tenTS,
        phong: taiSanEdit.phong?._id || "",
        soLuong: taiSanEdit.soLuong,
        tinhTrang: taiSanEdit.tinhTrang,
        ghiChu: taiSanEdit.ghiChu,
        ngayMua: taiSanEdit.ngayMua ? taiSanEdit.ngayMua.split("T")[0] : "",
        ngayLapDat: taiSanEdit.ngayLapDat
          ? taiSanEdit.ngayLapDat.split("T")[0]
          : "",
      });
    } else {
      // Form thêm mới
      setFormData({
        maTS: "",
        tenTS: "",
        phong: "",
        soLuong: 1,
        tinhTrang: "Tốt",
        ghiChu: "",
        ngayMua: "",
        ngayLapDat: "",
      });
    }
  }, [taiSanEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (taiSanEdit) {
        await taiSanApi.update(taiSanEdit._id, formData);
        toast.success("Cập nhật tài sản thành công!");
      } else {
        await taiSanApi.create(formData);
        toast.success("Thêm tài sản mới thành công!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="bg-blue-700 text-white px-6 py-4 font-bold text-lg">
          {taiSanEdit ? "Cập Nhật Tài Sản" : "Thêm Tài Sản Vào Hệ Thống"}
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Mã tài sản *
            </label>
            <input
              type="text"
              required
              disabled={!!taiSanEdit}
              className="w-full border p-2 rounded-lg bg-gray-50 font-mono focus:border-blue-500 outline-none"
              value={formData.maTS}
              onChange={(e) =>
                setFormData({ ...formData, maTS: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Tên tài sản / Thiết bị *
            </label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
              value={formData.tenTS}
              onChange={(e) =>
                setFormData({ ...formData, tenTS: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Số lượng *
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
                value={formData.soLuong}
                onChange={(e) =>
                  setFormData({ ...formData, soLuong: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Xếp vào phòng
              </label>
              <select
                className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
                value={formData.phong}
                onChange={(e) =>
                  setFormData({ ...formData, phong: e.target.value })
                }
              >
                <option value="">-- Để trong kho --</option>
                {danhSachPhong.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.maPhong} ({p.toaNha})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Ngày mua
              </label>
              <input
                type="date"
                className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
                value={formData.ngayMua}
                onChange={(e) =>
                  setFormData({ ...formData, ngayMua: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Ngày lắp đặt
              </label>
              <input
                type="date"
                disabled={!formData.phong}
                title={
                  !formData.phong
                    ? "Chỉ chọn ngày lắp khi đã xếp vào phòng"
                    : ""
                }
                className={`w-full border p-2 rounded-lg outline-none ${
                  !formData.phong
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "focus:border-blue-500"
                }`}
                value={!formData.phong ? "" : formData.ngayLapDat}
                onChange={(e) =>
                  setFormData({ ...formData, ngayLapDat: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Tình trạng ban đầu
            </label>
            <select
              className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
              value={formData.tinhTrang}
              onChange={(e) =>
                setFormData({ ...formData, tinhTrang: e.target.value })
              }
            >
              <option value="Tốt">Tốt (Đang sử dụng bình thường)</option>
              <option value="Hỏng">Hỏng (Cần sửa chữa)</option>
              <option value="Đang sửa chữa">Đang sửa chữa</option>
              <option value="Thanh lý">Thanh lý</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Ghi chú
            </label>
            <textarea
              className="w-full border p-2 rounded-lg h-20 focus:border-blue-500 outline-none"
              value={formData.ghiChu}
              onChange={(e) =>
                setFormData({ ...formData, ghiChu: e.target.value })
              }
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isProcessing ? "Đang xử lý..." : "Lưu lại"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaiSanModal;
