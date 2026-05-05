import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
// Các file này bạn tạo file rỗng tương ứng trong folder pages nhé
import Phong from "./pages/Phong";
import BaoCao from "./pages/BaoCao";
import SinhVien from "./pages/SinhVien";
import DienNuoc from "./pages/DienNuoc";
import HoaDon from "./pages/HoaDon";
import HopDong from "./pages/HopDong";
import Login from "./pages/Login";
import VatTu from "./pages/VatTu";
import LogRaVao from "./pages/LogRaVao";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="phong" element={<Phong />} />
          <Route path="sinh-vien" element={<SinhVien />} />
          <Route path="dien-nuoc" element={<DienNuoc />} />
          <Route path="hoadon" element={<HoaDon />} />
          <Route path="bao-cao" element={<BaoCao />} />
          <Route path="hop-dong" element={<HopDong />} />
          <Route path="vat-tu" element={<VatTu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/log-ra-vao" element={<LogRaVao />} />
          {/* Thêm các Route khác vào đây sau */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
