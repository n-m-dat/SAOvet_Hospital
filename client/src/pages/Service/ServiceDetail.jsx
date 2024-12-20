import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ServiceDetail = () => {
  const { serviceSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [serviceSlots, setServiceSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const currentUser = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();

  const dayOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [recentServices, setRecentServices] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/service/getservices?slug=${serviceSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setServiceInfo(data.services[0]);
          setLoading(false);
          setError(false);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceSlug]);

  if (serviceInfo) {
    console.log(serviceInfo.slots_booked); // Kiểm tra thuộc tính
  }

  useEffect(() => {
    try {
      const fetchRecentServices = async () => {
        const res = await fetch("/api/service/getservices");
        const data = await res.json();
        if (res.ok) {
          setRecentServices(data.services);
        }
      };
      fetchRecentServices();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const getAvailableSlots = async () => {
    setServiceSlots([]);

    // lấy ngày hiện tại
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // thời gian kết thúc
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // cài đặt giờ
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(8);
        currentDate.setMinutes(30);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // thêm slot vào chuỗi
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        // tăng thời gian 30 phút
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setServiceSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!currentUser) {
      toast.warn("Đăng nhập để đặt lịch hẹn!");
      return navigate("/login");
    }
    try {
      const date = serviceSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day} / ${month} / ${year}`;

      const res = await fetch("/api/appointment/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          serviceId: serviceInfo._id,
          slotDate,
          slotTime,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Đặt lịch hẹn thành công!");
        navigate("/my-appointments");
      } else {
        toast.error(data.message || "Đặt lịch hẹn thất bại!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAvailableSlots();
  }, [serviceInfo]);

  useEffect(() => {
    console.log(serviceSlots);
  }, [serviceSlots]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="relative top-[80px]">
        <div className="w-full min-h-screen flex justify-center">
          <div className="max-w-5xl w-full h-max">
            {/*----- TITLE AND CONTENT -----*/}
            <div className="w-full h-max">
              <h1 className="text-3xl text-center text-blue-500 font-semibold uppercase">
                Dịch vụ {serviceInfo.serviceName}
              </h1>
              <hr className="w-40 border-[1.5px] border-blue-500 rounded-full mx-auto mt-2" />
              <div
                className="w-full text-lg text-justify my-5"
                dangerouslySetInnerHTML={{
                  __html: serviceInfo && serviceInfo.description,
                }}
              ></div>
              <p className="text-xl">
                Giá dịch vụ:{" "}
                <span className="text-orange-500">
                  {new Intl.NumberFormat("vi-VN").format(serviceInfo.fee)} đ
                </span>
              </p>
            </div>

            {/*----- BOOKING SLOTS -----*/}
            <div>
              <h1 className="text-center text-3xl text-blue-500 font-semibold capitalize">
                Đặt lịch hẹn
              </h1>
              <hr className="w-20 border-[1.5px] border-blue-500 rounded-full mx-auto mt-2" />

              {/* DATE */}
              <div className="w-full flex flex-col gap-3 my-5">
                <p className="text-lg">Chọn ngày:</p>
                <div className="w-full flex gap-3">
                  {serviceSlots.length &&
                    serviceSlots.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setSlotIndex(index)}
                        className={`min-w-20 text-center py-5 px-3 rounded capitalize cursor-pointer ${
                          slotIndex === index
                            ? "border-2 bg-orange-500 border-orange-500 text-white"
                            : "border-2 bg-white border-orange-500"
                        }`}
                      >
                        <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                        <p className="text-xl font-semibold">
                          {item[0] && item[0].datetime.getDate()}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* TIME */}
              <div className="w-full flex flex-col gap-3 my-5">
                <p className="text-lg">Chọn thời gian:</p>
                <div className="w-max grid grid-cols-5 gap-5">
                  {serviceSlots.length &&
                    serviceSlots[slotIndex].map((item, index) => (
                      <p
                        key={index}
                        onClick={() => setSlotTime(item.time)}
                        className={`text-sm flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                          item.time === slotTime
                            ? "border-2 border-blue-500 text-white bg-blue-500"
                            : "border-2 border-blue-500 text-blue-800 bg-white"
                        }`}
                      >
                        {item.time.toLowerCase()}
                      </p>
                    ))}
                </div>
              </div>
              {/* Booking Button */}
              <button
                onClick={bookAppointment}
                className="shadow-lg bg-blue-500 text-white px-20 py-2 rounded mt-5 hover:scale-105 transition-all duration-300"
              >
                Đặt ngay
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ServiceDetail;
