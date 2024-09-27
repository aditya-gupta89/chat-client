import { Stack, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Group from "../../images/group.jpg";
import { UserAction } from "../../redux/userSlice";
import Avatar from "./Avatar";

const ChatListItems = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  return (
    <div
      style={{ animationDelay: `0.${props.animationDelay}s` }}
      onClick={() => {
        dispatch(UserAction.setSelectedChat({ value: props.chat }));
      }}
      className={`chatlist__item ${props.active ? props.active : ""} `}
    >
      <Avatar
        isOnline="active"
        image={
          props?.chat?.isGroupChat
            ? Group
            : props?.chat.users?.filter((user) => user._id !== users._id)[0]
                ?.pic
        }
      />
      <Stack>
        <Typography>
          {props?.chat?.isGroupChat
            ? props?.name
            : props?.chat.users?.filter((user) => user._id !== users._id)[0]
                ?.name}
        </Typography>
        <Typography variant="subtitle2">
          {props?.chat?.latestMessage?.content}
        </Typography>
      </Stack>
    </div>
  );
};
export default ChatListItems;
