import axiosClient from "./axiosClient";

export const taiSanApi = {
  getAll: (params) => axiosClient.get("/tai-san", { params }),
  create: (data) => axiosClient.post("/tai-san", data),
  update: (id, data) => axiosClient.put(`/tai-san/${id}`, data),
  delete: (id) => axiosClient.delete(`/tai-san/${id}`),
};
