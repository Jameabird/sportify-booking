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
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // สำหรับข้อความแสดงใน Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // สำหรับความรุนแรงของ Snackbar (success / error)
  const router = useRouter();

  const handleGoogleLogin = async (response) => {
    if (response?.credential) {
      try {
        const googleToken = response.credential; // รับ Google Token

        // ส่ง Token ไปยัง backend สำหรับการตรวจสอบและเข้าสู่ระบบ
        const res = await axios.post("http://localhost:5000/api/google-login", { token: googleToken });

        // แสดงข้อความ snackbar ที่ได้จาก backend
        setSnackbarMessage(res.data.message || "เข้าสู่ระบบสำเร็จ!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // เก็บข้อมูล token และ role ใน localStorage
        localStorage.setItem("token", res.data.token); // เซฟ token
        localStorage.setItem("role", res.data.role);   // เซฟ role

        // Redirect based on user role (หลังจาก login สำเร็จ)
        const userRole = res.data.role;
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
              router.push("/home");
          }
        }, 1500);
      } catch (error) {
        console.error("Error during Google login:", error);
        setSnackbarMessage("การเข้าสู่ระบบผ่าน Google ล้มเหลว");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("การเข้าสู่ระบบผ่าน Google ล้มเหลว");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    console.log("Email:", email); // ดูว่า email ถูกส่งไปหรือไม่
    console.log("Password:", password); // ดูว่า password ถูกส่งไปหรือไม่

    if (!email || !password) {
      setSnackbarMessage("กรุณากรอกข้อมูลให้ครบ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      console.log("Login response:", response);

      // เก็บข้อมูลใน localStorage
      const { token, role } = response.data; // สมมติว่า API ส่ง token และ role กลับมา
      localStorage.setItem("token", token);  // เก็บ token ใน localStorage
      localStorage.setItem("role", role);    // เก็บ role ใน localStorage

      setSnackbarMessage(response.data.message || "เข้าสู่ระบบสำเร็จ!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Get the user role from the response and redirect accordingly
      const userRole = response.data.role;
      console.log("Role from response:", userRole); // พิมพ์ role ที่ได้รับจาก response

      // ให้เวลาแสดง snackbar ก่อน
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
      }, 3000); // เพิ่มเวลาช้าหน่อย เพื่อให้ snackbar แสดงก่อน
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response data:", error.response?.data);
      setSnackbarMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
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
