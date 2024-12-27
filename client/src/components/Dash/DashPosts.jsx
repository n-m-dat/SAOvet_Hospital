import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?userId=${
            currentUser._id
          }`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          setFilteredPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        setFilteredPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        toast.success("Đã xóa bài viết");
      } else {
        console.log(data.message);
        toast.error("Xóa bài viết thất bại!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Lọc bài viết theo tiêu đề hoặc danh mục
    const filtered = userPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
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
          <Link to="/create-post">
            <button className="flex gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white items-center">
              <FaPlus size={14} />
              <div className="h-5 border border-white"></div>
              <span>Tạo bài viết</span>
            </button>
          </Link>
        </div>
      </div>

      {/*-----TABLE SECTION-----*/}
      <div>
        {currentUser.isAdmin && filteredPosts.length > 0 ? (
          <>
            <div className="h-[400px] bg-white border rounded-t shadow-lg overflow-y-scroll">
              <div className="w-full sticky top-0 grid grid-cols-[0.8fr_0.7fr_2fr_0.8fr_0.6fr] grid-flow-col px-4 py-3 border-b font-bold bg-gray-50">
                <p>Ngày cập nhật</p>
                <p>Ảnh</p>
                <p>Tiêu đề</p>
                <p>Danh mục</p>
                <p>Thao tác</p>
              </div>

              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="w-full grid grid-cols-[0.8fr_0.7fr_2fr_0.8fr_0.6fr] grid-flow-col px-4 py-3 border-b"
                >
                  <p className="flex items-center text-sm">
                    {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 object-cover"
                    />
                  </Link>
                  <Link
                    to={`/post/${post.slug}`}
                    className="flex items-center text-sm hover:underline"
                  >
                    <p>{post.title}</p>
                  </Link>
                  <p className="flex items-center text-sm">{post.category}</p>
                  <div className="flex gap-3 items-center">
                    <Link to={`/update-post/${post._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold p-2 rounded">
                        <FaEdit size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
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
          <p>Chưa có bài viết!</p>
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
                Bạn có muốn xóa bài viết này?
              </h3>
              <div className="flex justify-around gap-4">
                <Button
                  color="success"
                  className="px-10"
                  onClick={handleDeletePost}
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

export default DashPosts;
