import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/UploadAction";
import { updateUser } from "../../actions/UserAction";

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();

  const { user } = useSelector((state) => state.authReducer.authData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (event.target.name === "profileImage") {
      setProfileImage(imageFile);
    } else if (event.target.name === "coverImage") {
      setCoverImage(imageFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { ...formData };

    // Upload profile image if selected
    if (profileImage) {
      const formData = new FormData();
      const fileName = Date.now() + profileImage.name;
      formData.append("name", fileName);
      formData.append("file", profileImage);
      userData.profilePicture = fileName;

      try {
        await dispatch(uploadImage(formData));
      } catch (err) {
        console.error("Error uploading profile image:", err);
      }
    }

    // Upload cover image if selected
    if (coverImage) {
      const formData = new FormData();
      const fileName = Date.now() + coverImage.name;
      formData.append("name", fileName);
      formData.append("file", coverImage);
      userData.coverPicture = fileName;

      try {
        await dispatch(uploadImage(formData));
      } catch (err) {
        console.error("Error uploading cover image:", err);
      }
    }

    // Update user data
    try {
      await dispatch(updateUser(param.id, userData));
      setModalOpened(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.75}
      overlayBlur={3}
      size="md"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <div className="profile-modal">
        <h3 className="modal-title">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname" className="input-label">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="info-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname" className="input-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="info-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="worksAt" className="input-label">
              Works at
            </label>
            <input
              type="text"
              id="worksAt"
              name="worksAt"
              value={formData.worksAt}
              onChange={handleChange}
              className="info-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="livesIn" className="input-label">
              Lives in
            </label>
            <input
              type="text"
              id="livesIn"
              name="livesIn"
              value={formData.livesIn}
              onChange={handleChange}
              className="info-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country" className="input-label">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="info-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="relationship" className="input-label">
              Relationship Status
            </label>
            <input
              type="text"
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="info-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profileImage" className="input-label">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={onImageChange}
              className="file-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage" className="input-label">
              Cover Image
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={onImageChange}
              className="file-input"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="button update-button">
              Update
            </button>
            <button
              type="button"
              className="button cancel-button"
              onClick={() => setModalOpened(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileModal;
