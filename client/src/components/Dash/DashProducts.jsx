import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const DashProducts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/product/getproducts?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchProducts();
    }
  }, [currentUser._id]);

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
        setFilteredProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
        toast.success("Đã xóa sản phẩm");
      } else {
        console.log(data.message);
        toast.error("Xóa sản phẩm thất bại!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = userProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
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
          <Link to="/create-product">
            <button className="flex gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white items-center">
              <FaPlus size={14} />
              <div className="h-5 border border-white"></div>
              <span>Thêm sản phẩm</span>
            </button>
          </Link>
        </div>
      </div>

      {/*-----TABLE SECTION-----*/}
      <div>
        {currentUser.isAdmin && filteredProducts.length > 0 ? (
          <>
            <div className="h-[400px] bg-white border rounded-t shadow-lg overflow-y-scroll">
              <div className="w-full sticky top-0 grid grid-cols-[0.7fr_2fr_0.8fr_0.8fr_0.8fr_0.6fr] grid-flow-col px-4 py-3 border-b font-bold bg-gray-50">
                <p>Ảnh</p>
                <p>Tên sản phẩm</p>
                <p>Thú cưng</p>
                <p>Hãng</p>
                <p>Danh mục</p>
                <p>Thao tác</p>
              </div>

              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="w-full grid grid-cols-[0.7fr_2fr_0.8fr_0.8fr_0.8fr_0.6fr] grid-flow-col px-4 py-3 border-b"
                >
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 object-cover"
                    />
                  </Link>
                  <Link
                    to={`/product/${product.slug}`}
                    className="flex items-center text-sm hover:underline"
                  >
                    <p>{product.title}</p>
                  </Link>
                  <p className="flex items-center text-sm">{product.pet}</p>
                  <p className="flex items-center text-sm">{product.brand}</p>
                  <p className="flex items-center text-sm">
                    {product.category}
                  </p>
                  <div className="flex gap-3 items-center">
                    <Link to={`/update-product/${product._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold p-2 rounded">
                        <FaEdit size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setProductIdToDelete(product._id);
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
          <p>Chưa có sản phẩm!</p>
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
                Bạn có muốn xóa sản phẩm này?
              </h3>
              <div className="flex justify-around gap-4">
                <Button
                  color="success"
                  className="px-10"
                  onClick={handleDeleteProduct}
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

export default DashProducts;
