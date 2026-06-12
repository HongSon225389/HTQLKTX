import axiosClient from "./axiosClient";

export const yeuCauApi = {
  // 1. Lấy danh sách (Có phân trang, lọc)
  getAll: (params) => axiosClient.get("/yeu-cau-ho-tro", { params }),

  // 2. Lấy chi tiết 1 đơn
  getById: (id) => axiosClient.get(`/yeu-cau-ho-tro/${id}`),

  // 3. Tạo đơn mới (Dành cho Sinh viên)
  create: (data) => axiosClient.post("/yeu-cau-ho-tro", data),

  // 4. Xử lý đơn (Dành cho Nhân viên / Quản lý)
  updateStatus: (id, data) =>
    axiosClient.put(`/yeu-cau-ho-tro/${id}/xu-ly`, data),

  // 5. Đánh giá chất lượng (Dành cho Sinh viên)
  rate: (id, data) => axiosClient.post(`/yeu-cau-ho-tro/${id}/danh-gia`, data),

  // 6. Huy đơn (Dành cho Sinh viên)
  cancel: (id) => axiosClient.delete(`/yeu-cau-ho-tro/${id}/huy`),
};
