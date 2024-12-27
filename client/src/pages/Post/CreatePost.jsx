import { Alert, FileInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Vui lòng chọn hình ảnh!");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          setImageUploadError("Tải ảnh thất bại!");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Tải ảnh thất bại!");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/create`, {
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
        navigate(`/post/${data.slug}`);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setPublishError("Xảy ra lỗi!!!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Tạo bài viết</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Tiêu đề"
            required
            id="title"
            className="flex-1 rounded"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            className="rounded"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Chọn danh mục</option>
            <option value="Chó">Chó</option>
            <option value="Mèo">Mèo</option>
            <option value="Khuyến Mãi">Khuyến mãi</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-black border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <span>{imageUploadProgress}%</span>
            ) : (
              "Tải ảnh lên"
            )}
          </button>
        </div>
        {imageUploadError && <Alert color="warning">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-full object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Viết gì đó..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded uppercase"
        >
          Đăng bài
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

export default CreatePost;
