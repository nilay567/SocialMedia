import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newText) => {
    setNewMessage(newText);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (chat) {
      fetchUserData();
    }
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat?._id);
        setMessages(data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    if (chat) {
      fetchMessages();
    }
  }, [chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const messageData = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat?._id,
    };

    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...messageData, receiverId });

    try {
      const { data } = await addMessage(messageData);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === chat?._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  const scroll = useRef();
  const imageRef = useRef();

  return (
    <div className="chatbox-container">
      {chat ? (
        <div className="chatbox">
          <div className="chatbox-header">
            <div className="user-info">
              <img
                src={
                  userData?.profilePicture
                    ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                    : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
                }
                alt="Profile"
                className="user-avatar"
              />
              <div className="user-name">
                {userData?.firstname} {userData?.lastname}
              </div>
            </div>
          </div>

          <div className="chatbox-body">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? scroll : null}
                className={`message ${message.senderId === currentUser ? 'own' : 'other'}`}
              >
                <span className="message-text">{message.text}</span>
                <span className="message-time">{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={scroll}></div>
          </div>

          <div className="chatbox-footer">
            <div className="input-area">
              <div className="attach-icon" onClick={() => imageRef.current.click()}>
                +
              </div>
              <InputEmoji value={newMessage} onChange={handleChange} />
            </div>
            <div className="send-button" onClick={handleSend}>
              Send
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imageRef}
            />
          </div>
        </div>
      ) : (
        <div className="empty-chatbox-message">
          Tap on a chat to start a conversation...
        </div>
      )}
    </div>
  );
};

export default ChatBox;
