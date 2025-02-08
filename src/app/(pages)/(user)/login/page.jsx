"use client";
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, InputAdornment, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import TopBar from "@components/Topbar";
import "./loginPage.css";

const users = [
  { email: "user@example.com", password: "password123", role: "user" },
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "owner@example.com", password: "owner123", role: "owner" },
  { email: "officer@example.com", password: "officer123", role: "officer" },
];

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // สำหรับข้อความแสดงใน Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // สำหรับความรุนแรงของ Snackbar (success / error)
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      setSnackbarMessage("เข้าสู่ระบบสำเร็จ!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } else {
      setSnackbarMessage("ข้อมูลรหัสผู้ใช้ไม่ถูกต้อง");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleGoogleLogin = (response) => {
    if (response?.credential) {
      setSnackbarMessage("เข้าสู่ระบบสำเร็จ!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } else {
      setSnackbarMessage("การเข้าสู่ระบบผ่าน Google ล้มเหลว");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
                    className="google-login"
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

      {/* Snackbar แจ้งเตือน */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
