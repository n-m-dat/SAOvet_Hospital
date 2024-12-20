import Slider from "react-slick";
import banner_1 from "../images/banner_1.jpg";
import banner_2 from "../images/banner_2.jpg";
import banner_3 from "../images/banner_3.jpg";
import banner_4 from "../images/banner_4.png";

const images = [
  { id: "1", img: banner_1 },
  { id: "2", img: banner_2 },
  { id: "3", img: banner_3 },
  { id: "4", img: banner_4 },
  
];

const HomeCarousel = () => {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-5xl w-full h-max flex">
        <div className="w-full">
          <Slider {...settings}>
            {images.map((image) => (
              <div key={image.id}>
                <img
                  src={image.img}
                  alt={image.id}
                  className="w-full h-[420px]"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
