import axiosClient from "./axiosClient";

export const taiKhoanApi = {
  getAll: () => axiosClient.get("/tai-khoan"),
  create: (data) => axiosClient.post("/tai-khoan", data),
  toggleStatus: (id) => axiosClient.put(`/tai-khoan/${id}/toggle-status`),
  delete: (id) => axiosClient.delete(`/tai-khoan/${id}`),
};
