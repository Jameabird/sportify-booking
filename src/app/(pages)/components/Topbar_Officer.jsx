"use client";
import { Box, Avatar, Menu, MenuItem, Typography, IconButton, Badge } from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_Officer = (props) => {
  const [anchorEl, setAnchorEl] = useState(null); // สำหรับเปิด/ปิดเมนู Avatar
  const [mailCount, setMailCount] = useState(0); // กำหนดค่าเริ่มต้นให้ mailCount
  const currentPath = usePathname();
  const router = useRouter();

  // เปิดเมนูเมื่อคลิก Avatar
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInboxClick = () => {
    router.push("/officer/inbox");
  };

  // ปิดเมนู
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ฟังก์ชันเปลี่ยนหน้า
  const navigateTo = (path) => {
    router.push(path);
    handleClose();
  };

  const getLinkStyle = (path) => ({
    padding: "0 15px",
    color: currentPath === path ? "#1e40af" : props.textColor, // เปลี่ยนเป็นสีน้ำเงินถ้า path ตรงกับ currentPath
    fontSize: "1.25rem",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      color: "#1e40af", // เปลี่ยนสีตอน hover ให้เป็นสีน้ำเงิน
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // ทำสิ่งที่ต้องการเช่นการเช็คสิทธิ์ของผู้ใช้ตาม role
      console.log("Token:", token);
      console.log("Role:", role);
    } else {
      // หากไม่มี token หรือ role ก็อาจจะทำการรีไดเรกต์ไปยังหน้า login
      router.push("/login");
    }

    // ตัวอย่างการดึงข้อมูล mailCount จาก API หรือ backend
    // ตัวอย่างจำลองการตั้งค่า mailCount
    setMailCount(5); // เช่นจำนวนอีเมลหรือการแจ้งเตือนที่ยังไม่ได้อ่าน
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* LOGO */}
      <Box display="flex" alignItems="center">
        <Link href="/">
          <div className="text-3xl font-bold flex pl-10">
            <div style={{ color: props.textColor }}>SPORTIFY</div>
            <div className="pl-2" style={{ color: "#1e40af" }}>BOOKING</div> {/* เปลี่ยนสีเป็นน้ำเงิน */}
          </div>
        </Link>
      </Box>

      {/* เมนูหลัก */}
      <Box display="flex" alignItems="center">
        <Link href="/officer" style={getLinkStyle("/officer")}>
          Home
        </Link>
        {/* Avatar User */}
        <Box sx={{ padding: "0 15px" }}>
          <Avatar
            sx={{ cursor: "pointer", width: 35, height: 35 }}
            onClick={handleAvatarClick}
            alt="Office Logo"
          />
        </Box>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => navigateTo("/officer/setting")}>
          <Typography variant="body1">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography variant="body1">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopBar_Officer;
