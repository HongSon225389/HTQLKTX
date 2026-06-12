import axiosClient from "./axiosClient";

export const authApi = {
  login: (data) => {
    // data chứa { username, password }
    return axiosClient.post("/auth/login", data);
  },

  // ĐÂY LÀ HÀM BẠN ĐANG THIẾU ĐỂ GỌI XUỐNG BACKEND:
  changePassword: (data) => {
    // data chứa { currentPassword, newPassword }
    return axiosClient.put("/auth/change-password", data);
  },
};
