import React from "react";
import "./ProfileCard.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const posts = useSelector((state) => state.postReducer.posts);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="new-profile-card">
      <div className="new-profile-images">
        <img
          src={
            user.coverPicture
              ? serverPublic + user.coverPicture
              : serverPublic + "defaultCover.jpg"
          }
          alt="Cover"
          className="new-cover-image"
        />
        <img
          src={
            user.profilePicture
              ? serverPublic + user.profilePicture
              : serverPublic + "defaultProfile.png"
          }
          alt="Profile"
          className="new-profile-image"
        />
      </div>
      <div className="new-profile-details">
        <h3>{user.firstname} {user.lastname}</h3>
        <p>{user.worksAt ? user.worksAt : 'Write about yourself'}</p>
      </div>

      <div className="new-follow-status">
        <div className="new-status-details">
          <div className="new-follow">
            <span className="new-count">{user.followers.length}</span>
            <span>Followers</span>
          </div>
          <div className="new-vertical-line"></div>
          <div className="new-follow">
            <span className="new-count">{user.following.length}</span>
            <span>Following</span>
          </div>
          {location === "profilePage" && (
            <>
              <div className="new-vertical-line"></div>
              <div className="new-follow">
                <span className="new-count">
                  {posts.filter((post) => post.userId === user._id).length}
                </span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
      </div>

      {location !== "profilePage" && (
        <div className="new-profile-link">
          <Link to={`/profile/${user._id}`}>My Profile</Link>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
