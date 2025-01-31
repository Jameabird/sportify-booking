"use client";
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation"; // Import useRouter
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import "./loginPage.css"; // Import CSS

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

  const handleGoogleLogin = (response) => {
    // Handle the response from Google login
    console.log(response);
    if (response?.credential) {
      // Handle successful Google login
      router.push("/home");
    } else {
      console.log("Google login failed");
    }
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
                  label="Email Address"
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
                <Box sx={{ textAlign: "right", marginBottom: "16px" }}>
                  <a href="/forget_password/main" className="link">
                    Forget Password?
                  </a>
                </Box>
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

                <GoogleOAuthProvider clientId="160660169940-jovtts08pu9olgt12494uc3sc5oo7u1c.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={handleGoogleLogin}
                    useOneTap
                    size="large"
                    shape="pill"
                    theme="outline"
                    className="google-login" // เพิ่ม class นี้
                  />
                </GoogleOAuthProvider>

                <Box className="sign-up">
                  <p>
                    Don't have an account?{" "}
                    <a href="/register" className="link">
                      Sign up
                    </a>
                  </p>
                </Box>
              </Box>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
