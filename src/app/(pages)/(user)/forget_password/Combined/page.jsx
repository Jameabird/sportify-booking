"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, IconButton, InputAdornment, Snackbar, Alert, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import axios from 'axios';  // Added for OTP functionality
import "./combinedPage.css";  // Importing the CSS

const CombinedPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Tracks if OTP is verified
  const router = useRouter();

  const handleToggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const handleToggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setSnackbarMessage("รหัสผ่านต้องมีตัวพิมพ์ใหญ่, ตัวเลข, และอักขระพิเศษรวมอย่างน้อย 8 ตัว ");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbarMessage("รหัสผ่านไม่ตรงกัน");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      // ส่งคำขอไปที่ API สำหรับรีเซ็ตรหัสผ่าน
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        otp: otp,               // OTP ที่ผู้ใช้กรอก
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });

      // ถ้าสำเร็จ
      setSnackbarMessage("Password reset successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // นำทางไปยังหน้า Login
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      // ถ้ามีข้อผิดพลาดในการรีเซ็ตรหัสผ่าน
      const errorMessage = error.response ? error.response.data : 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };


  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      if (timeLeft === 0) {
        setSnackbarMessage("OTP หมดอายุ กรุณาขอรหัสใหม่");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:5000/api/verify-otp", { otp });
        setSnackbarMessage("OTP ถูกต้อง!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setIsOtpVerified(true); // Mark OTP as verified
      } catch (error) {
        setSnackbarMessage(error.response ? error.response.data : "เกิดข้อผิดพลาด");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("กรุณากรอก OTP 6 หลักที่ถูกต้อง");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // แปลงเวลาที่เหลือเป็น นาที:วินาที
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <main className="content">
        <div className="background-layer" />
        <div className="relative h-full w-full">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <TopBar textColor={"white"} />
            </div>
            <div className="col-span-12 flex justify-center items-center">
              <Box className="otp-password-container">
                {!isOtpVerified ? (
                  <>
                    <h2 className="otp-title">Enter OTP</h2>
                    <TextField
                      label="6-digit OTP"
                      variant="outlined"
                      fullWidth
                      value={otp}
                      onChange={handleOtpChange}
                      inputProps={{ maxLength: 6 }}
                      sx={{ marginBottom: "16px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </Button>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: "15px" }}>
                      โปรดใส่ OTP ภายใน {formatTime(timeLeft)} นาที
                    </Typography>
                  </>
                ) : (
                  <>
                    <h2 className="reset-password-title">Reset Password</h2>
                    <TextField
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      sx={{ marginBottom: "16px" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleToggleNewPasswordVisibility}
                              edge="end"
                              aria-label="toggle new password visibility"
                            >
                              {showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{ marginBottom: "16px" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleToggleConfirmPasswordVisibility}
                              edge="end"
                              aria-label="toggle confirm password visibility"
                            >
                              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </Button>
                    <h3 style={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginBottom: "10px",
                      backgroundColor: "#ffebee",
                      padding: "8px",
                      borderRadius: "5px"
                    }}>
                      รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วย ตัวอักษรพิมพ์ใหญ่ (A-Z), ตัวเลข (0-9) และอักขระพิเศษ (@$!%*?&)
                    </h3>
                  </>
                )}
              </Box>
            </div>
          </div>
        </div>
      </main>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CombinedPage;
