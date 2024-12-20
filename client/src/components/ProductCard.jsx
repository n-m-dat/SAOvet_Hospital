import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";
import { BsCartPlus } from "react-icons/bs";

const ProductCard = (props) => {
  const { title, price, discount, image, slug } = props.data;
  const carts = useSelector((store) => store.cart.items);
  console.log(carts);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productName: title,
        image: image,
        price: price,
        discount: discount,
        quantity: 1,
      })
    );
  };

  // tính giá sau khi giảm (nếu có)
  const afterDiscount = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <div className="relative border w-[250px] h-[350] flex flex-col justify-between border-gray-400 overflow-hidden rounded-[10px] bg-white">
      
      {/* Nếu có giảm giá thì hiển thị thẻ giảm giá */}
      {discount > 0 && (
        <div className="absolute py-1 px-5 right-0 top-5 rounded-l bg-orange-500 text-white text-lg">
          -{discount}%
        </div>
      )}
      {/*----- IMAGE -----*/}
      <div className="px-2 pt-2">
        <img
          src={image}
          alt="product cover"
          className="w-full min-h-[200px] rounded-[10px] z-20"
        />
      </div>

      <div className="w-full p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{title}</p>
        <div className="flex gap-2 items-center">
          {discount > 0 && (
            <>
              <span className="text-sm line-through text-gray-500">
                {new Intl.NumberFormat("vi-VN").format(price)} đ
              </span>
              <span className="text-xl text-orange-500">{new Intl.NumberFormat("vi-VN").format(afterDiscount)}đ</span>
            </>
          )}
          {discount === 0 && (
            <span className="text-xl">{new Intl.NumberFormat("vi-VN").format(price)}đ</span>
          )}
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex gap-2">
          <Link
            to={`/product/${slug}`}
            className="flex-1 p-2 bg-blue-500 hover:scale-105 transition-all duration-300 text-white text-center rounded-lg"
          >
            Chi Tiết
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex flex-1 justify-center p-2 bg-orange-500 hover:scale-105 transition-all duration-300 text-white rounded-lg"
          >
            <BsCartPlus size={26} />
          </button>
        </div>
    </div>
  );
};

ProductCard.propTypes = {
  data: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
