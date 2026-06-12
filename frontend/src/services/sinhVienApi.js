import axiosClient from "./axiosClient";

export const sinhVienApi = {
  getAll: () => {
    return axiosClient.get("/sinh-vien");
  },
  getMe: () => {
    return axiosClient.get("/sinh-vien/me");
  },
  changePassword: (data) => {
    return axiosClient.put("/auth/change-password", data);
  },
  create: (data) => {
    return axiosClient.post("/sinh-vien", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/sinh-vien/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/sinh-vien/${id}`);
  },
  lockAccount: (userId) => axiosClient.put(`/auth/lock/${userId}`),
  unlockAccount: (userId) => axiosClient.put(`/auth/unlock/${userId}`),
};
