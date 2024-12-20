import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeQuantity, toggleSelect } from "../redux/cart/cartSlice";
import { Modal, Button } from "flowbite-react";
import { IoIosWarning } from "react-icons/io";

const CartDetail = () => {
  const carts = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Hàm tính toán giá sau khi giảm cho từng sản phẩm
  const calculateAfterDiscount = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  // Tính tổng tiền của giỏ hàng, chỉ tính các sản phẩm được chọn
  const calculateTotal = () => {
    return carts.reduce((total, item) => {
      if (item.selected) {
        const afterDiscount = calculateAfterDiscount(item.price, item.discount);
        return total + afterDiscount * item.quantity;
      }
      return total;
    }, 0);
  };

  // Hàm thay đổi trạng thái chọn sản phẩm
  const handleToggleSelect = (productName) => {
    dispatch(toggleSelect({ productName }));
  };

  const handleMinusQuantity = (productName, quantity) => {
    if (quantity === 1) {
      setProductToDelete(productName);
      setShowDeleteModal(true); // Hiển thị modal xác nhận
    } else {
      dispatch(changeQuantity({ productName, quantity: quantity - 1 }));
    }
  };

  const handlePlusQuantity = (productName, quantity) => {
    dispatch(changeQuantity({ productName, quantity: quantity + 1 }));
  };

  const handleDeleteProduct = () => {
    dispatch(changeQuantity({ productName: productToDelete, quantity: 0 })); // Đặt số lượng là 0 để xóa sản phẩm khỏi giỏ
    setShowDeleteModal(false);
    setProductToDelete(null); // Reset sản phẩm cần xóa
  };

  const totalAmount = calculateTotal(); // Lấy tổng tiền giỏ hàng

  // Lọc các sản phẩm được chọn
  const selectedItems = carts.filter((item) => item.selected);

  return (
    <div className="w-full h-max bg-white p-5 flex gap-5">
      {/* Phần Giỏ hàng */}
      <div className="w-1/2 h-full">
        <h2 className="text-xl font-bold">Giỏ hàng của bạn</h2>
        <div className="border border-gray-200 my-2"></div>
        <div>
          {carts.map((item, key) => {
            // Tính giá sau giảm
            const afterDiscount = calculateAfterDiscount(
              item.price,
              item.discount
            );

            return (
              <div
                key={key}
                className="bg-gray-100 shadow-md rounded flex my-5"
              >
                {/* Checkbox chọn sản phẩm */}
                <div className="mx-3 flex items-center">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleToggleSelect(item.productName)}
                  />
                </div>
                <div className="flex p-2">
                  <img src={item.image} className="w-40 h-20" />
                </div>
                {/* Details */}
                <div className="w-full flex flex-col justify-between p-2">
                  <h1 className="text-lg">{item.productName}</h1>
                  <div className="w-full flex justify-between">
                    <p>
                      Giá:{" "}
                      <span className="font-semibold text-lg text-orange-500">
                        {new Intl.NumberFormat("vi-VN").format(afterDiscount)} đ
                      </span>
                    </p>
                    <div className="w-40 flex justify-between">
                      <p>Số lượng:</p>
                      <button
                        onClick={() =>
                          handleMinusQuantity(item.productName, item.quantity)
                        }
                        className="bg-gray-200 rounded w-6 h-6"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handlePlusQuantity(item.productName, item.quantity)
                        }
                        className="bg-gray-200 rounded w-6 h-6"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phần Thanh toán */}
      <div className="w-1/2 h-max bg-white border-2 border-gray-300 rounded p-5 flex flex-col justify-between">
        <h1 className="text-2xl font-semibold mb-4">Thanh toán</h1>

        {/* Hiển thị danh sách các sản phẩm được chọn */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Các sản phẩm bạn chọn:</h2>
          <div>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => {
                // Tính giá sau giảm cho từng sản phẩm đã chọn
                const afterDiscount = calculateAfterDiscount(
                  item.price,
                  item.discount
                );
                const totalPrice = afterDiscount * item.quantity;
                return (
                  <div
                    key={index}
                    className="flex justify-between border-b py-2"
                  >
                    <p>
                      {item.productName} (x{item.quantity})
                    </p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat("vi-VN").format(totalPrice)} đ
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Chưa có sản phẩm nào được chọn</p>
            )}
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between font-semibold">
          <h2>Tổng tiền:</h2>
          <h2 className="text-xl text-orange-500">
            {new Intl.NumberFormat("vi-VN").format(totalAmount)} đ
          </h2>
        </div>

        {/* Button thanh toán */}
        <button className="mt-5 bg-orange-500 text-white p-2 rounded-md">
          Thanh toán
        </button>
      </div>

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
            <div className="flex gap-4 justify-around">
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
                onClick={() => setShowDeleteModal(false)}
              >
                KHÔNG
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CartDetail;
