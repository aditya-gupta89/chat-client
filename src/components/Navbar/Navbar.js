import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import "./Navbar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import "react-toastify/dist/ReactToastify.css";

import { UserAction } from "../../redux/userSlice";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const user = useSelector((state) => state.user.users);
  const notification = useSelector((state) => state.user.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  console.log(notification);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    dispatch(UserAction.logout());
    navigate("/");
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const profileOpen = Boolean(profileAnchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);
  const profileId = profileOpen ? "profile-simple-popover" : undefined;
  const notificationId = profileOpen
    ? "notification-simple-popover"
    : undefined;

  return (
    <Box className="navbar_container">
      <Box className="logo"></Box>
      <Box className="user_section">
        <Box className="notification">
          <IconButton
            aria-label="notification"
            onClick={handleNotificationClick}
            aria-describedby={notificationId}
          >
            <Badge badgeContent={notification?.length} color="success">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            id={notificationId}
            open={notificationOpen}
            anchorEl={notificationAnchorEl}
            PaperProps={{
              style: {
                borderRadius: "10px",
                overflow: "initial",
                border: "1px solid black",
                maxHeight: "max-content",
              },
            }}
            sx={{ maxHeight: "200px", borderRadius: "20px" }}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box
              sx={{
                backgroundColor: "gray",
                textAlign: "center",
                padding: "8px",
                minWidth: "250px",
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
              }}
            >
              Notification
            </Box>
            {!notification?.length && (
              <Typography sx={{ textAlign: "center" }}>
                No New Messages
              </Typography>
            )}

            {notification && (
              <List sx={{}}>
                {notification?.map((notify) => (
                  <>
                    <ListItem key={notify?._id}>
                      <ListItemButton
                        onClick={() => {
                          dispatch(
                            UserAction.setSelectedChat({ value: notify.chat })
                          );
                          dispatch(UserAction.setChats({ value: notify.chat }));
                          dispatch(
                            UserAction.setNotification({
                              value: notification.filter(
                                (n) => n.chat._id !== notify.chat._id
                              ),
                              type: "remove",
                            })
                          );
                          handleNotificationClose();
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", gap: "1rem " }}>
                              <MarkUnreadChatAltOutlinedIcon />
                              <Stack>
                                <Box>
                                  {notify?.chat?.isGroupChat
                                    ? `${notify?.chat?.chatName}`
                                    : `${notify?.sender?.name} `}
                                </Box>
                                <Box>
                                  Message=>{" "}
                                  {notify?.content?.length > 10
                                    ? `${notify?.content?.substring(0, 10)}...`
                                    : notify?.content}
                                </Box>
                              </Stack>
                              <Typography></Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            )}
          </Popover>
        </Box>
        <Box className="profile">
          <IconButton onClick={handleProfileClick} aria-describedby={profileId}>
            <Avatar alt="Remy Sharp" src={user?.pic} />
          </IconButton>

          <Popover
            id={profileId}
            open={profileOpen}
            anchorEl={profileAnchorEl}
            PaperProps={{
              style: {
                borderRadius: "10px",
              },
            }}
            onClose={handleProfileClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }}>Name : {user?.name}</Typography>
            <Typography sx={{ p: 2 }}>Email : {user?.email}</Typography>
          </Popover>
        </Box>
        <Box className="logout">
          <IconButton onClick={logoutHandler}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
