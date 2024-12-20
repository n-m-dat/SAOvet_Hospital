import { Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateService = () => {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const { serviceId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchService = async () => {
        const res = await fetch(
          `/api/service/getservices?serviceId=${serviceId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.services[0]);
        }
      };

      fetchService();
    } catch (error) {
      console.log(error.message);
    }
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/service/updateservice/${serviceId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/service/${data.slug}`);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Cập nhật dịch vụ
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tiêu đề"
          required
          id="serviceName"
          className="flex-1 rounded"
          onChange={(e) =>
            setFormData({ ...formData, serviceName: e.target.value })
          }
          value={formData.serviceName}
        />
        <input
          type="number"
          placeholder="Giá dịch vụ"
          required
          id="fee"
          className="flex-1 rounded"
          value={formData.fee}
          onChange={(e) =>
            setFormData({ ...formData, fee: parseFloat(e.target.value) })
          }
        />
        <textarea
          placeholder="Mô tả ngắn..."
          className="resize-none rounded"
          onChange={(e) =>
            setFormData({ ...formData, shortDesc: e.target.value })
          }
          value={formData.shortDesc}
        />

        <ReactQuill
          theme="snow"
          placeholder="Viết gì đó..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, description: value });
          }}
          value={formData.description}
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded uppercase"
        >
          Cập nhật
        </button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdateService;
