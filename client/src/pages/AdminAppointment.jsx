import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { Modal, Button } from "flowbite-react";
import { toast } from "react-toastify";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/appointments-admin`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        // Sắp xếp cuộc hẹn theo ngày và giờ
        const sortedAppointments = data.appointments.sort((a, b) => {
          const dateA = new Date(a.slotDate + " " + a.slotTime);
          const dateB = new Date(b.slotDate + " " + b.slotTime);
          return dateB - dateA;
        });

        // Đưa các cuộc hẹn đã hủy hoặc hoàn thành xuống dưới cùng
        const updatedAppointments = sortedAppointments.sort((a, b) => {
          if (a.cancelled || a.isCompleted) return 1;
          if (b.cancelled || b.isCompleted) return -1;
          return 0;
        });

        setAppointments(updatedAppointments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const cancelAppointmentAdmin = async () => {
    if (!selectedAppointmentId) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/cancel-appointment-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId: selectedAppointmentId }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchAppointments();
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/complete-appointment`,
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-5xl w-full">
        <div className="mb-5">
          <h1 className="text-3xl font-bold my-3">Quản lý lịch hẹn</h1>
          <hr className="border border-black" />
        </div>

        <div className="h-[400px] shadow-lg bg-white border rounded text-md overflow-y-scroll">
          <div className="grid grid-cols-[0.2fr_1fr_1fr_0.8fr_0.6fr] grid-flow-col p-3 border-b font-bold">
            <p>#</p>
            <p>Họ tên</p>
            <p>Thời gian đặt</p>
            <p>Dịch vụ</p>
            <p>Phí</p>
            <p>Thao tác</p>
          </div>
          {appointments.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[0.2fr_1fr_1fr_0.8fr_0.6fr] grid-flow-col px-4 py-3 border-b items-center"
            >
              <p>{index + 1}</p>
              <p className="overflow-x-scroll">{item.userData.username}</p>
              <p>
                {item.slotDate} - {item.slotTime}
              </p>
              <p>{item.serviceData.serviceName}</p>
              <p>
                {new Intl.NumberFormat("vi-VN").format(item.serviceData.fee)} đ
              </p>
              {item.cancelled ? (
                <p className="text-red-600 ml-6">Đã hủy</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 ml-4">Đã xong</p>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="bg-green-500 hover:scale-105 transition-all duration-300 text-white p-2 rounded"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppointmentId(item._id);
                      setShowModal(true);
                    }}
                    className="bg-red-600 hover:scale-105 transition-all duration-300 text-white p-2 rounded"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Cancel Modal */}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <IoIosWarning className="h-14 w-14 text-yellow-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-black dark:text-gray-400">
                  Bạn có muốn hủy lịch hẹn này?
                </h3>
                <div className="flex justify-around gap-4">
                  <Button
                    color="success"
                    className="px-10"
                    onClick={cancelAppointmentAdmin}
                  >
                    CÓ
                  </Button>
                  <Button
                    color="failure"
                    className="px-10"
                    onClick={() => setShowModal(false)}
                  >
                    KHÔNG
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointment;
