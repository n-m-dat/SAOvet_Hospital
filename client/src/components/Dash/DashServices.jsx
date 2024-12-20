import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const DashServices = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userServices, setUserServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          `/api/service/getservices?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserServices(data.services);
          setFilteredServices(data.services);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchServices();
    }
  }, [currentUser._id]);

  const handleDeleteService = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/service/deleteservice/${serviceIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserServices((prev) =>
          prev.filter((service) => service._id !== serviceIdToDelete)
        );
        setFilteredServices((prev) =>
          prev.filter((service) => service._id !== serviceIdToDelete)
        );
        toast.success("Đã xóa dịch vụ");
      } else {
        console.log(data.message);
        toast.error("Xóa dịch vụ thất bại!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = userServices.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  };

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
        <div>
          <Link to="/create-service">
            <button className="flex gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white items-center">
              <FaPlus size={14} />
              <div className="h-5 border border-white"></div>
              <span>Thêm dịch vụ</span>
            </button>
          </Link>
        </div>
      </div>

      {/*-----TABLE SECTION-----*/}
      <div>
        {currentUser.isAdmin && filteredServices.length > 0 ? (
          <>
            <div className="h-[400px] bg-white border rounded-t shadow-lg overflow-y-scroll">
              <div className="w-full sticky top-0 grid grid-cols-[1fr_1fr_1fr_0.6fr] grid-flow-col px-4 py-3 border-b font-bold bg-gray-50">
                <p>Ngày cập nhật</p>
                <p>Tên dịch vụ</p>
                <p>Giá</p>
                <p>Thao tác</p>
              </div>

              {filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="w-full grid grid-cols-[1fr_1fr_1fr_0.6fr] grid-flow-col px-4 py-3 border-b"
                >
                  <p>
                    {new Date(service.createdAt).toLocaleDateString("vi-VN")}
                  </p>

                  <Link
                    className="font-medium text-black dark:text-white"
                    to={`/service/${service.slug}`}
                  >
                    <p>{service.serviceName}</p>
                  </Link>

                  <p>{new Intl.NumberFormat("vi-VN").format(service.fee)} đ</p>
                  <div className="flex gap-3 items-center">
                    <Link to={`/update-service/${service._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold p-2 rounded">
                        <FaEdit size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setServiceIdToDelete(service._id);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold p-2 rounded"
                    >
                      <FaTrashAlt size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Chưa có dịch vụ!</p>
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
                Bạn có muốn xóa dịch vụ này?
              </h3>
              <div className="flex justify-around gap-4">
                <Button
                  color="success"
                  className="px-10"
                  onClick={handleDeleteService}
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

export default DashServices;
