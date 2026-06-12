import axiosClient from "./axiosClient";

export const chiSoDienNuocApi = {
  // Sửa đường dẫn từ /chi-so-dien-nuoc/... thành /dien-nuoc/...
  getMoiNhatCuaPhong: (phongId) =>
    axiosClient.get(`/dien-nuoc/moinhat/${phongId}`),

  // Chốt số mới (Sửa từ /chi-so-dien-nuoc thành /dien-nuoc)
  chotSo: (data) => axiosClient.post("/dien-nuoc", data),
};
