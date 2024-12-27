import Slider from "react-slick";
import PostCard from "./PostCard";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const PostSlider = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getPosts?limit=6`);
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-5xl w-full h-max flex flex-col gap-5">
        <p className="text-center text-3xl text-blue-800 font-semibold">
          Bài viết mới nhất
        </p>
        <div className="px-5 flex items-center justify-center">
          <button
            onClick={previous}
            className="border-2 border-black rounded-full"
          >
            <MdKeyboardArrowLeft size={30} />
          </button>
          <div className="max-w-4xl w-full">
            <Slider
              ref={(slider) => {
                sliderRef = slider;
              }}
              {...settings}
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </Slider>
          </div>
          <button onClick={next} className="border-2 border-black rounded-full">
            <MdKeyboardArrowRight size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSlider;
