import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logInStart,
  logInSuccess,
  logInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import login_img from "../images/login.jpg";

const Login = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(logInFailure("Vui lòng điền đầy đủ vào các ô!"));
    }
    try {
      dispatch(logInStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(logInFailure(data.message));
      }

      if (res.ok) {
        dispatch(logInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(logInFailure(error.message));
    }
  };

  return (
    <div className="w-full h-max flex relative top-[30px] justify-center">
      <div className="w-max h-full bg-white rounded-lg flex border border-black shadow-xl">
        <img
          src={login_img}
          className="max-h-[430px] rounded-l-md object-contain"
        />
        {/*-----LOGIN FORM-----*/}
        <div className="max-w-[350px] w-[350px] flex flex-col gap-5 p-5">
          <h3 className="text-3xl font-semibold">Đăng Nhập</h3>
          <div className=" flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              className="h-[30px] bg-white border border-black rounded"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              id="password"
              onChange={handleChange}
              className="h-[30px] bg-white border border-black rounded"
            />
            {errorMessage && (
              <span className="text-red-600 bg-red-100 p-2">
                {errorMessage}
              </span>
            )}
          </div>
          <div className="flex justify-end">
            <p className="text-sm font-medium hover:underline hover:underline-offset-2 cursor-pointer">
              Quên mật khẩu?
            </p>
          </div>
          <div className="w-full flex flex-col gap-5">
            <button
              className="w-full bg-orange-500 text-white rounded p-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Đăng nhập"}
            </button>
            <OAuth />
          </div>
          <div className="w-full flex justify-center">
            <p className="text-sm">
              Chưa có tài khoản?{" "}
              <Link to="/register">
                <span className="text-orange-500 underline">Đăng ký ngay</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
