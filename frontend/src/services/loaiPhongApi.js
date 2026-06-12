import axiosClient from "./axiosClient";

export const loaiPhongApi = {
  getAll: (params) => {
    return axiosClient.get("/loai-phong", { params });
  },
  getById: (id) => {
    return axiosClient.get(`/loai-phong/${id}`);
  },
  create: (data) => {
    return axiosClient.post("/loai-phong", data);
  },
  update: (id, data) => {
    return axiosClient.put(`/loai-phong/${id}`, data);
  },
  deactivate: (id) => {
    return axiosClient.put(`/loai-phong/${id}/deactivate`);
  },
  activate: (id) => {
    return axiosClient.put(`/loai-phong/${id}/activate`);
  },
};
