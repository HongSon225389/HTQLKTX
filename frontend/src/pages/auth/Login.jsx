import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { authApi } from "../../services/authApi";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ username, password });
      console.log("Phản hồi từ Backend:", response);
      if (response.success) {
        // Lưu thông tin vào Context & LocalStorage
        const user = response.user || response.data?.user;
        const token = response.token || response.data?.token;
        login(user, token);
        toast.success("Đăng nhập thành công! 🎉");

        // Phân luồng chuyển trang theo Role
        const role = user.role;
        if (role === "SUPER_ADMIN" || role === "MANAGER") {
          navigate("/admin");
        } else if (role === "STUDENT") {
          navigate("/student");
        } else if (role === "TECHNICIAN") {
          navigate("/technician");
        }
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error);
      const message =
        error.response?.data?.message || "Lỗi kết nối đến máy chủ!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">
            Hệ Thống KTX
          </h2>
          <p className="text-gray-500">Đăng nhập để tiếp tục</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập / Mã SV
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Nhập tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex justify-center items-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Bạn chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký lưu trú ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
