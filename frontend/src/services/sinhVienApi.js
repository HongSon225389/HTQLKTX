import axiosClient from "./axiosClient";

export const sinhVienApi = {
  // Lấy danh sách tất cả hồ sơ sinh viên
  getAll: () => {
    return axiosClient.get("/sinh-vien"); // Giả định backend của bạn có route GET /api/sinh-vien
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

  // Cập nhật thông tin sinh viên
  update: (id, data) => {
    return axiosClient.put(`/sinh-vien/${id}`, data);
  },

  // Cho sinh viên rời KTX (Xóa)
  delete: (id) => {
    return axiosClient.delete(`/sinh-vien/${id}`);
  },
  lockAccount: (userId) => axiosClient.put(`/auth/lock/${userId}`),
  unlockAccount: (userId) => axiosClient.put(`/auth/unlock/${userId}`),
};
