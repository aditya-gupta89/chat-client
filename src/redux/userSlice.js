import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialState = {
  users: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  chats: [],
  selectedChat: null,
  groupEvent: false,
  notification: [],
};
const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, action) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      state.users = userInfo;
    },
    setChats(state, action) {
      let data = [],
        allChats = [];

      if (state.chats.length === 0) {
        if (action.payload.value?.length > 0) allChats = action.payload.value;
        else allChats.push(action.payload.value);
      } else if (action.payload.value?.length > 1)
        allChats = [...state.chats, ...action.payload.value];
      else allChats = [...state.chats, action.payload.value];
      console.log(allChats);
      const filterData = allChats?.filter((chat) => {
        if (data.includes(chat._id)) {
          data.push(chat._id);
          return false;
        } else {
          data.push(chat._id);
          return true;
        }
      });
      console.log(filterData);
      state.chats = filterData;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload.value;
      console.log(action);
    },
    trigerGroupEvent(state) {
      state.groupEvent = !state.groupEvent;
    },
    setNotification(state, action) {
      if (action.payload.type === "remove") {
        console.log(action.payload.value);
        state.notification = action.payload.value;
      } else state.notification = [...state.notification, action.payload.value];
      console.log(state.notification);
    },
    logout(state) {
      state.users = null;
      state.chats = [];
      state.selectedChat = null;
      state.groupEvent = false;
      state.notification = [];
      localStorage.removeItem("userInfo");
    },
  },
});
export default UserSlice;
export const UserAction = UserSlice.actions;
