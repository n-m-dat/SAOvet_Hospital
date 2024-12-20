import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ResponsiveMenu = ({ openMenu }) => {
  return (
    <AnimatePresence mode="wait">
      {openMenu && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="w-full h-screen absolute top-[60px] left-0 z-20 lg:hidden"
        >
          <div className="text-lg font-semibold uppercase bg-gray-200 text-black py-10 rounded-b-xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              <li className="hover:text-orange-500">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="hover:text-orange-500">
                <Link to="/services">Dịch vụ</Link>
              </li>
              <li className="hover:text-orange-500">
                <Link to="/shop">Sản phẩm</Link>
              </li>
              <li className="hover:text-orange-500">
                <Link to="/information">Thông tin</Link>
              </li>
              <li className="hover:text-orange-500">
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ResponsiveMenu.propTypes = {
  openMenu: PropTypes.node,
};

export default ResponsiveMenu;
