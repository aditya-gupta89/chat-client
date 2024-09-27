import React from "react";
import "./CreateChat.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { Autocomplete, Divider, Stack, TextField } from "@mui/material";
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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const CreateChat = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector((state) => state.user.users);
  const [searchResult, setSearchResult] = React.useState([]);
  const chats = useSelector((state) => state.user.chats);
  const [loading, setLoading] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState();
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

  const accessChat = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5001/api/chat`,
        { userId: selectedUsers._id },
        config
      );

      if (!chats.find((c) => c._id === data._id))
        dispatch(UserAction.setChats({ value: data }));
      dispatch(UserAction.setSelectedChat({ value: data }));

      setLoading(false);
      handleClose();
    } catch (error) {
      toast.error("Error fetching the chat");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" className="btn">
        <span>Add New Chat</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a chat
          </Typography>
          <Box display="flex" flexDirection="row">
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
              onClick={accessChat}
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

export default CreateChat;
