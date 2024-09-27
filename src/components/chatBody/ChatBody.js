import React from "react";
import "./chatBody.css";
import "../../App.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import Navbar from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";

const ChatBody = ({ socket }) => {
  return (
    <div className="__main">
      <Navbar />
      <div className="main__chatbody">
        <ToastContainer />
        <ChatList />
        <ChatContent socket={socket} />
        {/* <UserProfile /> */}
      </div>
    </div>
  );
};

export default ChatBody;
