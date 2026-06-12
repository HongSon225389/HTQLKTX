import axiosClient from "./axiosClient";

export const phongApi = {
  getAll: (params) => {
    return axiosClient.get("/phong", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/phong/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/phong", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/phong/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/phong/${id}`);
  },

  maintenance: (id) => {
    return axiosClient.put(`/phong/${id}/maintenance`);
  },

  open: (id) => {
    return axiosClient.put(`/phong/${id}/open`);
  },

  getMyRoom: () => {
    return axiosClient.get("/phong/my-room");
  },
};
