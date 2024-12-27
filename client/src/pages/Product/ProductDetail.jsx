import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart/cartSlice";
import Slider from "react-slick";

import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { BsCartPlus } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

const ProductDetail = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);
  const [product, setProduct] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [recentProducts, setRecentProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?slug=${productSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setProduct(data.products[0]);
          setSelectedImage(data.products[0].image[0]);
          setLoading(false);
          setError(false);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug]);

  useEffect(() => {
    try {
      const fetchRecentProducts = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentProducts(data.products);
        }
      };
      fetchRecentProducts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  const handleMinusQuantity = () => {
    setQuantity(quantity - 1 < 1 ? 1 : quantity - 1);
  };

  const handlePlusQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productName: product.title,
        image: selectedImage,
        price: product.price,
        discount: product.discount,
        quantity: quantity,
      })
    );
  };

  const getDiscountedPrice = (price, discount) => {
    // Nếu có giảm giá (discount > 0)
    if (discount > 0) {
      return price - (price * discount) / 100;
    }
    return price; // Nếu không có giảm giá, trả về giá gốc
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <div>
      <Navbar />
      <div className="relative top-[70px]">
        {/*-----BACK BUTTON-----*/}
        {currentUser && currentUser.isAdmin && (
          <div className="h-[60px] flex justify-between items-center px-3 shadow-sm">
            <button
              onClick={() => navigate("/manage?tab=products")}
              className="flex gap-2 px-5 py-1 border-2 border-blue-500 text-blue-500 hover:scale-105 transition-all duration-300 rounded-full items-center"
            >
              <HiOutlineArrowNarrowLeft size={18} />
              Quản lý sản phẩm
            </button>
            <button
              onClick={() => navigate(`/update-product/${product._id}`)}
              className="flex gap-2 px-5 py-1 border-2 border-blue-500 text-blue-500 hover:scale-105 transition-all duration-300 rounded-full items-center"
            >
              <FaEdit size={18} /> Cập nhật sản phẩm này
            </button>
          </div>
        )}

        <div className="w-full min-h-[100vh]">
          {/*-----PRODUCT DETAIL-----*/}
          <div className="w-full h-max bg-white flex gap-10 px-5">
            {/* Image */}
            <div className="w-[340px]">
              <div className="flex justify-start">
                <img
                  src={selectedImage}
                  alt={product && product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-5">
                <Slider {...settings}>
                  {product &&
                    product.image.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`product-thumbnail-${index}`}
                          className="w-20 h-16 object-cover cursor-pointer border border-gray-300 rounded"
                        />
                      </div>
                    ))}
                </Slider>
              </div>
            </div>

            {/* INFORMATION */}
            <div className="w-[720px] bg-white p-5 flex flex-col gap-5">
              {/* Title */}
              <h1 className="text-2xl font-semibold">
                {product && product.title}
              </h1>
              <div className="border border-gray-300"></div>
              {/* Brand */}
              <p className="text-xl">Nhãn hàng: {product && product.brand}</p>
              {/* Price */}
              <div className="flex gap-3 items-center">
                {product && product.discount > 0 ? (
                  <>
                    <p className="text-xl line-through text-gray-500">
                      {formatPrice(product.price)} đ
                    </p>
                    <p className="text-3xl text-red-600">
                      {formatPrice(
                        getDiscountedPrice(product.price, product.discount)
                      )}{" "}
                      đ
                    </p>
                    <p className="text-sm bg-green-500 text-white rounded px-2 py-1">
                      -{product.discount}%
                    </p>
                  </>
                ) : (
                  <p className="text-3xl text-red-600">
                    {product && formatPrice(product.price)} đ
                  </p>
                )}
              </div>
              {/* Add to cart button */}
              <div className="flex gap-5">
                <div className="flex gap-3 justify-center items-center">
                  <button
                    onClick={handleMinusQuantity}
                    className="w-10 h-full bg-gray-200 font-bold text-xl flex justify-center items-center rounded"
                  >
                    -
                  </button>
                  <span className="w-10 h-full text-xl font-bold flex justify-center items-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handlePlusQuantity}
                    className="w-10 h-full bg-gray-200 font-bold text-xl flex justify-center items-center rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-[180px] flex gap-2 justify-center py-2 rounded items-center text-white bg-orange-500 border-2 border-orange-500 hover:scale-105 transition-all duration-300"
                >
                  <BsCartPlus size={20} />
                  Thêm vào giỏ hàng
                </button>
              </div>
              {/* Description */}
              <div
                className="product-content text-lg mt-10"
                dangerouslySetInnerHTML={{ __html: product && product.content }}
              ></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
