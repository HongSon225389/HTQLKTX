import axiosClient from "./axiosClient";

export const guestApi = {
  getLoaiPhong: () => {
    return axiosClient.get("/loai-phong");
  },

  guiDonDangKy: (data) => {
    return axiosClient.post("/don-dang-ky", data);
  },
};
