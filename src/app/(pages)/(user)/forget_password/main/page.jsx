"use client";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import "./forgetPasswordPage.css";  // Import the CSS file

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendLink = () => {
    if (email) {
      router.push("/forget_password/OTP"); // ไปยังหน้า OTP
    } else {
      alert("Please enter your email.");
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
    </div>
  );
};

export default ForgetPasswordPage;
