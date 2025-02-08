"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import './OtpPage.css'; // Import the CSS file

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะของ Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความใน Snackbar
  const router = useRouter();

  const handleVerify = () => {
    if (otp.length === 6) {
      // ถ้า OTP ถูกต้อง
      setSnackbarMessage("OTP ถูกต้อง!");
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/forget_password/Reset"); // ไปยังหน้า reset password
      }, 1500);
    } else {
      // ถ้า OTP ไม่ถูกต้อง
      setSnackbarMessage("กรุณากรอก OTP 6 หลักที่ถูกต้อง");
      setOpenSnackbar(true);
    }
  };

  const handleOtpChange = (e) => {
    // กรองให้กรอกแค่ตัวเลขและจำกัดให้ไม่เกิน 6 ตัว
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // ลบตัวอักษรที่ไม่ใช่ตัวเลข และจำกัดที่ 6 ตัว
    setOtp(value);
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
              <Box className="otp-container">
                <h2 className="otp-title">Enter OTP</h2>
                <TextField
                  label="6-digit OTP"
                  variant="outlined"
                  fullWidth
                  value={otp}
                  onChange={handleOtpChange}  // ใช้ฟังก์ชันนี้ในการจัดการการเปลี่ยนแปลง
                  inputProps={{ maxLength: 6 }}
                  sx={{ marginBottom: "16px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleVerify}
                  className="otp-button" // Use the class name
                >
                  Verify OTP
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
          severity={otp.length === 6 ? "success" : "error"} // ถ้า OTP ถูกต้องให้สีเขียว (success) ถ้าไม่ถูกต้องให้สีแดง (error)
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OtpPage;
