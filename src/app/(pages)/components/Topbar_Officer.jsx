"use client";
import { Box, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_Officer = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const currentPath = usePathname();
  const router = useRouter();

  // เปิดเมนูเมื่อคลิก Avatar
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
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
    color: currentPath.startsWith(path) ? "orange" : props.textColor,
    fontSize: "1.25rem",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      color: "#868dfb",
    },
  });

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
            <div className="pl-2 text-orange-500">BOOKING</div>
          </div>
        </Link>
      </Box>

      {/* เมนูหลัก */}
      <Box display="flex" alignItems="center">
        <Link href="/officer" style={getLinkStyle("/officer")}>
          Home
        </Link>
        <Link href="/officer/history" style={getLinkStyle("/officer/history")}>
          History
        </Link>

        {/* Avatar User */}
        <Box sx={{ padding: "0 15px" }}>
          <Avatar
            sx={{ cursor: "pointer", width: 35, height: 35 }}
            onClick={handleAvatarClick}
            alt="Admin Logo"
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
        <MenuItem onClick={() => navigateTo("/login")}>
          <Typography variant="body1">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopBar_Officer;
