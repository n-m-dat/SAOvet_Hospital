import { useRef, useState } from "react";
import { FaUser, FaClipboardList } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";

const DropdownProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [openProfile, setOpenProfile] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef();
  const imgRef = useRef();

  window.addEventListener("click", (e) => {
    if (e.target !== menuRef.current && e.target !== imgRef.current) {
      setOpenProfile(false);
    }
  });

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
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
    <div>
      <div className="relative">
        <img
          ref={imgRef}
          src={currentUser.profilePicture}
          alt="user"
          onClick={() => setOpenProfile(!openProfile)}
          className="w-9 h-9 object-cover border-2 border-blue-500 rounded-full cursor-pointer"
        />
      </div>
      {openProfile && (
        <div
          ref={menuRef}
          className="bg-white border-2 border-gray-500 rounded p-2 w-[150px] shadow-xl absolute right-2 top-[60px]"
        >
          <ul>
            <li className="p-2 text-[16px] text-black cursor-pointer hover:bg-gray-200 rounded">
              <Link
                to="/manage?tab=profile"
                className="flex gap-2 items-center"
              >
                <FaUser />
                Tài khoản
              </Link>
            </li>

            <li className="p-2 text-[16px] text-black cursor-pointer hover:bg-gray-100 rounded">
              {currentUser.isAdmin ? (
                <Link
                  to="/admin-appointments"
                  className="flex gap-2 items-center"
                >
                  <FaClipboardList />
                  Lịch hẹn
                </Link>
              ) : (
                <Link to="/my-appointments" className="flex gap-2 items-center">
                  <FaClipboardList />
                  Lịch hẹn
                </Link>
              )}
            </li>
            <li
              className="p-2 text-[16px] text-black cursor-pointer hover:bg-gray-200 rounded"
              onClick={handleLogout}
            >
              <Link to="" className="flex gap-2 items-center">
                <MdLogout />
                Đăng xuất
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownProfile;
