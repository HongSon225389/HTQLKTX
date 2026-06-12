import axiosClient from "./axiosClient";

export const phongApi = {
  // Lấy danh sách phòng (có phân trang, tìm kiếm, lọc)
  getAll: (params) => {
    return axiosClient.get("/phong", { params });
  },

  // Lấy chi tiết 1 phòng (để xem danh sách sinh viên bên trong)
  getById: (id) => {
    return axiosClient.get(`/phong/${id}`);
  },

  // Thêm phòng mới
  create: (data) => {
    return axiosClient.post("/phong", data);
  },

  // Cập nhật thông tin phòng
  update: (id, data) => {
    return axiosClient.put(`/phong/${id}`, data);
  },

  // Xóa phòng (Xóa mềm - isDeleted)
  delete: (id) => {
    return axiosClient.delete(`/phong/${id}`);
  },

  // Chuyển phòng sang trạng thái "Bảo trì"
  maintenance: (id) => {
    // Sửa lại thành /phong/${id}/maintenance cho khớp route Backend
    return axiosClient.put(`/phong/${id}/maintenance`);
  },

  // Mở lại phòng sau khi bảo trì xong
  open: (id) => {
    // Sửa lại thành /phong/${id}/open cho khớp route Backend
    return axiosClient.put(`/phong/${id}/open`);
  },

  getMyRoom: () => {
    return axiosClient.get("/phong/my-room");
  },
};
