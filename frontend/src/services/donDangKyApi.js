import axiosClient from "./axiosClient";

export const donDangKyApi = {
  getAll: () => {
    return axiosClient.get("/don-dang-ky");
  },

  duyetDon: (id) => {
    return axiosClient.put(`/don-dang-ky/${id}/approve`);
  },

  tuChoiDon: (id, lyDoTuChoi) => {
    return axiosClient.put(`/don-dang-ky/${id}/reject`, { lyDoTuChoi });
  },
};
