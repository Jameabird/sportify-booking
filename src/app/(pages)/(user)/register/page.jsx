"use client";

import React, { useState } from "react";
import axios from "axios"; // นำเข้า axios
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
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation"; // ใช้ next/navigation แทน next/router
import "./registerPage.css";

const RegisterPage = () => {
  const [bank, setBank] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState(""); // เพิ่ม state สำหรับ username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(""); // ข้อความของ Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะการแสดง Snackbar
  const router = useRouter();

  const handleBankChange = (event) => {
    setBank(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // ฟังก์ชันตรวจสอบรหัสผ่าน
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  // ฟังก์ชันตรวจสอบว่ากรอกข้อมูลครบหรือไม่
  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setSnackbarMessage("กรุณากรอก Username, Email, Password และ Confirm Password ให้ครบ");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
  
    if (!validatePassword(password)) {
      setSnackbarMessage("รหัสผ่านต้องมีตัวอักษรใหญ่, ตัวเลข, และตัวอักษรพิเศษ");
      setOpenSnackbar(true);
      return;
    }
  
    if (password !== confirmPassword) {
      setSnackbarMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        bank,
        accountNumber,
      };
  
      // Log user data before sending
      console.log(userData);
  
      const response = await axios.post("http://localhost:5011/api/register", userData, {
        headers: {
          "Content-Type": "application/json", // Use JSON instead of FormData
        },
      });
  
      if (response.status === 201) {
        setSnackbarMessage("ลงทะเบียนสำเร็จ!");
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      if (error.response) {
        console.error("❌ Error Response Data:", error.response.data);
        console.error("❌ Error Status Code:", error.response.status);
  
        // Check error message based on the status code
        if (error.response.status === 400) {
          setSnackbarMessage(error.response.data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
        } else if (error.response.status === 500) {
          setSnackbarMessage("เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
        } else {
          setSnackbarMessage("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        }
      } else if (error.request) {
        console.error("❌ No response received from server:", error.request);
        setSnackbarMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ตของคุณ");
      } else {
        console.error("❌ Unexpected Error:", error.message);
        setSnackbarMessage("เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
  
      setOpenSnackbar(true);
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
              <Box className="register-container">
                <h2 className="register-title">Create an Account</h2>

                {/* เพิ่มกล่องข้อความ Username */}
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <h3 style={{
                  color: "#d32f2f",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "10px",
                  backgroundColor: "#ffebee",
                  padding: "8px",
                  borderRadius: "5px"
                }}>
                  รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วย ตัวอักษรพิมพ์ใหญ่ (A-Z), ตัวเลข (0-9) และอักขระพิเศษ (@$!%*?&)
                </h3>
                {/* เพิ่มข้อความ Bank Details ตรงนี้ */}
                <h2 className="register-title">Bank Details</h2>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <FormControl fullWidth sx={{ marginBottom: "16px" }}>
                  <InputLabel id="bank-select-label">Bank</InputLabel>
                  <Select
                    labelId="bank-select-label"
                    value={bank}
                    onChange={handleBankChange}
                    label="Bank"
                  >
                    <MenuItem value="PromptPay"> PromptPay </MenuItem>
                    <MenuItem value="BAAC">เพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)</MenuItem>
                    <MenuItem value="SCB">ไทยพาณิชย์ (SCB)</MenuItem>
                    <MenuItem value="KBank">กสิกรไทย (KBank)</MenuItem>
                    <MenuItem value="Krungthai">กรุงไทย (Krungthai)</MenuItem>
                    <MenuItem value="TTB">ทีทีบี (TTB)</MenuItem>
                    <MenuItem value="BBL">กรุงเทพ (BBL)</MenuItem>
                    <MenuItem value="KBank">กสิกรไทย (KBank)</MenuItem>
                    <MenuItem value="Krungsri">กรุงศรีอยุธยา (Krungsri)</MenuItem>
                    <MenuItem value="Thanachart">ธนชาต (Thanachart)</MenuItem>
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
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
                <h3 style={{
                  color: "#d32f2f",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "10px",
                  backgroundColor: "#ffebee",
                  padding: "8px",
                  borderRadius: "5px"
                }}>
                  เพื่อยืนยันเเละใช้ในการคืนเงินเพื่อยกเลิกการจอง สามารถใส่ข้อมูลในภายหลังได้ที่ settings
                  ถ้าไม่ใส่การคืนเงินให้ทางผู้ใช้งานจะถือเป็นโมฆะ
                </h3>
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

      {/* Snackbar แจ้งเตือน */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisterPage;
