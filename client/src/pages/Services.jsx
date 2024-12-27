import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import service_1 from "../images/service_1.jpg";
import service_2 from "../images/service_2.jpg";
import { Link } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/service/getservices`);
      const data = await res.json();
      setServices(data.services);
    };
    fetchServices();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="relative top-[70px]">
        <div className="w-full min-h-screen">
          <h1 className="text-center text-3xl font-bold my-5">
            DỊCH VỤ TẠI BỆNH VIỆN THÚ Y{" "}
            <span className="text-blue-800">SAO</span>
            <span className="text-orange-500">VET</span>
          </h1>
          {/*----- SERVICES BOX -----*/}
          <div className="w-full flex justify-center p-5">
            <div className="grid grid-cols-3 gap-10">
              {services.map((item, key) => {
                return (
                  <Link key={key} to={`/service/${item.slug}`}>
                    <div className="bg-white border-2 border-blue-500 p-5 w-80 h-52 rounded-lg shadow-md hover:translate-y-[-10px] transition-all duration-500 cursor-pointer space-y-3">
                      {" "}
                      <h1 className="uppercase text-lg text-blue-800 font-bold">
                        {item.serviceName}
                      </h1>
                      <p>{item.shortDesc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          {/*------------------------------------------------------------*/}
          <div className="max-w-5xl w-full flex gap-5 justify-between mx-auto mt-5">
            <div className="w-1/3 flex flex-col gap-5 justify-center px-3">
              <h1 className="text-lg font-bold uppercase text-blue-800">
                Chụp X-Quang
              </h1>
              <p className="text-gray-500">
                Với trang thiết bị tiên tiến và đội ngũ bác sĩ giàu kinh nghiệm,
                chúng tôi cam kết mang đến kết quả nhanh chóng và đáng tin cậy.
                <br />
                Dịch vụ chụp X-quang của chúng tôi không chỉ giúp phát hiện bệnh
                lý mà còn hỗ trợ trong việc theo dõi quá trình điều trị.
              </p>
              <button className="w-[150px] px-5 py-2 bg-orange-500 rounded text-white shadow-lg hover:translate-y-[-5px] transition-all duration-500">
                Đặt lịch ngay
              </button>
            </div>
            <div className="p-5">
              <img src={service_1} className="w-[720px] rounded-lg" />
            </div>
          </div>
          {/*------------------------------------------------------------*/}
          <div className="max-w-5xl w-full flex gap-5 justify-between mx-auto mt-5">
            <div className="p-5">
              <img src={service_2} className="w-[720px] rounded-lg" />
            </div>
            <div className="w-1/3 flex flex-col gap-5 justify-center px-3">
              <h1 className="text-lg font-bold uppercase text-blue-800">
                Spa - làm đẹp
              </h1>
              <p className="text-gray-500">
                Chúng tôi cung cấp dịch vụ chăm sóc toàn diện cho thú cưng của
                bạn, bao gồm tắm rửa, cắt tỉa lông, và làm sạch tai.
                <br /> Đội ngũ chuyên viên giàu kinh nghiệm và yêu thú cưng của
                chúng tôi sẽ đảm bảo rằng bạn đồng hành của bạn luôn sạch sẽ,
                khỏe mạnh và thoải mái.
              </p>
              <button className="w-[150px] px-5 py-2 bg-orange-500 rounded text-white shadow-lg hover:translate-y-[-5px] transition-all duration-500">
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Services;
