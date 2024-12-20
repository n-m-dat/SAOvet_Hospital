import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";
import register_img from "../images/register.jpg";

const Register = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Vui lòng điền đầy đủ vào các ô!");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-max flex absolute top-[70px] justify-center">
      <div className="w-max h-full bg-white rounded-lg flex border border-black shadow-xl">
        {/*-----REGISTER IMAGES-----*/}
        <img
          src={register_img}
          className="h-[380px] rounded-l-md object-contain"
        />
        {/*-----REGISTER FORM-----*/}
        <div className="max-w-[350px] w-[350px] flex flex-col gap-5 p-5">
          <h3 className="text-3xl font-semibold">Đăng Ký</h3>
          <div className=" flex flex-col gap-5">
            <input
              type="text"
              placeholder="Họ Tên"
              id="username"
              onChange={handleChange}
              className="h-[30px] bg-none border-b border-black outline-none focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              className="h-[30px] bg-none border-b border-black outline-none focus:outline-none"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              id="password"
              onChange={handleChange}
              className="h-[30px] bg-none border-b border-black outline-none focus:outline-none"
            />
          </div>
          <div className="w-full flex flex-col gap-5">
            <button
              className="w-full bg-orange-500 text-white rounded p-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Đăng ký"}
            </button>
            <OAuth />
            {errorMessage && <span>{errorMessage}</span>}
          </div>
          <div className="w-full flex justify-center">
            <p className="text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login">
                <span className="text-orange-500 underline">Đăng nhập</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
