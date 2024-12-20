import logo from "../images/logo.png";
import { FaClock, FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import facebook from "../icons/facebook.png";
import youtube from "../icons/youtube.png";
import tiktok from "../icons/tiktok.png";

const Footer = () => {
  return (
    <div className="flex flex-col gap-10 bg-white pt-10 pb-5 px-10 mt-10">
      <div className="flex justify-between">
        {/* Left Side */}
        <div className="flex flex-col gap-5">
          <div className="flex gap-2 items-center">
            <img src={logo} className="w-16 h-14" />
            <h1 className="text-4xl font-semibold">
              <span className="text-blue-800 font-title">SAO</span>
              <span className="text-orange-500 font-title">vet</span>
            </h1>
          </div>
          <p>
            Điều trị bằng trái tim, chăm sóc bằng cả tấm lòng.
            <br />
            Tất cả vì sức khỏe thú cưng.
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="flex gap-2 items-center font-semibold">
              <FaClock />
              Thời gian làm việc
            </h1>
            <p>- Từ 8h30 đến 20h30 (cả tuần)</p>
            <p>- Có xe cấp cứu đưa đón tận nhà xuyên tỉnh</p>
          </div>
        </div>
        {/* Right Side*/}
        <div className="flex gap-20">
          <div className="flex flex-col gap-5">
            <h1 className="text-md font-semibold">Theo dõi chúng tôi</h1>
            <ul className="flex flex-col gap-3">
              <li className="flex gap-3 items-center hover:underline">
                <img src={facebook} className="w-5 h-5" />
                <a
                  href="https://www.facebook.com/profile.php?id=100087656670235"
                  target="_blank"
                >
                  SAOvet Sài Gòn
                </a>
              </li>
              <li className="flex gap-3 items-center hover:underline">
                <img src={facebook} className="w-5 h-5" />
                <a
                  href="https://www.facebook.com/profile.php?id=100092098006026"
                  target="_blank"
                >
                  SAOvet Hà Nội
                </a>
              </li>
              <li className="flex gap-3 items-center hover:underline">
                <img src={youtube} className="w-5 h-5" />
                <a
                  href="https://www.youtube.com/@SaovetHospital-BenhVienThuY"
                  target="_blank"
                >
                  Youtube
                </a>
              </li>
              <li className="flex gap-3 items-center hover:underline">
                <img src={tiktok} className="w-5 h-5" />
                <a
                  href="https://www.tiktok.com/@saovet.tw?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h1
              className="flex gap-2 items-center
             text-md font-semibold"
            >
              <MdEmail />
              Email
            </h1>
            <ul className="flex flex-col gap-3">
              <li>saovethospital@gmail.com</li>
            </ul>
            <h1 className="flex gap-2 items-center text-md font-semibold">
              <FaPhoneVolume />
              Hotline
            </h1>
            <ul className="flex flex-col gap-3">
              <li>+ Hà Nội: 1900 9100</li>
              <li>+ TP.HCM: 0706 405 060</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-3 flex justify-start">
        <p className="text-sm text-gray-500">
          Copyright © 2024 SAOvet Veterinary Hospital
        </p>
      </div>
    </div>
  );
};

export default Footer;
