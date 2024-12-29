"use client";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter(); // สร้าง router object

  const handleSendLink = () => {
    if (email) {
      // คุณสามารถเพิ่มการตรวจสอบรูปแบบอีเมลได้ที่นี่
      router.push("/forget_password/page2"); // นำทางไปยังหน้า OTP
    } else {
      alert("Please enter your email.");
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
                  Reset Your Password
                </h2>
                <TextField
                  label="Enter Your Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // อัปเดต state เมื่อกรอกอีเมล
                  sx={{ marginBottom: "16px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSendLink} // เมื่อคลิกจะไปที่หน้า OTP
                  sx={{
                    backgroundColor: "#f57c00",
                    "&:hover": {
                      backgroundColor: "#ff9800",
                    },
                  }}
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
