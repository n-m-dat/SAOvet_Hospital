import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PostCard = ({ post }) => {
  return (
    <div className="border border-gray-400 overflow-hidden rounded-[10px] bg-white">
      <div className="p-2">
        <img
          src={post.image}
          alt="post cover"
          className="w-full h-[320px] object-cover rounded-[10px] z-20"
        />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <p className="text-sm">
          Danh mục: <span className="italic">{post.category}</span>
        </p>
        <Link
          to={`/post/${post.slug}`}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg"
        >
          Xem bài viết
        </Link>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostCard;
