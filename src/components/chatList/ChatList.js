import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserAction } from "../../redux/userSlice";
import CreateGroup from "../modal/CreateGroup";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import axios from "axios";
import { useEffect } from "react";
import CreateChat from "../modal/CreateChat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatList = (props) => {
  const chats = useSelector((state) => state.user.chats);
  const users = useSelector((state) => state.user.users);
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const dispatch = useDispatch();
  console.log(chats, selectedChat);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${users.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5001/api/chat",
        config
      );

      dispatch(UserAction.setChats({ value: data }));
    } catch (error) {
      toast.error("Error Occured Chat is not fetched");
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="main__chatlist">
      <CreateGroup />
      <CreateChat />
      <div className="chatlist__heading">
        <h2>Chats</h2>
        <button className="btn-nobg"></button>
      </div>

      <div className="chatlist__items">
        {chats?.map((item, index) => {
          return (
            <ChatListItems
              chat={item}
              name={item?.chatName}
              key={item.id}
              animationDelay={index + 1}
              active={item?._id === selectedChat?._id ? "active" : ""}
              isOnline={item.isOnline ? "active" : ""}
              image={item.image}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
