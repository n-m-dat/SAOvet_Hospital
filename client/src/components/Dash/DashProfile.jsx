import { Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [gender, setGender] = useState("");
  const [pet, setPet] = useState("");

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setImageFileUploadError("Không thể tải ảnh lên (Ảnh phải nhỏ hơn 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setFormData((prevData) => ({ ...prevData, gender: e.target.value }));
  };

  const handlePetChange = (e) => {
    setPet(e.target.value);
    setFormData((prevData) => ({ ...prevData, pet: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0 && !imageFile && !gender) {
      setUpdateUserError("Không có gì thay đổi");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Đang tải ảnh");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentUser, ...formData, gender }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Cập nhật thông tin thành công");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="mb-10 font-semibold text-center text-3xl">
          Thông tin cá nhân
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 items-center"
        >
          <div className="w-full flex gap-10">
            <div className="w-full flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
              <div
                className="relative w-20 h-20 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
              >
                {imageFileUploadProgress && <span>Loading...</span>}
                <img
                  src={imageFileUrl || currentUser.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-4 border-blue-500 ${
                    imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-60"
                  }`}
                />
              </div>
              {imageFileUploadError && (
                <Alert color="failure">{imageFileUploadError}</Alert>
              )}
              {/*----- USERNAME -----*/}
              <input
                type="text"
                id="username"
                placeholder="Tên người dùng"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="rounded"
              />
              {/*----- EMAIL -----*/}
              <input
                type="email"
                id="email"
                placeholder="Email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="rounded"
              />
              {/*----- PASSWORD -----*/}
              <input
                type="password"
                id="password"
                placeholder="Mật khẩu"
                onChange={handleChange}
                className="rounded"
              />
            </div>
            <div className="w-full flex flex-col gap-4 justify-end">
              {/*----- GENDER -----*/}
              <select
                defaultValue={currentUser.gender}
                onChange={handleGenderChange}
                className="rounded"
              >
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              {/*----- PHONENUMBER -----*/}
              <input
                type="tel"
                id="phonenumber"
                placeholder="Số điện thoại"
                defaultValue={currentUser.phonenumber}
                onChange={handleChange}
                className="rounded"
              />
              {/*----- PET -----*/}
              <select
                value={pet}
                defaultValue={currentUser.pet}
                onChange={handlePetChange}
                className="rounded"
              >
                <option value="">Thú cưng của bạn</option>
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
                <option value="Khác">Khác</option>
              </select>
              {/*----- ADDRESS -----*/}
              <input
                type="text"
                id="address"
                placeholder="Địa chỉ"
                defaultValue={currentUser.address}
                onChange={handleChange}
                className="rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-[360px] bg-orange-500 hover:scale-105 transition-all duration-300 text-white rounded py-2"
            disabled={loading || imageFileUploading}
          >
            {loading ? "Đang tải..." : "Cập nhật"}
          </button>
        </form>
        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default DashProfile;
