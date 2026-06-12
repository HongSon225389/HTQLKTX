import axiosClient from "./axiosClient";

export const hopDongApi = {
  // Các hàm của Admin
  getAll: (params) => axiosClient.get("/hop-dong", { params }),
  create: (data) => axiosClient.post("/hop-dong", data),
  giaHan: (id, ngayKetThucMoi) =>
    axiosClient.put(`/hop-dong/${id}/giahan`, { ngayKetThucMoi }),
  thanhLy: (id) => axiosClient.put(`/hop-dong/${id}/thanhly`),
  delete: (id) => axiosClient.delete(`/hop-dong/${id}`),
  getMyHopDong: () => {
    return axiosClient.get("/hop-dong/me");
  },
};
