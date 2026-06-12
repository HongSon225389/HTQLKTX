const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Khởi tạo một "người vận chuyển" (Transporter)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Thiết lập nội dung bức thư
  const mailOptions = {
    from: '"Ban Quản Lý Ký Túc Xá" <no-reply@ktx.edu.vn>', // Tên hiển thị người gửi
    to: options.email, // Gửi đến ai
    subject: options.subject, // Tiêu đề thư
    html: options.html, // Nội dung thư (định dạng HTML cho đẹp)
  };

  // 3. Tiến hành gửi
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
