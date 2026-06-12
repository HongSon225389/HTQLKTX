import axiosClient from "./axiosClient";

export const yeuCauApi = {
  getAll: (params) => axiosClient.get("/yeu-cau-ho-tro", { params }),

  getById: (id) => axiosClient.get(`/yeu-cau-ho-tro/${id}`),

  create: (data) => axiosClient.post("/yeu-cau-ho-tro", data),

  updateStatus: (id, data) =>
    axiosClient.put(`/yeu-cau-ho-tro/${id}/xu-ly`, data),

  rate: (id, data) => axiosClient.post(`/yeu-cau-ho-tro/${id}/danh-gia`, data),

  cancel: (id) => axiosClient.delete(`/yeu-cau-ho-tro/${id}/huy`),
};
