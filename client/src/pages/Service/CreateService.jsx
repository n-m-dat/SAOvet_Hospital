import { Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateService = () => {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const formatPrice = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/service/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
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
      setPublishError("Xảy ra lỗi!!!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Thêm dịch vụ</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên dịch vụ"
          required
          id="serviceName"
          className="flex-1 rounded"
          onChange={(e) =>
            setFormData({ ...formData, serviceName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Giá dịch vụ"
          required
          id="fee"
          className="flex-1 rounded"
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^[\d.]*$/.test(inputValue)) {
              const rawValue = inputValue.replace(/\./g, "");
              const formattedValue = formatPrice(rawValue);
              setFormData({ ...formData, fee: parseFloat(rawValue) });
              e.target.value = formattedValue;
            }
          }}
        />
        <textarea
          placeholder="Mô tả ngắn..."
          className="resize-none rounded"
          onChange={(e) =>
            setFormData({ ...formData, shortDesc: e.target.value })
          }
        />

        <ReactQuill
          theme="snow"
          placeholder="Viết gì đó..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, description: value });
          }}
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded uppercase"
        >
          Thêm
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

export default CreateService;
