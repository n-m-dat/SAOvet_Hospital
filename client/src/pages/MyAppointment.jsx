import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointment/get-appointments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/appointment/cancel-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchAppointments();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative top-[70px] w-full flex justify-center p-5">
        <div className="max-w-5xl w-full h-max flex flex-col gap-3">
          {/*----- TITLE -----*/}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Lịch hẹn của tôi</h1>
            <hr className="w-full border border-black" />
          </div>
          {/*----- APPOINTMENTS -----*/}
          {appointments.map((item, index) => (
            <div
              key={index}
              className="w-full h-max shadow-lg bg-white border border-gray-300 rounded p-3 flex justify-between"
            >
              <div className="flex gap-5 items-center">
                <h1>
                  <span className="font-bold">Dịch vụ:</span>{" "}
                  {item.serviceData.serviceName}
                </h1>
                <p>
                  <span className="font-bold">Ngày:</span> {item.slotDate}
                </p>
                <p>
                  <span className="font-bold">Thời gian:</span> {item.slotTime}
                </p>
                <p>
                  <span className="font-bold">Phí:</span>{" "}
                  {new Intl.NumberFormat("vi-VN").format(item.serviceData.fee)}đ
                </p>
              </div>
              <div className="flex gap-2 justify-end items-center">
                {!item.cancelled && (
                  <button className="text-sm text-gray-500 border border-gray-500 px-5 py-2 rounded hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300">
                    Thanh toán online
                  </button>
                )}
                {!item.cancelled && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-gray-500 border border-gray-500 px-5 py-2 rounded hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                  >
                    Hủy lịch hẹn
                  </button>
                )}
                {item.cancelled && (
                  <p className="text-sm text-red-600">Đã hủy</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAppointment;
