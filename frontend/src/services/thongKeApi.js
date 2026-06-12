import axiosClient from "./axiosClient";

export const thongKeApi = {
  getTongQuan: () => axiosClient.get("/thong-ke/tong-quan"),
};
