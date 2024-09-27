import React, { useState } from "react";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import { useSearchParams } from "react-router-dom";
import TextContainer from "../TextContainer/TextContainer";
const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(searchParams.get("name"));
  const [users, setUsers] = useState("");
  const [room, setRoom] = useState(searchParams.get("room"));
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
