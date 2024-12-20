import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import ResponsiveMenu from "./ResponsiveMenu";
import { useSelector } from "react-redux";
import DropdownProfile from "./DropdownProfile";
import { BsCart } from "react-icons/bs";
import logo from "../images/logo.png";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const carts = useSelector((store) => store.cart.items);

  useEffect(() => {
    let total = 0;
    carts.forEach((item) => (total += item.quantity));
    setTotalQuantity(total);
  }, [carts]);

  return (
    <>
      <nav>
        <div className="w-full fixed top-0 left-0 z-50 text-black bg-white shadow-md flex justify-between items-center py-3 px-2">
          {/*-----LOGO-----*/}
          <div className="flex gap-2 items-center">
            <img src={logo} alt="logo" className="w-full h-10" />
            <p className="text-3xl font-semibold font-title text-orange-500">
              <span className="text-blue-800 font-title">SAO</span>vet
            </p>
          </div>

          {/*-----SECTION-----*/}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-5">
              <li>
                <Link
                  onClick={() => scrollTo(0, 0)}
                  to="/"
                  className="inline-block font-semibold py-1 px-2 xl:px-3 hover:text-orange-500"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => scrollTo(0, 0)}
                  to="/services"
                  className="inline-block font-semibold py-1 px-2 xl:px-3 hover:text-orange-500"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => scrollTo(0, 0)}
                  to="/shop"
                  className="inline-block font-semibold py-1 px-2 xl:px-3 hover:text-orange-500"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => scrollTo(0, 0)}
                  to="/information"
                  className="inline-block font-semibold py-1 px-2 xl:px-3 hover:text-orange-500"
                >
                  Thông tin
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => scrollTo(0, 0)}
                  to="/contact"
                  className="inline-block font-semibold py-1 px-2 xl:px-3 hover:text-orange-500"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/*-----BUTTON-----*/}
          <div className="flex gap-8 items-center">
            <div className="relative">
              <Link to="/cart">
                <span className="w-5 h-5 flex justify-center items-center absolute -top-2 -right-2 bg-red-500 text-white text-[12px] rounded-full">
                  {totalQuantity}
                </span>
                <BsCart size={26} />
              </Link>
            </div>
            {currentUser ? (
              <DropdownProfile />
            ) : (
              <div className="hidden lg:block">
                <Link to="/login">
                  <button className="font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg px-6 py-2">
                    Đăng nhập
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/*-----MENU-----*/}
          <div className="lg:hidden" onClick={() => setOpenMenu(!openMenu)}>
            <IoMenu className="text-4xl" />
          </div>
        </div>
      </nav>

      {/*-----MOBILE SIDEBAR-----*/}
      <ResponsiveMenu openMenu={openMenu} />
    </>
  );
};

export default Navbar;
