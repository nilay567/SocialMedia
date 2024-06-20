import React, { useEffect, useState } from "react";
import "./FollowersCard.css";
import FollowersModal from "../FollowersModal/FollowersModal";
import { getAllUser } from "../../api/UserRequests";
import User from "../User/User";
import { useSelector } from "react-redux";

const FollowersCard = ({ location }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPersons();
  }, []);

  return (
    <div className="followers-card">
      <h3>People You May Know</h3>
      <div className="followers-list">
        {persons.map((person, id) => (
          person._id !== user._id && <User person={person} key={id} />
        ))}
      </div>
      {!location && (
        <span className="show-more" onClick={() => setModalOpened(true)}>
          Show More
        </span>
      )}
      <FollowersModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
      />
    </div>
  );
};

export default FollowersCard;
