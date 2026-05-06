# 🏢 Hệ Thống Quản Lý Ký Túc Xá (Dormitory Management System)

Một ứng dụng Web Full-stack (MERN) được thiết kế nhằm số hóa và tự động hóa quy trình quản lý Ký túc xá (tối ưu cho mô hình KTX sinh viên). Hệ thống giúp Ban Quản lý dễ dàng theo dõi nhân sự, tự động hóa tính toán chi phí, xuất biên lai và giám sát an ninh một cách trực quan, chính xác.

---

## ✨ Các tính năng nổi bật

- 🛏️ **Quản lý Phòng & Sinh viên:**
  - Quản lý danh sách phòng, sức chứa, phân loại phòng (VIP, Thường...).
  - Quản lý hồ sơ, thông tin chi tiết của từng sinh viên nội trú.
- ⚡ **Tự động hóa Điện Nước & Hóa Đơn:**
  - Ghi nhận chỉ số điện/nước hàng tháng theo từng phòng.
  - Tự động bóc tách và cộng gộp **Tiền phòng + Tiền điện + Tiền nước** thành một hóa đơn tổng thống nhất ngay khi chốt số.
  - Hỗ trợ xuất và in biên lai thu tiền (PDF) chuyên nghiệp, minh bạch từng hạng mục.
- 📊 **Dashboard Thống kê (Real-time):**
  - Giao diện quản trị trực quan.
  - Biểu đồ theo dõi doanh thu (chia rõ từng hạng mục: Doanh thu phòng, điện, nước).
  - Biểu đồ theo dõi tỷ lệ lấp đầy phòng và biến động tiêu thụ điện nước theo tháng.
- 🚶‍♂️ **Giám sát An ninh (Log Ra/Vào):**
  - Theo dõi lịch sử ra vào cổng KTX của sinh viên.
  - Tự động phân loại trạng thái và cảnh báo: **Về muộn (>22h)**, **Chưa về** hoặc phát hiện **Người lạ/Khách vãng lai**.
  - Tích hợp công cụ tạo dữ liệu mẫu (Mock data) thông minh để mô phỏng và test hệ thống.

---

## 💻 Công nghệ sử dụng (Tech Stack)

**Frontend:**

- **React.js** (Giao diện người dùng)
- **Tailwind CSS** (Thiết kế giao diện hiện đại, Responsive)
- **Axios** (Giao tiếp API)
- **Recharts** (Vẽ biểu đồ dữ liệu thống kê)
- **React Icons** (Hệ thống biểu tượng)

**Backend:**

- **Node.js & Express.js** (Máy chủ RESTful API)
- **MongoDB & Mongoose** (Cơ sở dữ liệu NoSQL)
- **CORS** (Bảo mật Cross-Origin Resource Sharing)

---

## 🚀 Hướng dẫn cài đặt & Chạy cục bộ (Local)

### 1. Yêu cầu hệ thống

Để chạy được dự án này, máy tính của bạn cần cài đặt sẵn:

- [Node.js](https://nodejs.org/) (Khuyên dùng bản LTS)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local) hoặc có tài khoản MongoDB Atlas.

### 2. Cài đặt và chạy Backend

Mở Terminal, di chuyển vào thư mục `backend`:

```bash
cd backend
npm install
Tạo file .env trong thư mục backend và điền các cấu hình cơ sở dữ liệu:

Đoạn mã
PORT=5000
MONGO_URI=mongodb://localhost:27017/qlktx
# (Hoặc thay bằng link chuỗi kết nối MongoDB Atlas của bạn)
JWT_SECRET=chuoi_khoa_bao_mat_cua_ban
Khởi chạy Server:

Bash
npm start
# (Hoặc npm run dev nếu bạn sử dụng nodemon)
Backend sẽ chạy tại: http://localhost:5000

3. Cài đặt và chạy Frontend
Mở một Terminal mới, di chuyển vào thư mục frontend:

Bash
cd frontend
npm install
Tạo file .env (hoặc .env.local) trong thư mục frontend để kết nối API:

Đoạn mã
VITE_API_URL=http://localhost:5000/api
Khởi chạy giao diện Web:

Bash
npm run dev
# (Hoặc npm start)
```
