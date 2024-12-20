import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/Dash/DashSidebar";
import DashUsers from "../components/Dash/DashUsers";
import DashProfile from "../components/Dash/DashProfile";
import DashPosts from "../components/Dash/DashPosts";
import DashProducts from "../components/Dash/DashProducts";
import DashServices from "../components/Dash/DashServices";
import DashAppointments from "../components/Dash/DashAppointments";
import DashPromotions from "../components/Dash/DashPromotions";
import Dashboard from "../components/Dash/Dashboard";

const Manage = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex">
      <div>
        <DashSidebar />
      </div>
      <div className="h-screen p-5 flex-1">
        {tab === "dash" && <Dashboard />}
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "products" && <DashProducts />}
        {tab === "promotions" && <DashPromotions />}
        {tab === "services" && <DashServices />}
        {tab === "appointments" && <DashAppointments />}
      </div>
    </div>
  );
};

export default Manage;
