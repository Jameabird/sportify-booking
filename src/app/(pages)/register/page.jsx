"use client";
import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import TopBar from "@components/Topbar";

const RegisterPage = () => {
  const [bank, setBank] = useState("");

  const handleBankChange = (event) => {
    setBank(event.target.value);
  };

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        {/* พื้นหลังเลเยอร์ */}
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
          {/* Grid สำหรับ TopBar */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <TopBar textColor={"white"} />
            </div>
            {/* กล่องสำหรับ Register */}
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
                  Create an Account
                </h2>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                />
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                />
                {/* Dropdown เลือกธนาคาร */}
                <FormControl fullWidth sx={{ marginBottom: "16px" }}>
                  <InputLabel id="bank-select-label">Bank</InputLabel>
                  <Select
                    labelId="bank-select-label"
                    value={bank}
                    onChange={handleBankChange}
                    label="Bank"
                  >
                    <MenuItem value="BAAC">BAAC</MenuItem>
                    <MenuItem value="SCB">SCB</MenuItem>
                    <MenuItem value="K-Bank">K-Bank</MenuItem>
                    <MenuItem value="Krungthai">Krungthai</MenuItem>
                    <MenuItem value="TTB">TTB</MenuItem>
                    <MenuItem value="Promptpay">Promptpay</MenuItem>
                  </Select>
                </FormControl>
                {/* ช่องกรอกเลขบัญชี */}
                <TextField
                  label="Account Number"
                  type="text" // เปลี่ยนจาก number เป็น text
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    maxLength: 10,
                  }}
                  sx={{ marginBottom: "16px" }}
                />
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
                >
                  Register
                </Button>
                <Box
                  sx={{
                    marginTop: "16px",
                    color: "rgba(70, 80, 100, 0.9)",
                  }}
                >
                  <p>
                    Already have an account?{" "}
                    <a href="/login" style={{ color: "#f57c00", textDecoration: "none" }}>
                      Login
                    </a>
                  </p>
                </Box>
              </Box>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
