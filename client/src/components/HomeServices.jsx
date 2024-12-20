import { Link } from "react-router-dom";
import service_1 from "../icons/service_1.png";
import service_2 from "../icons/service_2.png";
import service_3 from "../icons/service_3.png";
import service_4 from "../icons/service_4.png";
import service_5 from "../icons/service_5.png";
import service_6 from "../icons/service_6.png";
import { MdPets } from "react-icons/md";

const HomeServices = () => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center my-10">
      <h1 className="text-3xl text-blue-800 font-bold flex flex-col gap-2 items-center justify-center capitalize">
        Dịch vụ của chúng tôi
        <MdPets size={40} className="text-orange-500" />
      </h1>
      <Link to="/services" onClick={() => scrollTo(0, 0)}>
        <div className="flex gap-16">
          {/*---------*/}
          <div className="flex flex-col gap-3 items-center hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <img
              src={service_1}
              className="w-20 h-20 object-cover border border-black rounded-full p-2 bg-white"
            />
            <p className="font-semibold">Xét Nghiệm</p>
          </div>
          {/*---------*/}
          <div className="flex flex-col gap-3 items-center hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <img
              src={service_2}
              className="w-20 h-20 object-cover border border-black rounded-full p-2 bg-white"
            />
            <p className="font-semibold">Phẫu Thuật</p>
          </div>
          {/*---------*/}
          <div className="flex flex-col gap-3 items-center hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <img
              src={service_3}
              className="w-20 h-20 object-cover border border-black rounded-full p-2 bg-white"
            />
            <p className="font-semibold">Siêu Âm</p>
          </div>
          {/*---------*/}
          <div className="flex flex-col gap-3 items-center hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <img
              src={service_4}
              className="w-20 h-20 object-cover border border-black rounded-full p-2 bg-white"
            />
            <p className="font-semibold">Chụp X-Quang</p>
          </div>
          {/*---------*/}
          <div className="flex flex-col gap-3 items-center hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <img
              src={service_5}
              className="w-20 h-20 object-cover border border-black rounded-full p-2 bg-white"
            />
            <p className="font-semibold">Làm Đẹp</p>
          </div>
          {/*---------*/}
          <div className="flex flex-col gap-3 items-center hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <img
              src={service_6}
              className="w-20 h-20 object-cover border border-black rounded-full p-2 bg-white"
            />
            <p className="font-semibold">Lưu Trú</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeServices;
