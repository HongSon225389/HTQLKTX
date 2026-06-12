import axiosClient from "./axiosClient";

export const donDangKyApi = {
  // Lấy danh sách tất cả đơn đăng ký
  getAll: () => {
    return axiosClient.get("/don-dang-ky");
  },

  // Gọi API duyệt đơn (Giả định endpoint là PUT /don-dang-ky/:id/duyet)
  duyetDon: (id) => {
    return axiosClient.put(`/don-dang-ky/${id}/approve`);
  },

  tuChoiDon: (id, lyDoTuChoi) => {
    // Truyền lyDoTuChoi vào trong body theo đúng yêu cầu backend req.body
    return axiosClient.put(`/don-dang-ky/${id}/reject`, { lyDoTuChoi });
  },
};
