"use client";
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import "./loginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    router.push("/home");
  };

  return (
    <div className="app">
      <main className="content">
        <div className="background" />
        <div className="relative-container">
          <div className="grid-container">
            <div className="top-bar">
              <TopBar textColor={"white"} />
            </div>
            <div className="col-span-12 flex justify-center items-center">
              <Box className="login-box">
                <h2 className="welcome-text">Welcome to Sportify Booking</h2>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    backgroundColor: "#f57c00",
                    "&:hover": {
                      backgroundColor: "#ff9800",
                    },
                  }}
                  className="login-button"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Box>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
