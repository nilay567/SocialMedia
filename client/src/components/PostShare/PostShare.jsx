import React, { useState, useRef } from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [selectedImage, setSelectedImage] = useState(null);
  const descriptionRef = useRef();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const imageInputRef = useRef();

  const handlePostUpload = async (e) => {
    e.preventDefault();

    const newPost = {
        userId: user._id,
        desc: descriptionRef.current.value,
    };

    if (selectedImage) {
        const formData = new FormData();
        const fileName = `${Date.now()}_${selectedImage.name}`;
        formData.append("name", fileName);
        formData.append("file", selectedImage);
        newPost.image = fileName;

        try {
            await dispatch(uploadImage(formData));
        } catch (error) {
            console.error("Image upload failed:", error);
            return;  
        }
    }

    try {
        await dispatch(uploadPost(newPost));
        resetForm();
    } catch (error) {
        console.error("Post upload failed:", error);
    }
};


  const resetForm = () => {
    setSelectedImage(null);
    descriptionRef.current.value = "";
  };

  return (
    <div className="post-share">
      <img
        src={
          user.profilePicture
            ? `${serverPublic}${user.profilePicture}`
            : `${serverPublic}defaultProfile.png`
        }
        alt="User Profile"
        className="profile-picture"
      />
      <div className="post-content">
        <input
          type="text"
          placeholder="What's on your mind?"
          ref={descriptionRef}
          className="post-input"
        />
        <div className="post-options">
          <div className="option" style={{ color: "#4CAF50" }} onClick={() => imageInputRef.current.click()}>
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "#FF5722" }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option" style={{ color: "#3F51B5" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: "#FFC107" }}>
            <UilSchedule />
            Schedule
          </div>
          <button
            className="post-button"
            onClick={handlePostUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Share"}
          </button>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {selectedImage && (
          <div className="preview-container">
            <UilTimes onClick={() => setSelectedImage(null)} className="close-icon" />
            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
