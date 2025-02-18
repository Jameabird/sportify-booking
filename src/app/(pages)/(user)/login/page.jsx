"use client";
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, InputAdornment, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import TopBar from "@components/Topbar";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./loginPage.css";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // สำหรับข้อความแสดงใน Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // สำหรับความรุนแรงของ Snackbar (success / error)
  const router = useRouter();

  const handleGoogleLogin = async (response) => {
    if (isLoggingIn) return; // ป้องกันการกดล็อกอินซ้ำ
    setIsLoggingIn(true);

    console.log("Google Credential:", response?.credential);

    if (!response?.credential) {
      setSnackbarMessage("การเข้าสู่ระบบผ่าน Google ล้มเหลว");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setIsLoggingIn(false);
      return;
    }

    try {
      const googleToken = response.credential; // รับ Google Token

      // ส่ง Token ไปยัง backend สำหรับการตรวจสอบและเข้าสู่ระบบ
      const res = await axios.post("http://localhost:5000/api/google-login", { token: googleToken });
      console.log("Google Login Response:", res);

      // ดึงข้อมูลจาก response
      const { token, role, message } = res.data;

      if (token) {
        // ✅ Decode JWT Token เพื่อดึงค่า expiration time
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT Payload
        const expirationTime = decoded.exp * 1000; // แปลงเป็น milliseconds

        // ✅ เก็บ token และเวลาหมดอายุใน localStorage
        localStorage.setItem("token", JSON.stringify({ token, expirationTime }));
        console.log("Token saved:", localStorage.getItem("token"));

        // ✅ เก็บข้อมูล role ใน localStorage
        if (role) {
          localStorage.setItem("role", role);
          console.log("Role saved:", localStorage.getItem("role"));
        }

        // ✅ แสดงข้อความ snackbar ที่ได้จาก backend
        setSnackbarMessage(message || "เข้าสู่ระบบสำเร็จ!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // ✅ Redirect based on user role
        setTimeout(() => {
          switch (role) {
            case 'user':
              router.push("/home");
              break;
            case 'officer':
              router.push("/officer");
              break;
            case 'owner':
              router.push("/owner");
              break;
            case 'admin':
              router.push("/admin");
              break;
            default:
              router.push("/home"); // Default path in case of unknown role
          }
        }, 3000); // Time delay for snackbar to show

      } else {
        throw new Error("Token not found in response.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      console.error("Error response data:", error.response?.data);

      // แสดงข้อความ error ให้ชัดเจน
      const errorMessage = error.response?.data?.message || error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoggingIn(false); // Reset login status after process is finished
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (isLoggingIn) return; // ป้องกันการกดล็อกอินซ้ำ
    setIsLoggingIn(true);

    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      setSnackbarMessage("กรุณากรอกข้อมูลให้ครบ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setIsLoggingIn(false);
      return;
    }

    try {
      // ส่งข้อมูลอีเมลและรหัสผ่านไปยัง backend
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      console.log("Login response:", response);

      // ดึงข้อมูลจาก response
      const { token, role, message } = response.data;

      if (token) {
        const expirationTime = Date.now() + 3600000; // กำหนดเวลา expiration ใน 1 ชั่วโมง

        // เก็บ token และเวลาหมดอายุใน localStorage
        localStorage.setItem("token", JSON.stringify({ token, expirationTime }));
        console.log("Token saved:", localStorage.getItem("token"));

        // ใช้ token เพื่อร้องขอข้อมูลผู้ใช้
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data:", userResponse.data);

        // เก็บข้อมูล role ใน localStorage
        if (role) {
          localStorage.setItem("role", role);
          console.log("Role saved:", localStorage.getItem("role"));
        }

        // Set message or navigate based on role
        setSnackbarMessage(message || "เข้าสู่ระบบสำเร็จ!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Redirect based on user role
        const userRole = role;
        setTimeout(() => {
          switch (userRole) {
            case 'user':
              router.push("/home");
              break;
            case 'officer':
              router.push("/officer");
              break;
            case 'owner':
              router.push("/owner");
              break;
            case 'admin':
              router.push("/admin");
              break;
            default:
              router.push("/home"); // Default path in case of unknown role
          }
        }, 3000); // Time delay for snackbar to show

      } else {
        throw new Error("Token not found in response.");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response data:", error.response?.data);
      // แสดงข้อความ error ให้ชัดเจน
      const errorMessage = error.response?.data?.message || error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoggingIn(false); // Reset login status after process is finished
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
                <GoogleOAuthProvider clientId="781146923340-5m1nuui7ccnj3oobg74bgfkprtgiimhe.apps.googleusercontent.com">
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
