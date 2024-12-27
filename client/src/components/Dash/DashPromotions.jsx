import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";
import { FaTrashAlt, FaEdit, FaTag } from "react-icons/fa";

const DashPromotions = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discount, setDiscount] = useState(""); // Giá trị giảm giá
  const [selectedCategory, setSelectedCategory] = useState(""); // Danh mục
  const [selectedBrand, setSelectedBrand] = useState(""); // Nhãn hàng
  const [selectedPet, setSelectedPet] = useState(""); // Thú cưng
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc

  // thêm dấu chấm vào giá
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // tính giá sau khi giảm
  const afterDiscount = (price, discount) => {
    return price - (price * discount) / 100;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?userId=${
            currentUser._id
          }`,
          { method: "GET", credentials: "include" }
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

  // Xử lý áp dụng giảm giá
  const handleApplyDiscount = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
      return;
    }

    setShowDiscountModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/adjust-discount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            discount,
            category: selectedCategory || undefined,
            brand: selectedBrand || undefined,
            pet: selectedPet || undefined,
            startDate,
            endDate,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        alert(data.message); // Hiển thị thông báo thành công
        const updatedProducts = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?userId=${
            currentUser._id
          }`,
          { method: "GET", credentials: "include" }
        ).then((res) => res.json());
        setUserProducts(updatedProducts.products);
        setFilteredProducts(updatedProducts.products);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
        setFilteredProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
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
        <button
          onClick={() => setShowDiscountModal(true)}
          className="flex gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white items-center"
        >
          <FaTag size={14} />
          <span>Giảm giá</span>
        </button>
      </div>

      {/*-----TABLE SECTION-----*/}
      <div>
        {currentUser.isAdmin && filteredProducts.length > 0 ? (
          <>
            <div className="h-[400px] bg-white border rounded-t shadow-lg overflow-y-scroll">
              <div className="w-full sticky top-0 grid grid-cols-[0.7fr_2fr_0.8fr_0.8fr_0.8fr_0.6fr] grid-flow-col px-4 py-3 border-b font-bold bg-gray-50">
                <p>Ảnh</p>
                <p>Tên sản phẩm</p>
                <p>Đơn giá</p>
                <p>Giảm giá</p>
                <p>Sau giảm giá</p>
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
                  <p className="flex items-center text-sm">
                    {formatPrice(product.price)} đ
                  </p>
                  <p className="flex items-center text-sm">
                    {product.discount}%
                  </p>
                  <p className="flex items-center text-sm">
                    {formatPrice(
                      afterDiscount(product.price, product.discount)
                    )}{" "}
                    đ
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

        {/*-----DISCOUNT MODAL-----*/}
        <Modal
          show={showDiscountModal}
          onClose={() => setShowDiscountModal(false)}
          popup
          size="md"
        >
          <Modal.Header className="ml-3">Áp dụng giảm giá</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label className="block">Giảm giá (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block">Chọn thú cưng</label>
                <select
                  className="w-full rounded"
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Chó">Chó</option>
                  <option value="Mèo">Mèo</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block">Chọn danh mục</label>
                <select
                  className="w-full rounded"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Thức ăn">Thức ăn</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block">Chọn nhãn hàng</label>
                <select
                  className="w-full rounded"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Royal Canin">Royal Canin</option>
                  <option value="Whiskas">Whiskas</option>
                  <option value="Pedigree">Pedigree</option>
                  <option value="SmartHeart">SmartHeart</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block">Ngày kết thúc</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="flex justify-around gap-4 mt-4">
                <Button
                  color="success"
                  className="px-10"
                  onClick={handleApplyDiscount}
                >
                  Áp dụng
                </Button>
                <Button
                  color="failure"
                  className="px-10"
                  onClick={() => setShowDiscountModal(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

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

export default DashPromotions;
