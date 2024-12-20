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

const CreateProduct = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const formatPrice = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const navigate = useNavigate();

  // Hàm tải lên nhiều ảnh
  const handleUploadImages = async () => {
    try {
      if (files.length === 0) {
        setImageUploadError("Vui lòng chọn ít nhất một hình ảnh!");
        return;
      }
      setImageUploadError(null);

      const storage = getStorage(app);
      const imageUrls = []; // Mảng chứa các URL hình ảnh

      // Hàm tải lên một ảnh
      const uploadImage = async (file) => {
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            // eslint-disable-next-line no-unused-vars
            (error) => {
              reject("Tải ảnh thất bại!");
              setImageUploadProgress(null);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL); // Trả về URL khi tải lên thành công
              });
            }
          );
        });
      };

      // Duyệt qua từng ảnh và tải lần lượt theo thứ tự
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const downloadURL = await uploadImage(file);
          imageUrls.push(downloadURL); // Lưu URL của hình ảnh

          // Khi tải lên xong tất cả hình ảnh, cập nhật formData
          if (imageUrls.length === files.length) {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: imageUrls }); // Lưu tất cả URL hình ảnh vào formData
          }
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          setImageUploadError("Tải ảnh thất bại!");
          setImageUploadProgress(null);
          break; // Nếu có lỗi, dừng vòng lặp
        }
      }
    } catch (error) {
      setImageUploadError("Tải ảnh thất bại!");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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
      setPublishError("Xảy ra lỗi!!!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Thêm sản phẩm</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/*-----TITLE & PET-----*/}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Tên sản phẩm"
            required
            id="title"
            className="flex-1 rounded"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            className="rounded"
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
          </select>
        </div>

        {/*-----PRICE & DISCOUNT-----*/}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Đơn giá"
            required
            id="price"
            className="flex-1 rounded"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[\d.]*$/.test(inputValue)) {
                const rawValue = inputValue.replace(/\./g, "");
                const formattedValue = formatPrice(rawValue);
                setFormData({ ...formData, price: parseFloat(rawValue) });
                e.target.value = formattedValue;
              }
            }}
          />
          <input
            type="number"
            placeholder="Giảm giá"
            required
            id="discount"
            className="flex-1 rounded"
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
        {formData.image && formData.image.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {formData.image.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`upload-${index}`}
                className="w-40 h-40 object-cover"
              />
            ))}
          </div>
        )}

        {/*----- WRITE CONTENT -----*/}
        <ReactQuill
          theme="snow"
          placeholder="Viết gì đó..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        {/*----- SUBMIT BUTTON -----*/}
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded uppercase"
        >
          Đăng sản phẩm
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

export default CreateProduct;
