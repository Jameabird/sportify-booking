"use client";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";

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
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/gym_bg2.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            zIndex: -1,
          }}
        />
        <div className="relative h-full w-full">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <TopBar textColor={"white"} />
            </div>
            <div className="col-span-12 flex justify-center items-center">
              <Box
                sx={{
                  width: "400px",
                  padding: "24px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                  textAlign: "center",
                }}
              >
                <h2 style={{ marginBottom: "16px", color: "rgba(70, 80, 100, 0.9)" }}>
                  Enter OTP
                </h2>
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
                  sx={{
                    backgroundColor: "#f57c00",
                    "&:hover": {
                      backgroundColor: "#ff9800",
                    },
                  }}
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
