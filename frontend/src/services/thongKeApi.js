import axiosClient from "./axiosClient";

export const thongKeApi = {
  // Hàm gọi API lấy toàn bộ dữ liệu thống kê cho trang Tổng Quan (Dashboard)
  getTongQuan: () => axiosClient.get("/thong-ke/tong-quan"),
};
