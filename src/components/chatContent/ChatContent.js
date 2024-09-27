import React, { useState, useRef, useEffect } from "react";
import "./chatContent.css";
import group from "../../images/group.jpg";
import axios from "axios";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UpdateGroup from "../modal/UpdateGroup";
import { UserAction } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const chatItms = [];
const ENDPOINT = "http://localhost:5001";
let socket, selectedChatCompare;

const ChatContent = () => {
  const messagesEndRef = useRef("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const users = useSelector((state) => state.user.users);
  const [loading, setLoading] = useState(false);
  const [isMessageSend, setIsMessageSend] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const notification = useSelector((state) => state.user.notification);
  const [istyping, setIsTyping] = useState(false);
  let lastMessageId;
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${users.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5001/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to load the message");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && message) {
      if (selectedChat === null) toast.error("Please Select the chat");

      socket.emit("stop typing", selectedChat._id);
      const data = {
        sender: users,
        createdAt: new Date().toString(),
        content: message,
      };
      setMessages((prev) => [...prev, data]);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${users.token}`,
          },
        };
        setMessage("");
        const { data } = await axios.post(
          "http://localhost:5001/api/message",
          {
            content: message,
            chatId: selectedChat,
          },
          config
        );
        if (data) {
          setIsMessageSend(true);
          messages.pop();
        }
        socket.emit("new message", data);
        scrollToBottom();
      } catch (error) {
        toast.error("Failed to send the messsage");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", users);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    scrollToBottom();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
    socket.on("message recieved", (newMessageRecieved) => {
      if (newMessageRecieved._id === lastMessageId) return;
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          if (newMessageRecieved._id !== lastMessageId) {
            lastMessageId = newMessageRecieved._id;
          }
          dispatch(UserAction.setNotification({ value: newMessageRecieved }));
        }
      } else {
        if (newMessageRecieved._id !== lastMessageId) {
          lastMessageId = newMessageRecieved._id;
        }
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTo({
      left: 0,
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const onStateChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            {selectedChat && (
              <Avatar
                isOnline="active"
                image={
                  selectedChat
                    ? selectedChat?.isGroupChat
                      ? group
                      : selectedChat?.users.filter(
                          (user) => users._id !== user._id
                        )[0]?.pic
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
                }
              />
            )}
            <p>
              {selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : selectedChat?.users?.filter(
                    (user) => user._id !== users._id
                  )[0]?.name}
            </p>
          </div>
        </div>
        <div>{selectedChat?.isGroupChat && <UpdateGroup />}</div>
      </div>
      <div ref={messagesEndRef} className="content__body">
        <div className="chat__items">
          {messages.map((itm, index) => {
            return (
              <ChatItem
                animationDelay={index + 2}
                key={itm.key}
                isSend={isMessageSend}
                chat={itm}
                sameUser={users._id === itm.sender?._id}
              />
            );
          })}
          <div />
        </div>
      </div>
      {selectedChat && (
        <div className="content__footer">
          <div className="sendNewMessage">
            <input
              type="text"
              placeholder="Type a message here"
              onChange={onStateChange}
              value={message}
              onKeyDown={sendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
