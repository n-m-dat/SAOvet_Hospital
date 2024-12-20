import arrow from "../../icons/arrow.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../redux/user/userSlice";
import {
  FaUserEdit,
  FaChartBar,
  FaUsers,
  FaHome,
  FaHandHoldingMedical,
  FaClipboardList,
} from "react-icons/fa";
import { LuGanttChartSquare } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { Modal, Button } from "flowbite-react";

const DashSidebar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await fetch("api/user/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div
      className={`${
        openSidebar ? "w-60" : "w-20"
      } duration-300 h-screen p-5 pt-8 bg-blue-500 rounded-r-lg relative flex flex-col justify-between`}
    >
      <img
        src={arrow}
        className={`w-7 absolute top-5 -right-3 bg-white border-2 border-blue-500 rounded-full cursor-pointer ${
          !openSidebar && "rotate-180"
        }`}
        onClick={() => setOpenSidebar(!openSidebar)}
      />

      {/*-----SIDEBAR ITEMS-----*/}
      {/* Items */}
      <div className="overflow-y-scroll">
        <ul className="flex flex-col gap-3">
          {/* Profile */}
          <Link to="/manage?tab=profile">
            <li
              title="Tài khoản"
              className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
            >
              <FaUserEdit size={24} />
              <span
                className={`${
                  !openSidebar && "hidden"
                } origin-left duration-300 font-medium`}
              >
                Tài khoản
              </span>
            </li>
          </Link>

          {/* Dashboard */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=dash">
              <li
                title="Thống kê"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <FaChartBar size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Thống kê
                </span>
              </li>
            </Link>
          )}

          {/* Appointments */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=appointments">
              <li
                title="Lịch hẹn"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <FaClipboardList size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Lịch hẹn
                </span>
              </li>
            </Link>
          )}

          {/* Users */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=users">
              <li
                title="Người dùng"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <FaUsers size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Người dùng
                </span>
              </li>
            </Link>
          )}

          {/* Posts */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=posts">
              <li
                title="Bài viết"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <LuGanttChartSquare size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Bài viết
                </span>
              </li>
            </Link>
          )}

          {/* Products */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=products">
              <li
                title="Sản phẩm"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <FaBoxOpen size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Sản phẩm
                </span>
              </li>
            </Link>
          )}

          {/* Promotions */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=promotions">
              <li
                title="Khuyến mãi"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <MdDiscount size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Khuyến mãi
                </span>
              </li>
            </Link>
          )}

          {/* Services */}
          {currentUser.isAdmin && (
            <Link to="/manage?tab=services">
              <li
                title="Dịch vụ"
                className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
              >
                <FaHandHoldingMedical size={24} />
                <span
                  className={`${
                    !openSidebar && "hidden"
                  } origin-left duration-300 font-medium`}
                >
                  Dịch vụ
                </span>
              </li>
            </Link>
          )}
        </ul>
      </div>

      <div>
        <div className="border border-white my-5"></div>
        <ul className="flex flex-col gap-3">
          <Link to="/">
            <li className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400">
              <FaHome size={24} />
              <span
                className={`${
                  !openSidebar && "hidden"
                } origin-left duration-300 font-medium`}
              >
                Trang chủ
              </span>
            </li>
          </Link>

          <li
            className="flex gap-x-2 p-2 cursor-pointer text-white items-center rounded hover:bg-blue-400"
            onClick={() => setShowModal(true)}
          >
            <IoLogOutOutline size={24} />
            <span
              className={`${
                !openSidebar && "hidden"
              } origin-left duration-300 font-medium`}
            >
              Đăng xuất
            </span>
          </li>
        </ul>
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <IoLogOutOutline className="h-14 w-14 text-black dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-black dark:text-gray-400">
                Bạn có muốn đăng xuất?
              </h3>
              <div className="flex justify-around gap-4">
                <Button
                  color="success"
                  className="px-10"
                  onClick={handleLogout}
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
  );
};

export default DashSidebar;
