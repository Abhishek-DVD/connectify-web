/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const DEFAULT_PHOTO_URL = "https://image.pngaaa.com/853/3873853-middle.png";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [about, setAbout] = useState(user.about);
  const [gender, setGender] = useState(user.gender);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const saveProfile = async () => {
    try {
      const cleanedPhotoUrl = photoUrl.trim() || DEFAULT_PHOTO_URL;
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, photoUrl: cleanedPhotoUrl },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setPhotoUrl(cleanedPhotoUrl);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadProfilePhoto = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please select an image smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    setIsUploadingPhoto(true);
    setError("");

    try {
      const res = await axios.post(BASE_URL + "/profile/photo", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedPhotoUrl = res?.data?.photoUrl;
      dispatch(addUser(res?.data?.data));
      setPhotoUrl(uploadedPhotoUrl);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-4 mb-4 pb-20">
        <div className="w-full max-w-md md:mr-10">
          <div className="card bg-base-300 shadow-xl w-full rounded-lg">
            <div className="card-body">
              <h2 className="card-title text-center">Edit Profile</h2>

              <label className="form-control w-full">
                <span className="label-text">First Name:</span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text">Last Name:</span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text">Age:</span>
                <input
                  type="text"
                  value={age}
                  className="input input-bordered w-full"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text">Gender:</span>
                <select
                  className="select w-full"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option disabled selected>
                    Pick your Gender
                  </option>
                  <option>male</option>
                  <option>female</option>
                  <option>other</option>
                </select>
              </label>

              <label className="form-control w-full">
                <span className="label-text">About:</span>
                <input
                  type="text"
                  value={about}
                  className="input input-bordered w-full"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text">Photo URL:</span>
                <input
                  type="text"
                  value={photoUrl}
                  className="input input-bordered w-full"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text">Upload Photo:</span>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  disabled={isUploadingPhoto}
                  onChange={(e) => {
                    uploadProfilePhoto(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <span className="label-text-alt mt-1">
                  {isUploadingPhoto ? "Uploading..." : "JPG, PNG, or WEBP. Max 5MB."}
                </span>
              </label>

              <p className="text-red-500">{error}</p>

              <div className="card-actions justify-center mt-4">
                <button className="btn btn-primary w-full" onClick={saveProfile} disabled={isUploadingPhoto}>
                  {isUploadingPhoto ? "Uploading Photo..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Text Above UserCard */}
        <div className="w-full max-w-xs md:max-w-md mt-2">
          <motion.h2
            className="text-xl md:text-2xl font-semibold text-center text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Your Profile Preview
          </motion.h2>

          <UserCard user={{ firstName, lastName, age, gender, about, photoUrl: photoUrl.trim() || DEFAULT_PHOTO_URL }} />
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
