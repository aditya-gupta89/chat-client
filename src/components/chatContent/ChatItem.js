import React from "react";
import Avatar from "../chatList/Avatar";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

const chatItem = (props) => {
  let timeDiff = new Date().getTime() - new Date(props.chat.createdAt);
  timeDiff = Math.floor(timeDiff / 1000);

  if (timeDiff < 60) {
    timeDiff = `${timeDiff} seconds ago`;
  } else if (timeDiff < 3600) {
    let minutesDiff = Math.floor(timeDiff / 60);
    timeDiff = `${minutesDiff} minutes ago`;
  } else {
    timeDiff = `${new Date(props.chat.createdAt).getHours()} hours ago`;
  }
  return (
    <div
      style={{
        animationDelay: `0.8s`,
        justifyContent: props.sameUser === true ? "start" : "end",
      }}
      className={`chat__item ${props.user ? props.user : ""}`}
    >
      <div
        style={{
          backgroundColor: props.sameUser === true ? "#5a5ac8eb" : "#207398",
          borderRadius: "10px",
          padding: "10px",
          color: "white",
          minHeight: "70px",
          display: "flex",
          flexDirection: "column",
          minWidth: "180px",
          gap: ".5rem",
        }}
        className="chat__i2tem__content"
      >
        <div className="chat__msg">{props.chat.content}</div>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="chat__meta"
        >
          <span>{timeDiff}</span>
          <span>{props.isSend && <CheckOutlinedIcon />}</span>
        </div>
      </div>
      <Avatar
        isOnline="active"
        imgProps={{
          style: { objectFit: "cover", width: "100%", height: "100%" },
        }}
        sx={{ height: "100%", objectFit: "cover" }}
        image={props?.chat?.sender?.pic}
      />
    </div>
  );
};

export default chatItem;
