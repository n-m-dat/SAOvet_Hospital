import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaHospitalAlt } from "react-icons/fa";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_bsssvno", "template_gxvcmiu", form.current, {
        publicKey: "Zi8762FfJQ2HNL2dg",
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div>
      <Navbar />
      <div className="relative top-[70px]">
        <div className="flex w-full min-h-screen justify-center">
          <div className="max-w-5xl w-full h-max bg-gradient-to-bl from-slate-900 via-blue-800 to-slate-900 rounded-lg py-5 px-10 shadow-md flex flex-col gap-10">
            <div className="space-y-3">
              <h1 className="text-center text-3xl text-white font-bold capitalize">
                Liên hệ với chúng tôi
              </h1>
              <p className="text-center text-gray-100">
                Điều trị bằng trái tim, chăm sóc bằng cả tấm lòng. Tất cả vì sức
                khỏe thú cưng.
              </p>
            </div>
            <div className="w-full flex items-center">
              {/* LEFT SIDE */}
              <div className="w-1/2 flex flex-col gap-5">
                <div className="flex flex-col gap-5 text-white">
                  <div className="flex flex-col gap-3">
                    <h1 className="flex gap-2 items-center text-md font-bold text-orange-400">
                      <MdEmail />
                      Email:
                    </h1>
                    <p className="pl-6">saovethospital@gmail.com</p>
                  </div>
                  <h1 className="flex gap-2 items-center text-md font-semibold text-orange-400">
                    <FaPhoneVolume />
                    Hotline
                  </h1>
                  <ul className="flex flex-col gap-3 pl-5">
                    <li>Hà Nội: 1900 9100</li>
                    <li>TP.HCM: 0706 405 060</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-5 text-white">
                  <h1 className="flex gap-2 items-center text-md font-semibold text-orange-400">
                    <FaHospitalAlt />
                    Hà Nội
                  </h1>
                  <ul className="flex flex-col gap-3 pl-6">
                    <li>Địa chỉ: 28 Xuân Diệu, Quảng An, Tây Hồ, Hà Nội</li>
                  </ul>
                  <h1 className="flex gap-2 items-center text-md font-semibold text-orange-400">
                    <FaHospitalAlt />
                    <span>Thành phố Hồ Chí Minh</span>
                  </h1>
                  <ul className="flex flex-col gap-3 pl-6">
                    <li>Địa chỉ: 418 Hồng Bàng, P.16, Q.11, TP.HCM</li>
                  </ul>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="w-1/2">
                <form
                  ref={form}
                  onSubmit={sendEmail}
                  className="w-full h-max flex flex-col gap-5 bg-white rounded-lg p-5 shadow-md"
                >
                  <input
                    type="text"
                    placeholder="Họ tên"
                    required
                    name="from_name"
                    className="w-full rounded-md"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="from_email"
                    className="w-full rounded-md"
                  />

                  <textarea
                    placeholder="Nhập nội dung"
                    required
                    name="message"
                    className="w-full h-[150px] rounded-md resize-none"
                  />

                  <button
                    type="submit"
                    className="bg-orange-500 py-3 rounded-md text-white"
                  >
                    Gửi yêu cầu
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;

{
  /*
    <form
                ref={form}
                onSubmit={sendEmail}
                className="max-w-[500px] w-full h-max flex flex-col gap-5 bg-white rounded-lg p-5 shadow-md"
              >
                <h2 className="text-3xl font-bold">Contact Form</h2>
                <div className="flex flex-col gap-2">
                  <p>Full Name</p>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    name="from_name"
                    className="w-full rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p>Email Address</p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    name="from_email"
                    className="w-full rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p>Your Message</p>
                  <textarea
                    placeholder="Enter your message"
                    required
                    name="message"
                    className="w-full h-[200px] rounded-md resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 py-3 rounded-md text-white"
                >
                  Send Message
                </button>
              </form>
  */
}
