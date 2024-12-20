import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Shop = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
    pet: "",
    brand: "",
    priceSort: "",
  });
  console.log(sidebarData);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = 9;

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    const petFromUrl = urlParams.get("pet");
    const brandFromUrl = urlParams.get("brand");
    const priceSortFromUrl = urlParams.get("priceSort");
    if (
      searchTermFromUrl ||
      sortFromUrl ||
      categoryFromUrl ||
      petFromUrl ||
      brandFromUrl ||
      priceSortFromUrl
    ) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl || "",
        pet: petFromUrl || "",
        brand: brandFromUrl || "",
        priceSort: priceSortFromUrl || "",
      });
    }

    const fetchProducts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `/api/product/getproducts?${searchQuery}&limit=${limit}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setLoading(false);
        if (data.products.length === limit) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchProducts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    if (sidebarData.category) {
      urlParams.set("category", sidebarData.category);
    } else {
      urlParams.delete("category");
    }
    if (sidebarData.pet) {
      urlParams.set("pet", sidebarData.pet);
    } else {
      urlParams.delete("pet");
    }
    if (sidebarData.brand) {
      urlParams.set("brand", sidebarData.brand);
    } else {
      urlParams.delete("brand");
    }
    if (sidebarData.priceSort) {
      urlParams.set("priceSort", sidebarData.priceSort);
    } else {
      urlParams.delete("priceSort");
    }
    const searchQuery = urlParams.toString();
    navigate(`/shop?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfProducts = products.length;
    const startIndex = numberOfProducts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/product/getproducts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setProducts([...products, ...data.products]);
      if (data.products.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative top-[70px]">
        <div className="w-full min-h-[100vh] flex">
          {/*----- FILTER BOX -----*/}
          <div className="w-60 bg-gray-100 rounded p-5">
            <form className="flex flex-col gap-5">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm"
                  id="searchTerm"
                  className="w-full rounded"
                  value={sidebarData.searchTerm}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Thú cưng:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.pet}
                  id="pet"
                  className="w-full"
                >
                  <option value=""></option>
                  <option value="Chó">Chó</option>
                  <option value="Mèo">Mèo</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Danh mục:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.category}
                  id="category"
                  className="w-full"
                >
                  <option value=""></option>
                  <option value="Thức ăn">Thức ăn</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Hãng:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.brand}
                  id="brand"
                  className="w-full"
                >
                  <option value=""></option>
                  <option value="Royal Canin">Royal Canin</option>
                  <option value="Whiskas">Whiskas</option>
                  <option value="Pedigree">Pedigree</option>
                  <option value="SmartHeart">SmartHeart</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Sắp xếp theo giá:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.priceSort}
                  id="priceSort"
                  className="w-full"
                >
                  <option value="">Mặc định</option>
                  <option value="asc">Thấp đến cao</option>
                  <option value="desc">Cao đến thấp</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Sắp xếp theo:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.sort}
                  id="sort"
                  className="w-full"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
              </div>
              <button
                className="bg-orange-500 text-white flex justify-center py-2 px-10 rounded"
                onClick={handleSubmit}
              >
                Tìm kiếm
              </button>
            </form>
          </div>
          {/*----- RESULTS -----*/}
          <div className="flex flex-col gap-5 px-3">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div>
                  {!loading && products.length === 0 && (
                    <p>Không tìm được sản phẩm.</p>
                  )}
                </div>
                <div>{loading && <p>Đang tải...</p>}</div>
                <div className="justify-center grid grid-cols-3 gap-5">
                  {!loading &&
                    products &&
                    products.map((product) => (
                      <ProductCard key={product._id} data={product} />
                    ))}
                </div>
              </div>
            </div>
            <div>
              {showMore && products.length < totalProducts && (
                <button
                  onClick={handleShowMore}
                  className="text-blue-500 text-lg hover:underline p-5 w-full"
                >
                  Xem thêm
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Shop;
