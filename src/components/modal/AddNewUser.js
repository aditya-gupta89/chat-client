import React from "react";
import "./CreateChat.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Divider,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { UserAction } from "../../redux/userSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  borderRadius: "10px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const AddNewUser = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector((state) => state.user.users);
  const [searchResult, setSearchResult] = React.useState([]);
  const chats = useSelector((state) => state.user.chats);
  const [loading, setLoading] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const users = useSelector((state) => state.user.users);
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5001/api/user`,
          config
        );
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast.error("Error Occured User data is not fetched");
      }
    };
    fetch();
  }, []);

  //   const accessChat = async () => {
  //     try {
  //       setLoading(true);
  //       const config = {
  //         headers: {
  //           "Content-type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       };
  //       const { data } = await axios.post(
  //         `http://localhost:5001/api/chat`,
  //         { userId: selectedUsers._id },
  //         config
  //       );

  //       if (!chats.find((c) => c._id === data._id))
  //         dispatch(UserAction.setChats({ value: data }));
  //       dispatch(UserAction.setSelectedChat({ value: data }));

  //       setLoading(false);
  //       handleClose();
  //     } catch (error) {
  //       toast.error("Error fetching the chat");
  //     }
  //   };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === selectedUsers._id)) {
      toast.error("User Already is group");
      return;
    }

    if (selectedChat.groupAdmin._id !== users._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${users.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5001/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: selectedUsers._id,
        },
        config
      );
      toast.success(`${selectedUsers.name} has added in the group`);

      dispatch(UserAction.setSelectedChat({ value: data }));
      setSelectedUsers([]);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setLoading(false);
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="add">
        <AddIcon size="small" />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a new user in the group
          </Typography>
          <Box display="flex" flexDirection="row" sx={{ marginBottom: "1rem" }}>
            {/* <Typography id="modal-modal-description" sx={{ mt: 2, flex: "3" }}>
              User
            </Typography> */}
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              onChange={(event, select) => setSelectedUsers(select)}
              options={searchResult}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300, marginTop: "10px", flex: "7" }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  placeholder="Please Enter the Name"
                  {...params}
                />
              )}
            />
          </Box>
          {/* <Divider sx={{ marginTop: "1rem" }} /> */}
          <Stack
            flexDirection="row"
            sx={{ marginTop: "1rem" }}
            justifyContent="end"
            gap="1rem"
          >
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              onClick={handleAddUser}
              loading={loading}
              variant="contained"
            >
              Add User
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default AddNewUser;
