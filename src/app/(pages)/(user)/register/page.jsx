"use client"; // Marking this as a client component

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
import { useRouter } from "next/navigation"; // ใช้ next/navigation แทน next/router
import "./registerPage.css";

const RegisterPage = () => {
  const [bank, setBank] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null); // State for holding image file
  const router = useRouter(); // ใช้ useRouter จาก next/navigation

  const handleBankChange = (event) => {
    setBank(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Show the selected image as preview
    }
  };

  // ฟังก์ชันเมื่อกด Register
  const handleRegister = () => {
    // ทำการลงทะเบียน (คุณสามารถทำการเรียก API ที่นี่ได้)
    // หลังจากลงทะเบียนเสร็จ ให้เปลี่ยนไปหน้า login
    router.push("/login"); // เปลี่ยนเส้นทางไปหน้า login
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
                <Box sx={{ marginBottom: "16px" }}>
                  <h3 className="register-title">Bank Image</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: "100%" }}
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      style={{ marginTop: "16px", maxWidth: "100%" }}
                    />
                  )}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="register-button"
                  onClick={handleRegister} // เรียกฟังก์ชัน handleRegister เมื่อกดปุ่ม
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
