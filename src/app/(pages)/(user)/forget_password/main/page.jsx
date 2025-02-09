"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import "./forgetPasswordPage.css";  // Import the CSS file
import axios from 'axios';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะของ Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความใน Snackbar
  const router = useRouter();

  const handleSendLink = async () => {
    if (email) {
      console.log("Sending reset link to email:", email);  // ดูค่าของ email ที่จะส่ง
      try {
        // ส่งคำขอไปยัง backend เพื่อเช็คอีเมล
        await axios.post('http://localhost:5000/api/forget-password', { email });
        
        setSnackbarMessage("ลิงค์รีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลของคุณแล้ว");
        setOpenSnackbar(true);
  
        setTimeout(() => {
          router.push(`/forget_password/OTP?email=${email}`);
        }, 1500);
        
      } catch (error) {
        if (error.response) {
          setSnackbarMessage(error.response.data); // ข้อความจากเซิร์ฟเวอร์
        } else {
          setSnackbarMessage('ไม่สามารถส่งลิงค์รีเซ็ตรหัสผ่านได้');
        }
        setOpenSnackbar(true);
      }
    } else {
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
