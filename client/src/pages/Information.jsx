import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Information = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const limit = 10;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl || "",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?${searchQuery}&limit=${limit}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLoading(false);
        if (data.posts.length === limit) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "";
      setSidebarData({ ...sidebarData, category });
    }
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
    const searchQuery = urlParams.toString();
    navigate(`/information?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 10) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative top-[80px]">
        <div className="w-full min-h-[100vh] flex flex-col gap-10 px-5">
          {/************************************************************************/}
          <div className="w-full bg-white rounded shadow-lg p-5">
            <form className="flex justify-around">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết"
                  id="searchTerm"
                  className="w-[300px] rounded"
                  value={sidebarData.searchTerm}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-3 items-center">
                <label>Sắp xếp theo:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.sort}
                  id="sort"
                  className="w-[120px]"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
              </div>
              <div className="flex gap-3 items-center">
                <label>Danh mục:</label>
                <select
                  onChange={handleChange}
                  value={sidebarData.category}
                  id="category"
                  className="w-[120px]"
                >
                  <option value="">Tất cả</option>
                  <option value="Chó">Chó</option>
                  <option value="Mèo">Mèo</option>
                  <option value="Khuyến Mãi">Khuyến Mãi</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <button
                className="bg-orange-500 hover:scale-105 text-white flex items-center px-10 rounded"
                onClick={handleSubmit}
              >
                <FaSearch />
              </button>
            </form>
          </div>
          {/*----- RESULTS -----*/}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold uppercase">Kết quả tìm kiếm</h2>
            <div className="w-full border border-black"></div>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div>
                  {!loading && posts.length === 0 && (
                    <p>Không tìm được bài viết.</p>
                  )}
                </div>
                <div>{loading && <p>Đang tải...</p>}</div>
                <div className="justify-center grid grid-cols-2 gap-5">
                  {!loading &&
                    posts &&
                    posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                </div>
              </div>
            </div>
            {showMore && posts.length < totalPosts && (
              <button
                onClick={handleShowMore}
                className="text-blue-500 text-lg hover:underline p-5 w-full"
              >
                Xem thêm
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Information;
