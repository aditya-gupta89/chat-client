import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import "./Signup.css";
import { useNavigate } from "react-router";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { UserAction } from "../../../redux/userSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password) {
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5001/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      dispatch(UserAction.setUser());
      navigate("/chat");
    } catch (error) {
      toast.error("Error Occured")
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwrkikpwe");
      fetch("https://api.cloudinary.com/v1_1/dwrkikpwe/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());

          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      setPicLoading(false);
      return;
    }
  };

  return (
    <Box className="forms">
      <Box className="fields">
        <Typography variant={"body1"}>
          Name&nbsp;
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
          placeholder="Please Enter Your Name"
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />
      </Box>
      <Box className="fields">
        <Typography variant={"body1"}>
          Email Address&nbsp;
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
          placeholder="Please Enter Your Email Address"
          onChange={(event) => setEmail(event.target.value)}
          fullWidth
        />
      </Box>
      <Box className="fields">
        <Typography variant={"body1"}>
          Password&nbsp;
          <Typography
            sx={{ color: "red" }}
            component={"span"}
            variant={"body1"}
          >
            *
          </Typography>
        </Typography>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            autoComplete="off"
            id="outlined-adornment-password"
            fullWidth
            placeholder="Please Enter the Password"
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Box className="fields">
        <Typography variant={"body1"}>Upload Picture</Typography>
        <TextField
          variant="outlined"
          type="file"
          onChange={(e) => postDetails(e.target.files[0])}
          fullWidth
        />
      </Box>
      <LoadingButton
        loading={picLoading}
        variant="contained"
        sx={{ marginTop: "1rem" }}
        onClick={submitHandler}
      >
        Signup
      </LoadingButton>
    </Box>
  );
};
