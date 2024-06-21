import React, { useState } from "react";
import "./Post.css";
import CommentIcon from "../../img/comment.png";
import ShareIcon from "../../img/share.png";
import LikedIcon from "../../img/like.png";
import UnlikedIcon from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [isLiked, setIsLiked] = useState(data.likes.includes(user._id));
  const [likeCount, setLikeCount] = useState(data.likes.length);

  const toggleLike = async () => {
    await likePost(data._id, user._id);
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  return (
    <div className="post-container">
      {data.image && (
        <img
          src={`${process.env.REACT_APP_PUBLIC_FOLDER}${data.image}`}
          alt="Post"
          className="post-image"
        />
      )}

      <div className="post-actions">
        <img
          src={isLiked ? LikedIcon : UnlikedIcon}
          alt="Like"
          className="post-action-icon"
          onClick={toggleLike}
        />
        <img src={CommentIcon} alt="Comment" className="post-action-icon" />
        <img src={ShareIcon} alt="Share" className="post-action-icon" />
      </div>

      <span className="like-count">{likeCount} likes</span>

      <div className="post-details">
        <span className="post-author">
          <b>{data.name}</b>
        </span>
        <span className="post-description">{data.desc}</span>
      </div>
    </div>
  );
};

export default Post;
