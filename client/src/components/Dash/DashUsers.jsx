import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "flowbite-react";
import { toast } from "react-toastify";
import { IoIosWarning } from "react-icons/io";
import { FaTrashAlt, FaInfoCircle, FaLock, FaUnlock } from "react-icons/fa"; // Add lock/unlock icons

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [userIdToShowInfo, setUserIdToShowInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/getusers`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleDeleteUser = async (id) => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("Đã xóa người dùng");
      } else {
        console.log(data.message);
        toast.error("Xóa người dùng thất bại!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBlockUser = async (id, isBlocked) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/block/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isBlocked: !isBlocked } : user
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Không thể thực hiện thao tác này");
    }
  };

  const handleShowUserInfo = (userId) => {
    setUserIdToShowInfo((prevUserId) =>
      prevUserId === userId ? null : userId
    );
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username &&
        user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.phonenumber && user.phonenumber.includes(searchQuery))
  );

  return (
    <div className="flex flex-col gap-5">
      {/*-----SEARCH SECTION-----*/}
      <div className="w-full h-[50px] bg-none flex justify-between items-center">
        <div className="flex gap-2 pl-2 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearch}
            className="h-[30px] border border-black rounded"
          />
        </div>
      </div>
      {/*-----TABLE SECTION-----*/}
      <div>
        {currentUser.isAdmin ? (
          <>
            <div className="h-[400px] bg-white border rounded-t shadow-lg overflow-y-scroll">
              <div className="w-full sticky top-0 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] grid-flow-col px-4 py-3 border-b font-bold bg-gray-50">
                <p>Ảnh</p>
                <p>Tên người dùng</p>
                <p>Thú cưng</p>
                <p>Số điện thoại</p>
                <p>Thao tác</p>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-gray-500">
                    Không tìm thấy kết quả phù hợp
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user._id}>
                    {/* Hàng người dùng */}
                    <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr] grid-flow-col px-4 py-3 border-b">
                      <img
                        src={user.profilePicture}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="flex items-center text-sm">
                        {user.username}
                      </p>
                      <p className="flex items-center text-sm">{user.pet}</p>
                      <p className="flex items-center text-sm">
                        {user.phonenumber}
                      </p>
                      <div className="flex gap-3 items-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold p-2 rounded"
                          onClick={() => handleShowUserInfo(user._id)}
                        >
                          <FaInfoCircle size={15} />
                        </button>

                        {/* Lock/Unlock Button */}
                        <button
                          onClick={() =>
                            handleBlockUser(user._id, user.isBlocked)
                          }
                          className={`${
                            user.isBlocked ? "bg-yellow-400" : "bg-green-500"
                          } hover:bg-green-600 text-white text-sm font-semibold p-2 rounded`}
                        >
                          {user.isBlocked ? (
                            <FaLock size={15} />
                          ) : (
                            <FaUnlock size={15} />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold p-2 rounded"
                        >
                          <FaTrashAlt size={15} />
                        </button>
                      </div>
                    </div>

                    {userIdToShowInfo === user._id && (
                      <div className="w-full grid grid-cols-1 gap-3 px-4 py-3 border-t bg-gray-100">
                        <p className="text-sm">Giới tính: {user.gender}</p>
                        <p className="text-sm">Email: {user.email}</p>
                        <p className="text-sm">Địa chỉ: {user.address}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <p>Chưa có người dùng!</p>
        )}

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
                Bạn có muốn xóa người dùng này?
              </h3>
              <div className="flex gap-4 justify-around">
                <Button
                  color="success"
                  className="px-10"
                  onClick={() => handleDeleteUser(userIdToDelete)}
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

export default DashUsers;
