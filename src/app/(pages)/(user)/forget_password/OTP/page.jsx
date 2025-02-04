"use client";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import './OtpPage.css'; // Import the CSS file

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    if (otp.length === 6) {
      router.push("/forget_password/Reset"); // เปลี่ยนเส้นทางไปหน้า reset password
    } else {
      alert("Please enter a valid 6-digit OTP.");
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
              <Box className="otp-container">
                <h2 className="otp-title">Enter OTP</h2>
                <TextField
                  label="6-digit OTP"
                  variant="outlined"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
    </div>
  );
};

export default OtpPage;
