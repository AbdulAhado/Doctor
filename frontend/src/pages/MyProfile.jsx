import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null); // State for local preview of profile picture
  const [profilePicFile, setProfilePicFile] = useState(null); // State for the selected file

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
          headers: { token },
        });
        if (data.success) {
          const parsedAddress =
            typeof data.userData.address === "string"
              ? JSON.parse(data.userData.address)
              : data.userData.address || { line1: "", line2: "" };

          setUserData({ ...data.userData, address: parsedAddress });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error(error);
      }
    };

    fetchUserData();
  }, [backendUrl, token]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file); // Store the selected file
      setProfilePicPreview(URL.createObjectURL(file)); // Generate a local preview
    }
  };

  const saveUserData = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userData._id);
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address)); // Convert address to JSON string
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);

      if (profilePicFile) {
        formData.append("image", profilePicFile); // Add profile picture to form data
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEdit(false);
        setProfilePicPreview(null); // Reset local preview
        setProfilePicFile(null); // Reset file state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm mx-20">
      <img
        className="w-36 rounded"
        src={profilePicPreview || userData.image} // Show local preview if available, otherwise show current image
        alt="Profile"
      />
      {isEdit && (
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange} // Handle profile picture change
        />
      )}
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-0" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone: </p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender :</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday : </p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>
      <div>
        {isEdit ? (
          <button
            className="border px-8 py-2 rounded-full hover:bg-[#5f6fff] hover:text-white transition-all duration-50"
            onClick={saveUserData} // Call saveUserData on click
          >
            Save Information
          </button>
        ) : (
          <button
            className="border px-8 py-2 rounded-full hover:bg-[#5f6fff] hover:text-white transition-all duration-50"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
