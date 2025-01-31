"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import "./registerPage.css";

const RegisterPage = () => {
  const [bank, setBank] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBankChange = (event) => {
    setBank(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              <Box className="register-container">
                <h2 className="register-title">Create an Account</h2>
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
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
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

                {/* เพิ่มข้อความ Bank Details ตรงนี้ */}
                <h2 className="register-title">Bank Details</h2>

                {/* เพิ่มฟิลด์สำหรับชื่อจริงและนามสกุล */}
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                />

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
                  </Select>
                </FormControl>
                <TextField
                  label="Account Number"
                  type="text"
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
                  className="register-button"
                >
                  Register
                </Button>
                <Box className="register-footer">
                  <p>
                    Already have an account?{" "}
                    <a href="/login" className="link">
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
