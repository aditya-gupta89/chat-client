import React from "react";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./Auth.css";
import Login from "../../components/Auth/Login/Login";
import { Signup } from "../../components/Auth/Signup/Signup";

const Auth = () => {
  const [activeTab, setActiveTab] = React.useState("1");

  return (
    <Box className="auth_container">
      <Box className="header" sx={{ fontSize: "2rem" }}>
        Chat Application
      </Box>
      <Box className="auth">
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-evenly",
            },
          }}
        >
          <Tab value="1" label="LogIn" />
          <Tab value="2" label="SignUp" />
        </Tabs>
        {activeTab === "1" && <Login />}
        {activeTab === "2" && <Signup />}
      </Box>
    </Box>
  );
};

export default Auth;
