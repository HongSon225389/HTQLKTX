import axiosClient from "./axiosClient";

export const guestApi = {
  // Lấy danh sách loại phòng hiển thị vào Dropdown
  getLoaiPhong: () => {
    return axiosClient.get("/loai-phong");
  },

  // Gửi form đăng ký
  guiDonDangKy: (data) => {
    return axiosClient.post("/don-dang-ky", data);
  },
};
