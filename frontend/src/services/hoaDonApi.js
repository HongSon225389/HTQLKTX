import axiosClient from "./axiosClient";

export const hoaDonApi = {
  getAll: (params) => {
    return axiosClient.get("/hoa-don", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/hoa-don/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/hoa-don", data);
  },

  xacNhanThanhToan: (id) => {
    return axiosClient.put(`/hoa-don/${id}/thanhtoan`);
  },

  delete: (id) => {
    return axiosClient.delete(`/hoa-don/${id}`);
  },

  getMyInvoices: (params) =>
    axiosClient.get("/hoa-don/my-invoices", { params }),
};
