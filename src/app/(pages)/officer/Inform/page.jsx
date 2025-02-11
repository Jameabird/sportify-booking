"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import "./informPage.css"; // นำเข้าไฟล์ CSS

export default function inform() {
  const [issueType, setIssueType] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const issueOptions = [
    "บันทึกข้อมูลการเสียหาย",
    "แจ้งซ่อมบำรุง",
    "ปัญหาการจอง",
    "อื่นๆ",
  ];

  const handleSubmit = () => {
    if (!issueType || !title || !details) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setOpenSnackbar(true);
    setIssueType("");
    setTitle("");
    setDetails("");
  };

  return (
    <Box className="inform-container">
      <Typography variant="h4" className="inform-title">
        แจ้งปัญหาไปยังเจ้าของสนาม
      </Typography>

      {/* Dropdown เลือกหัวข้อ */}
      <FormControl className="dropdown">
        <InputLabel>เลือกหัวข้อ</InputLabel>
        <Select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
          {issueOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* กล่องข้อความใส่ชื่อเรื่อง */}
      <TextField
        label="ชื่อเรื่อง"
        variant="outlined"
        fullWidth
        className="input-box"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* กล่องข้อความใส่รายละเอียด */}
      <TextField
        label="รายละเอียด"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        className="input-box"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      {/* ปุ่มส่งคำร้อง & ยกเลิก */}
      <Box className="button-group">
        <Button variant="contained" color="secondary" onClick={() => { setIssueType(""); setTitle(""); setDetails(""); }}>
          ยกเลิก
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          ส่งคำร้อง
        </Button>
      </Box>

      {/* Snackbar แจ้งเตือน */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          แจ้งเตือนไปยัง Owner แล้ว!
        </Alert>
      </Snackbar>
    </Box>
  );
}
