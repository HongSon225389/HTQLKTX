# 🏢 Hệ thống Quản lý Ký túc xá (HUST Dormitory Management System 2.0)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Giới thiệu dự án

**KTX 2.0** là một hệ thống ứng dụng Web Full-stack được thiết kế theo mô hình quản trị tập trung (Admin Portal). Dự án ra đời nhằm giải quyết triệt để vấn đề quá tải trong khâu lưu trữ hồ sơ giấy tờ, sai sót trong tính toán chi phí điện nước và khó khăn trong việc kiểm soát an ninh tại các Ký túc xá Đại học.

Hệ thống giúp số hóa toàn bộ vòng đời lưu trú của sinh viên, cung cấp cho Ban quản lý một công cụ mạnh mẽ để giám sát cơ sở vật chất và tự động hóa các luồng tài chính.

## ✨ Tính năng nổi bật

- **📊 Dashboard Thống kê:** Trực quan hóa dữ liệu doanh thu, tỷ lệ lấp đầy phòng và tình trạng hóa đơn theo thời gian thực.
- **🚪 Quản lý Phòng & CSVC:** Theo dõi trạng thái phòng (Trống, Đang ở, Đầy, Đang sửa), quản lý sức chứa và cập nhật tình trạng vật tư.
- **🧑‍🎓 Quản lý Lưu trú (Check-in/Check-out):** Tự động hóa quy trình xếp phòng, tạo lập hồ sơ tân sinh viên và ký kết/thanh lý hợp đồng.
- **💰 Tự động hóa Tài chính (Billing):** Chốt chỉ số điện nước hàng tháng, tự động tính toán chi phí và sinh hóa đơn tổng cho từng phòng.
- **🛡️ Giám sát An ninh:** Quản lý nhật ký ra/vào (Logs) KTX, hỗ trợ kiểm soát kỷ luật nội trú.

---

## 🛠 Công nghệ sử dụng

- **Frontend:** ReactJS (Vite), Tailwind CSS, React Router v6, Axios, Recharts (Vẽ biểu đồ), React Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (NoSQL), Mongoose.
- **Bảo mật:** JSON Web Token (JWT) cho xác thực, BcryptJS để mã hóa mật khẩu.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Local Development)

Dự án được chia thành 2 phân hệ hoạt động độc lập: `frontend` và `backend`. Yêu cầu máy tính của bạn phải cài đặt sẵn **[Node.js](https://nodejs.org/)** (v16 trở lên) và có tài khoản **MongoDB Atlas**.

### Bước 1: Clone mã nguồn về máy

```bash
git clone [https://github.com/TenCuaBan/qlktx2.0.git](https://github.com/TenCuaBan/qlktx2.0.git)
cd qlktx2.0
Bước 2: Thiết lập Backend (API Server)
Mở Terminal mới và di chuyển vào thư mục backend:

Bash
cd backend
npm install
Tạo một file .env trong thư mục backend (Bạn có thể copy từ file .env.example) và cấu hình các biến môi trường sau:

Đoạn mã
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/qly_ktx?retryWrites=true&w=majority
JWT_SECRET=nhap_mot_chuoi_ky_tu_bi_mat_bat_ky_vao_day
(Lưu ý: Đảm bảo IP mạng của bạn đã được thêm vào Whitelist trên MongoDB Atlas).

Khởi chạy Backend Server:

Bash
npm run dev
Server sẽ chạy tại: http://localhost:5000

Bước 3: Thiết lập Frontend (Client UI)
Mở một Terminal khác và di chuyển vào thư mục frontend:

Bash
cd frontend
npm install
Khởi chạy Frontend Server:

Bash
npm run dev
Giao diện Admin sẽ chạy tại: http://localhost:5173 (Hoặc port 3000 tùy cấu hình).

📂 Cấu trúc thư mục (Folder Structure)
Plaintext
qlktx2.0/
├── backend/                # API Server & Database Models
│   ├── controllers/        # Xử lý logic nghiệp vụ
│   ├── middlewares/        # Bảo mật JWT (Xác thực token)
│   ├── models/             # Schema cho MongoDB (Mongoose)
│   ├── routes/             # Định tuyến API endpoints
│   └── server.js           # File khởi chạy server chính
│
└── frontend/               # ReactJS UI
    ├── src/
    │   ├── assets/         # Hình ảnh, fonts
    │   ├── components/     # Các UI elements dùng chung (Modals, Tables...)
    │   ├── layouts/        # Layout chính (MainLayout chứa Sidebar)
    │   ├── pages/          # Các trang chức năng (Login, Dashboard, SinhVien...)
    │   ├── App.jsx         # Cấu hình Router (Protected Routes)
    │   └── main.jsx        # Entry point của React
```
