import axiosClient from "./axiosClient";

export const chiSoDienNuocApi = {
  getMoiNhatCuaPhong: (phongId) =>
    axiosClient.get(`/dien-nuoc/moinhat/${phongId}`),

  chotSo: (data) => axiosClient.post("/dien-nuoc", data),
};
