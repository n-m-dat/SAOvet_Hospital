import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import serviceIcon from "../../icons/services.png";
import appointmentIcon from "../../icons/appointments.png";
import userIcon from "../../icons/users.png";
import amountIcon from "../../icons/amount.png";
import productIcon from "../../icons/product.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [quarterlyRevenue, setQuarterlyRevenue] = useState([]);
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/dashboard`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setDashboardData(data.dashData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/revenue`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setRevenue(data.revenue);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchQuarterlyRevenue = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/quarterly-revenue`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setQuarterlyRevenue(data.quarterlyRevenue);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchQuarterlyRevenue();
  }, []);

  const fetchAppointments = async (startDate, endDate) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/appointments-admin?start=${startDate}&end=${endDate}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Hàm nhóm lịch hẹn theo ngày trong tuần
  const groupAppointmentsByDayOfWeek = (appointments) => {
    const grouped = new Array(7).fill(0);
    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const dayOfWeek = date.getDay();
      grouped[dayOfWeek]++;
    });
    return grouped;
  };

  const getWeekRange = () => {
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay(); // Chủ Nhật
    const lastDayOfWeek = firstDayOfWeek + 6; // Thứ Bảy
    const startOfWeek = new Date(today.setDate(firstDayOfWeek));
    const endOfWeek = new Date(today.setDate(lastDayOfWeek));
    const formatDate = (date) => date.toLocaleDateString("vi-VN");
    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  };

  useEffect(() => {
    const { start, end } = getWeekRange();
    setWeekRange({ start, end });
    fetchAppointments(start, end);
  }, []);

  const prepareBarChartData = () => {
    const groupedAppointments = groupAppointmentsByDayOfWeek(appointments);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return {
      labels: days,
      datasets: [
        {
          label: "Số lịch hẹn trong ngày",
          data: groupedAppointments,
          backgroundColor: "#90e0ef",
          borderColor: "#0096c7",
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareRevenueChartData = () => {
    const quarters = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];

    return {
      labels: quarters,
      datasets: [
        {
          label: "Doanh thu theo quý",
          data: quarterlyRevenue,
          backgroundColor: "#70e000",
          borderColor: "#007200",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    dashboardData && (
      <div className="max-w-5xl w-full">
        {/*----- BOX -----*/}
        <div className="flex flex-wrap gap-5">
          <Link to="/manage?tab=appointments">
            <div className="w-60 flex gap-3 items-center bg-white border border-gray-300 shadow-md p-3 rounded-lg">
              <img src={appointmentIcon} className="w-16 h-16" />
              <div>
                <p>Số lịch hẹn</p>
                <p className="text-blue-500 text-xl font-bold">
                  {dashboardData.appointments}
                </p>
              </div>
            </div>
          </Link>

          <Link to="/manage?tab=services">
            <div className="w-60 flex gap-3 items-center bg-white border border-gray-300 shadow-md p-3 rounded-lg">
              <img src={serviceIcon} className="w-16 h-16" />
              <div>
                <p>Dịch vụ</p>
                <p className="text-blue-500 text-xl font-bold">
                  {dashboardData.services}
                </p>
              </div>
            </div>
          </Link>

          <Link to="/manage?tab=users">
            <div className="w-64 flex gap-3 items-center bg-white border border-gray-300 shadow-md p-3 rounded-lg">
              <img src={userIcon} className="w-16 h-16" />
              <div>
                <p>Số lượng người dùng</p>
                <p className="text-blue-500 text-xl font-bold">
                  {dashboardData.users}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/*----- BOX 2 -----*/}
        <div className="mt-5 flex flex-wrap gap-5">
          <Link to="/manage?tab=products">
            <div className="w-60 flex gap-3 items-center bg-white border border-gray-300 shadow-md p-3 rounded-lg">
              <img src={productIcon} className="w-16 h-16" />
              <div>
                <p>Sản phẩm</p>
                <p className="text-blue-500 text-xl font-bold">
                  {dashboardData.products}
                </p>
              </div>
            </div>
          </Link>

          <div className="w-[516px] flex gap-3 items-center bg-white border border-gray-300 shadow-md p-3 rounded-lg">
            <img src={amountIcon} className="w-16 h-16" />
            <div>
              <p>Tổng doanh thu</p>
              <p className="text-green-500 text-xl font-bold">
                {new Intl.NumberFormat("vi-VN").format(revenue)} VNĐ
              </p>
            </div>
          </div>
        </div>

        {/*----- BIỂU ĐỒ -----*/}
        <div className="mt-10">
          {/* Biểu đồ về lịch hẹn trong tuần */}
          <div className="bg-white p-5 rounded-lg shadow-md mt-5">
            <div className="flex flex-col gap-3 mb-3">
              <h2 className="text-xl font-semibold">
                Thống kê lịch hẹn trong tuần
              </h2>
              <span className="text-sm text-gray-600">
                ({weekRange.start} - {weekRange.end})
              </span>
            </div>
            <Bar data={prepareBarChartData()} />
          </div>

          {/* Biểu đồ doanh thu theo quý */}
          <div className="bg-white p-5 rounded-lg shadow-md mt-5">
            <div className="flex flex-col gap-3 mb-3">
              <h2 className="text-xl font-semibold">Doanh thu theo quý</h2>
            </div>
            <Bar data={prepareRevenueChartData()} />
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
