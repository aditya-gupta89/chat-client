import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import { Divider, IconButton, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UserAction } from "../../redux/userSlice";

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

const RenameGroup = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const users = useSelector((state) => state.user.users);
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const [groupChatName, setGroupChatName] = React.useState(
    selectedChat?.chatName
  );
  const handleRename = async () => {
    if (!groupChatName) {
      toast.error("Please Enter the group chat name");
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
        `http://localhost:5001/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      toast.success("Group Name is updated");

      dispatch(UserAction.setSelectedChat({ value: data }));
      dispatch(UserAction.trigerGroupEvent());
      handleClose();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occuredd, Group data is not updated");
      setLoading(false);
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="edit">
        <EditIcon size="small" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Group Name
          </Typography>
          <Divider sx={{ marginTop: ".5rem" }} />
          <TextField
            variant="standard"
            fullWidth
            onChange={(event) => setGroupChatName(event.target.value)}
            value={groupChatName}
            placeholder="Please Enter the Group Name"
            sx={{ marginTop: "1rem" }}
          />
          <Stack
            flexDirection="row"
            sx={{ marginTop: "1.5rem" }}
            justifyContent="end"
            gap="1rem"
          >
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              onClick={handleRename}
              loading={loading}
              variant="contained"
            >
              Update
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default RenameGroup;
