import {
  Typography,
  Box,
  TextField,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { UserAction } from "../../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/api/user/login",
        { email, password },
        config
      );
      toast("Login Successful");

      localStorage.setItem("userInfo", JSON.stringify(data));
      dispatch(UserAction.setUser());
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast("Provided credentials are invalid.");
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box className="forms">
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
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Please Enter Your Email Address"
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
        <LoadingButton
          variant="contained"
          sx={{ marginTop: "1rem" }}
          loading={loading}
          onClick={submitHandler}
        >
          Login
        </LoadingButton>
        {/* <Button variant="contained" disabled="true" color="error">
          Get Guest User
        </Button> */}
      </Box>
    </>
  );
};

export default Login;
