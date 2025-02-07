"use client";
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, InputAdornment, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation"; // ใช้ useRouter สำหรับนำทาง
import "./resetPasswordPage.css"; // Importing the CSS

const ResetPasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะการแสดง Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความที่จะแสดงใน Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // สถานะของ Snackbar (success/error)

  const router = useRouter(); // ใช้ router สำหรับนำทางไปยัง /login

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => {
    // ต้องมีตัวอักษรพิมพ์ใหญ่, ตัวเลข, และตัวอักษรพิเศษ
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleResetPassword = () => {
    if (!validatePassword(newPassword)) {
      setSnackbarMessage("รหัสผ่านต้องมีตัวพิมพ์ใหญ่, ตัวเลข, และอักขระพิเศษอย่างน้อย 1 ตัว");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (newPassword === confirmPassword) {
      setSnackbarMessage("Password reset successfully!");
      setSnackbarSeverity("success"); // ถ้า reset สำเร็จ
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/login"); // นำทางไปยังหน้า login หลังจากรีเซ็ตรหัสผ่านสำเร็จ
      }, 1500);
    } else {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarSeverity("error"); // ถ้ารหัสผ่านไม่ตรงกัน
      setOpenSnackbar(true);
    }
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
              <Box className="reset-password-container">
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
                  className="reset-password-button"
                >
                  Reset Password
                </Button>
              </Box>
            </div>
          </div>
        </div>
      </main>

      {/* Snackbar แจ้งเตือน */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity} // ใช้ severity เป็น success หรือ error
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ResetPasswordPage;
