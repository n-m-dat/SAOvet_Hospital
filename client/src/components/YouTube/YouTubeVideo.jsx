const YouTubeVideo = ({ videoId }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-5xl w-full flex gap-10">
        <div className="relative flex-1 pb-[28.125%] bg-black border-blue-500">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl text-blue-800 font-semibold">
            Dịch vụ bảo hiểm cho thú cưng
          </h1>
          <br />
          <p className="text-gray-500 text-justify">
            Dịch vụ bảo hiểm thú cưng tại bệnh viện thú y SAOvet mang đến cho
            bạn giải pháp chăm sóc sức khỏe toàn diện cho người bạn bốn chân.
            Với mức phí hợp lý, bảo hiểm này giúp bạn an tâm về chi phí điều
            trị, khám chữa bệnh và chăm sóc y tế khi thú cưng gặp sự cố hoặc
            bệnh tật. Đến với SAOvet, bạn sẽ nhận được sự chăm sóc tận tâm từ
            đội ngũ bác sĩ chuyên nghiệp, đảm bảo thú cưng của bạn luôn khỏe
            mạnh và hạnh phúc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideo;
