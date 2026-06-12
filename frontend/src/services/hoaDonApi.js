import axiosClient from "./axiosClient";

export const hoaDonApi = {
  // Lấy danh sách (Có phân trang, lọc, tìm kiếm)
  getAll: (params) => {
    return axiosClient.get("/hoa-don", { params });
  },

  // Lấy chi tiết 1 hóa đơn
  getById: (id) => {
    return axiosClient.get(`/hoa-don/${id}`);
  },

  // Tạo hóa đơn mới (hàng loạt)
  create: (data) => {
    return axiosClient.post("/hoa-don", data);
  },

  // Xác nhận đã thu tiền
  xacNhanThanhToan: (id) => {
    return axiosClient.put(`/hoa-don/${id}/thanhtoan`);
  },

  // Xóa hóa đơn
  delete: (id) => {
    return axiosClient.delete(`/hoa-don/${id}`);
  },

  getMyInvoices: (params) =>
    axiosClient.get("/hoa-don/my-invoices", { params }),
};
