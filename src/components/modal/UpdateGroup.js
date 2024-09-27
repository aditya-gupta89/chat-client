import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { UserAction } from "../../redux/userSlice";
import Avatar from "../chatList/Avatar";
import AddNewUser from "./AddNewUser";
import RenameGroup from "./RenameGroup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width:"fit-content",
  borderRadius: "10px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UpdateGroup() {
  const [open, setOpen] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const users = useSelector((state) => state.user.users);

  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // React.useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       setLoading(true);
  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${users.token}`,
  //         },
  //       };
  //       const { data } = await axios.get(
  //         `http://localhost:5001/api/user`,
  //         config
  //       );

  //       setLoading(false);
  //       setSearchResult(data);
  //     } catch (error) {
  //       toast.error("Error Occurred User data is not fetch");
  //     }
  //   };
  //   fetch();
  // }, []);

  const handleRemove = async (user1) => {
    if (selectedChat === null)
      toast("Please select the chat for leave the group ");
    if (selectedChat.groupAdmin._id !== users._id && user1._id !== users._id) {
      toast.error("Only admins can remove someone");
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
        `http://localhost:5001/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === users._id
        ? dispatch(UserAction.setSelectedChat({ value: null }))
        : dispatch(UserAction.setSelectedChat({ value: data }));
      if (user1._id === users._id) {
        handleClose();
        toast.success("You have left the Group");
      } else toast.success(`you have remove the ${user1.name} `);

      setLoading(false);
    } catch (error) {
      toast.error("Error Occured");
      setLoading(false);
    }
  };

  console.log(selectedChat);
  return (
    <div>
      <Button onClick={handleOpen} variant="contained">
        Group Details
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedChat?.chatName}
            </Typography>
            <RenameGroup />
          </Box>
          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0.5rem 0 1rem 0",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Group Member
            </Typography>
            <AddNewUser />
          </Box>
          <Divider />

          <TableContainer
            component={Paper}
            sx={{ overflowY: "scroll", maxHeight: "300px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedChat !== null &&
                  selectedChat.users?.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "16px  4px 8px 16px",
                        }}
                      >
                        <Avatar isOnline="active" image={row.pic} />
                        {row.name}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ padding: "16px  4px 8px 16px" }}
                      >
                        {row?.email}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ padding: "16px  4px 8px 16px" }}
                      >
                        {row?._id === selectedChat?.groupAdmin?._id
                          ? "Admin"
                          : ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ padding: "16px  4px 8px 16px" }}
                      >
                        <IconButton
                          onClick={() => handleRemove(row)}
                          edge="end"
                          disabled={
                            selectedChat?.groupAdmin?._id !== users?._id
                          }
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <Box sx={{ overflowY: "scroll", maxHeight: "150px" }}>
            {selectedChat !== null &&
              selectedChat.users?.map((u) => (
                <>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        onClick={() => handleRemove(u)}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={u.name} />
                  </ListItem>
                </>
              ))}
          </Box> */}
          {/* <Typography sx={{ margin: ".5rem 0" }}>Group Name</Typography>
          <Stack
            justifyContent="space-between"
            gap=".5rem"
            flexDirection="row"
            sx={{ width: "100%" }}
          >
            <TextField
              variant="outlined"
              size="small"
              onChange={(event) => setGroupChatName(event.target.value)}
              value={groupChatName}
            />
            <LoadingButton
              sx={{ width: "100px" }}
              variant="contained"
              loading={renameLoading}
              onClick={handleRename}
            >
              Update
            </LoadingButton>
          </Stack> */}
          {/* <Typography sx={{ margin: ".5rem 0" }}>Add user</Typography>
          <Stack flexDirection="row" justifyContent="space-between" gap=".5rem">
            <Autocomplete
              id="tags-standard"
              size="small"
              fullWidth
              sx={{ width: "233px" }}
              options={searchResult}
              onChange={(event, select) => setSelectedUsers(select)}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  placeholder="Add User"
                />
              )}
            />
            <LoadingButton
              variant="contained"
              onClick={handleAddUser}
              sx={{ width: "120px", maxHeight: "46px" }}
            >
              Add User
            </LoadingButton>
          </Stack> */}
          <Stack
            flexDirection="row"
            justifyContent="end"
            sx={{ marginTop: "2rem" }}
            gap="1rem"
          >
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              variant="contained"
              disabled={selectedChat?.groupAdmin?._id === users?._id}
              onClick={() => handleRemove(users)}
            >
              Leave Group
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
