"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import "./forgetPasswordPage.css";  // Import the CSS file

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะของ Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความใน Snackbar
  const router = useRouter();

  const handleSendLink = () => {
    if (email) {
      // ส่งอีเมลสำเร็จ
      setSnackbarMessage("ลิงค์รีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลของคุณแล้ว");
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/forget_password/OTP"); // ไปยังหน้า OTP
      }, 1500);
    } else {
      // ถ้าไม่มีอีเมลกรอก
      setSnackbarMessage("กรุณากรอกอีเมลของคุณ");
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="app">
      <main className="content">
        <div className="background-layer" />
        <div className="relative-container">
          <div className="grid-container">
            <div className="col-span-12">
              <TopBar textColor={"white"} />
            </div>
            <div className="center-content">
              <Box className="forget-password-box">
                <h2 className="forget-password-title">Reset Your Password</h2>
                <TextField
                  label="Enter Your Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginBottom: "16px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendLink}
                  className="forget-password-button"
                >
                  Send Reset Link
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
          severity={email ? "success" : "error"} // ถ้ามีอีเมลใช้สีเขียว (success) ถ้าไม่มีใช้สีแดง (error)
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ForgetPasswordPage;
