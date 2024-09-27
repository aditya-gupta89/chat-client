import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./CreateGroup.css";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider, Stack, TextField } from "@mui/material";
import { UserAction } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  borderRadius: "16px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

export default function CreateGroup() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [searchResult, setSearchResult] = React.useState([]);
  const [groupChatName, setGroupChatName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${users.token}`,
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the fields");

      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${users.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5001/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      handleClose();

      dispatch(UserAction.setChats({ value: data }));
      dispatch(UserAction.trigerGroupEvent());

      toast.success("New Group Chat Created");
    } catch (error) {
      toast.error("Failed to create the chart");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" className="btn">
        <span>Add New Group</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please Create the Group
          </Typography>
          <Divider sx={{ margin: ".5rem 0" }} />
          <Box className="forms_container">
            <Box className="fields">
              <Typography variant={"body1"}>
                Group Name&nbsp;
                <Typography
                  sx={{ color: "red" }}
                  component={"span"}
                  variant={"body1"}
                >
                  *
                </Typography>
              </Typography>
              <TextField
                variant="outlined"
                onChange={(event) => setGroupChatName(event.target.value)}
                placeholder="Please Enter the group Name"
                fullWidth
              />
            </Box>
            <Box className="fields">
              <Typography variant={"body1"}>
                Please Select the User For Group&nbsp;
                <Typography
                  sx={{ color: "red" }}
                  component={"span"}
                  variant={"body1"}
                >
                  *
                </Typography>
              </Typography>
              <Autocomplete
                multiple
                id="tags-standard"
                options={searchResult}
                onChange={(event, select) => setSelectedUsers(select)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Please Select the Users"
                  />
                )}
              />
            </Box>
            <Stack justifyContent="end" gap="1rem" flexDirection="row">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ width: "150px" }}
              >
                Create Chat
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
