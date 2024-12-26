import { useState, useEffect } from "react";
import PostSlider from "../components/PostSlider";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import HomeCarousel from "../components/HomeCarousel";
import Footer from "../components/Footer";
import HomeServices from "../components/HomeServices";
import HomeVideo from "../components/YouTube/HomeVideo";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`/api/product/getProducts?limit=8`);
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="relative top-[80px] flex flex-col gap-10">
        {/*----- CAROUSEL -----*/}
        <HomeCarousel />

        {/*----- SERVICES MENU -----*/}
        <HomeServices />

        {/*----- VIDEO -----*/}
        <HomeVideo videoId="6PwbhVq7pzY" />

        {/*-----PRODUCTS-----*/}
        <div className="w-full flex justify-center mt-10">
          <div className="max-w-5xl w-full">
            {products && products.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl text-blue-800 font-bold text-center">
                  Sản phẩm nổi bật
                </h2>
                <div className="grid grid-cols-4 gap-5 justify-center">
                  {products.map((product, key) => (
                    <ProductCard key={key} data={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/*-----POSTS-----*/}
        <PostSlider />

        {/*-----FOOTER-----*/}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
