import React, { useEffect, useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as UserApi from "../../api/UserRequests";
import { logout } from "../../actions/AuthActions";

const UserInfo = ({ label, value }) => (
  <div className="info">
    <span>
      <b>{label}: </b>
    </span>
    <span>{value}</span>
  </div>
);

const InfoCard = () => {
  const dispatch = useDispatch();
  const { id: profileUserId } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState({});
  const { user } = useSelector((state) => state.authReducer.authData);

  const handleLogOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (profileUserId === user._id) {
        setProfileUser(user);
      } else {
        try {
          const fetchedUser = await UserApi.getUser(profileUserId);
          setProfileUser(fetchedUser);
        } catch (error) {
          console.error("Error fetching profile user:", error);
        }
      }
    };

    fetchProfileUser();
  }, [profileUserId, user]);

  return (
    <div className="info-card">
      <div className="info-card-header">
        <h4>Profile Information</h4>
        {user._id === profileUserId && (
          <div className="edit-button" onClick={() => setModalOpen(true)}>
            <UilPen width="2rem" height="1.2rem" />
          </div>
        )}
        <ProfileModal
          modalOpened={isModalOpen}
          setModalOpened={setModalOpen}
          data={user}
        />
      </div>
      <UserInfo label="Status" value={profileUser.relationship || "N/A"} />
      <UserInfo label="Lives in" value={profileUser.livesIn || "N/A"} />
      <UserInfo label="Works at" value={profileUser.worksAt || "N/A"} />
      <button className="button logout-button" onClick={handleLogOut}>
        Log Out
      </button>
    </div>
  );
};

export default InfoCard;
