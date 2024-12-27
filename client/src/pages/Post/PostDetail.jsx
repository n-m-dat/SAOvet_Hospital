import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const PostDetail = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
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

  return (
    <div>
      {/*-----BACK BUTTON-----*/}
      {currentUser && currentUser.isAdmin && (
        <div className="h-[60px] bg-white flex items-center px-2 shadow-sm">
          <button
            onClick={() => navigate("/manage?tab=posts")}
            className="flex gap-2 px-5 py-1 border-2 border-blue-500 text-blue-500 rounded-full items-center"
          >
            <HiOutlineArrowNarrowLeft size={18} />
            Quản lý bài viết
          </button>
        </div>
      )}
      {/*-----POST DETAIL-----*/}
      <div className="bg-white max-w-6xl min-h-screen px-5 flex flex-col mx-auto mt-5 rounded-lg">
        <div className="w-full flex py-5 justify-between border-b border-slate-500 mx-auto">
          <span>
            Ngày đăng: {post && new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </span>
          <span className="italic">
            Nội dung bài viết: {post && (post.content.length / 1000).toFixed(0)}
          </span>
        </div>
        <h1 className="max-w-3xl text-4xl mt-10 p-3 text-center mx-auto">
          {post && post.title}
        </h1>
        <Link
          to={`/information?category=${post && post.category}`}
          className="self-center mt-5"
        >
          <button className="border border-gray-400 px-5 py-1 rounded-full">
            {post && post.category}
          </button>
        </Link>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="w-full max-h-[600px] mt-10 p-3 object-cover"
        />
        <div
          className="w-full p-3 mx-auto post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>

        {/*<div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>*/}
      </div>
    </div>
  );
};

export default PostDetail;
