import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/public/Register";
import AdminLayout from "./layouts/AdminLayout";
import TongQuan from "./pages/admin/TongQuan";
import PrivateRoute from "./routes/PrivateRoute";
import DonDangKy from "./pages/admin/DonDangKy";
import QuanLySinhVien from "./pages/admin/QuanLySinhVien";
import StudentLayout from "./layouts/StudentLayout";
import HoSoCaNhan from "./pages/student/HoSoCaNhan";
import DoiMatKhau from "./pages/student/DoiMatKhau";
import QuanLyPhong from "./pages/admin/QuanLyPhong";
import ThongTinPhong from "./pages/student/ThongTinPhong";
import QuanLyHopDong from "./pages/admin/QuanLyHopDong";
import ThongTinHopDong from "./pages/student/ThongTinHopDong";
import QuanLyHoaDon from "./pages/admin/QuanLyHoaDon";
import SinhVienHoaDon from "./pages/student/SinhVienHoaDon";
import QuanLyTaiKhoan from "./pages/admin/QuanLyTaiKhoan";
import QuanLySuCo from "./pages/technician/QuanLySuCo";
import QuanLyTaiSan from "./pages/admin/QuanLyTaiSan";
import QuanLyTaiSanTech from "./pages/technician/QuanLyTaiSanTech";
import TechnicianLayout from "./layouts/TechnicianLayout";
import YeuCauHoTro from "./pages/student/YeuCauHoTro";
import QuanLyYeuCau from "./pages/admin/QuanLyYeuCau";
import QuanLyYeuCauTech from "./pages/technician/QuanLyYeuCauTech";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* ----- CÁC ROUTE PUBLIC ----- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ----- KHU VỰC CỦA ADMIN (SUPER_ADMIN & MANAGER) ----- */}
          <Route
            element={<PrivateRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]} />}
          >
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<TongQuan />} />
              <Route path="don-dang-ky" element={<DonDangKy />} />
              <Route path="sinh-vien" element={<QuanLySinhVien />} />
              <Route path="phong" element={<QuanLyPhong />} />
              <Route path="hop-dong" element={<QuanLyHopDong />} />
              <Route path="hoa-don" element={<QuanLyHoaDon />} />
              <Route path="tai-san" element={<QuanLyTaiSan />} />
              <Route path="yeu-cau" element={<QuanLyYeuCau />} />
              <Route path="nhan-su" element={<QuanLyTaiKhoan />} />
            </Route>
          </Route>

          {/* ----- KHU VỰC CỦA SINH VIÊN (STUDENT) ----- */}
          <Route element={<PrivateRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<HoSoCaNhan />} />
              <Route path="phong" element={<ThongTinPhong />} />
              <Route path="hop-dong" element={<ThongTinHopDong />} />
              <Route path="hoa-don" element={<SinhVienHoaDon />} />
              <Route path="yeu-cau" element={<YeuCauHoTro />} />
              <Route path="doi-mat-khau" element={<DoiMatKhau />} />
            </Route>
          </Route>

          {/* 👇 ----- KHU VỰC CỦA KỸ THUẬT VIÊN (TECHNICIAN) ----- 👇 */}
          <Route element={<PrivateRoute allowedRoles={["TECHNICIAN"]} />}>
            <Route path="/technician" element={<TechnicianLayout />}>
              {/* Mặc định vào sẽ chuyển hướng sang trang yêu cầu sự cố */}
              <Route index element={<Navigate to="su-co" replace />} />

              <Route path="su-co" element={<QuanLyYeuCauTech />} />

              <Route path="tai-san" element={<QuanLyTaiSanTech />} />

              {/* Có thể tái sử dụng component HoSoCaNhan và DoiMatKhau của Sinh Viên 
                  hoặc tạo file mới dành riêng cho Technician  */}
              <Route
                path="ho-so"
                element={
                  <div>Đang xây dựng: Thông tin cá nhân (Kỹ thuật viên)</div>
                }
              />
              <Route
                path="doi-mat-khau"
                element={<div>Đang xây dựng: Đổi mật khẩu</div>}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
