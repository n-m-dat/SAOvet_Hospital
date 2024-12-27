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
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateProduct = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const { productId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/product/getproducts?productId=${productId}`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.products[0]);
        }
      };

      fetchProduct();
    } catch (error) {
      console.log(error.message);
    }
  }, [productId]);

  const handleUploadImages = async () => {
    try {
      if (files.length === 0) {
        setImageUploadError("Vui lòng chọn ít nhất một hình ảnh!");
        return;
      }
      setImageUploadError(null);

      const storage = getStorage(app);
      const imageUrls = [...formData.image]; // Giữ lại các hình ảnh cũ

      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        const fileName = new Date().getTime() + "-" + fileItem.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, fileItem);

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
              imageUrls.push(downloadURL); // Thêm URL mới vào mảng imageUrls

              if (imageUrls.length === files.length + formData.image.length) {
                setImageUploadProgress(null);
                setImageUploadError(null);
                setFormData({ ...formData, image: imageUrls }); // Cập nhật tất cả URL vào formData
              }
            });
          }
        );
      }
    } catch (error) {
      setImageUploadError("Tải ảnh thất bại!");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.image.filter((_, i) => i !== index);
    setFormData({ ...formData, image: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/product/updateproduct/${productId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/product/${data.slug}`);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Cập nhật bài viết
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/*-----TITLE AND CATEGORY-----*/}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Tiêu đề"
            required
            id="title"
            className="flex-1 rounded"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            className="rounded"
            value={formData.pet}
            onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
          >
            <option value="">Chọn thú cưng</option>
            <option value="Chó">Chó</option>
            <option value="Mèo">Mèo</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/*-----BRAND & CATEGORY----- */}
        <div className="flex gap-4">
          <select
            className="flex-1 rounded"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Chọn danh mục</option>
            <option value="Thức ăn">Thức ăn</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Khác">Khác</option>
          </select>
          <select
            className="flex-1 rounded"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
          >
            <option value="">Chọn nhãn hàng</option>
            <option value="Royal Canin">Royal Canin</option>
            <option value="Whiskas">Whiskas</option>
            <option value="Pedigree">Pedigree</option>
            <option value="SmartHeart">SmartHeart</option>
            <option value="Khác">Khác</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/*-----PRICE AND DISCOUNT-----*/}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Đơn giá"
            required
            id="price"
            className="flex-1 rounded"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Giảm giá"
            required
            id="discount"
            className="flex-1 rounded"
            value={formData.discount}
            onChange={(e) => {
              const discountValue = parseFloat(e.target.value);
              if (discountValue >= 0 && discountValue <= 100) {
                setFormData({ ...formData, discount: discountValue });
              } else {
                console.log("Giảm giá phải trong khoảng từ 0 đến 100");
              }
            }}
          />
        </div>

        {/*-----UPLOAD IMAGE-----*/}
        <div className="flex gap-4 items-center justify-between border-4 border-black border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded"
            onClick={handleUploadImages}
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
        {formData.image && formData.image.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {formData.image.map((url, index) => (
              <div key={index} className="relative w-40 h-40">
                <img
                  src={url}
                  alt={`product-image-${index}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded px-2"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Không thể tải hình ảnh!</p>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Viết gì đó..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content}
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

export default UpdateProduct;
