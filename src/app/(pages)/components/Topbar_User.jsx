"use client";
import { Box, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_User = props => {
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element
  const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility
  const currentPath = usePathname(); // Use to check the current path
  const router = useRouter(); // Use for navigation

  // Open the menu when the avatar is clicked
  const handleAvatarClick = event => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  // Close the menu
  const handleClose = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  // Handle History Click
  const handleHistoryClick = () => {
    router.push("/history"); // Navigate to the History page
  };

  // Handle Settings Click (if needed)
  const handleSettingsClick = () => {
    router.push("/setting");
  };

  const getLinkStyle = path => ({
    padding: "0 15px", // Consistent padding with TopBar.jsx
    color: currentPath === path ? "orange" : props.textColor,
    fontSize: "1.25rem", // Match font size
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      color: "#868dfb"
    }
  });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)", // สีโปร่งใส
        backdropFilter: "blur(7px)", // เบลอพื้นหลัง
        WebkitBackdropFilter: "blur(7px)", // สำหรับ Safari
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)" // เพิ่มเงา
      }}
    >
      <Box display="flex" alignItems="center">
        <Link href="/">
          <div className="text-3xl font-bold flex pl-10">
            <div style={{ color: props.textColor }}>SPORTIFY</div>
            <div className="pl-2 text-orange-500">BOOKING</div>
          </div>
        </Link>
      </Box>
      <Box display="flex" alignItems="center">
        <Link href="/home" style={getLinkStyle("/home")}>
          Home
        </Link>
        <Link href="/category" style={getLinkStyle("/category")}>
          Category
        </Link>
        <Link href="/booking" style={getLinkStyle("/booking")}>
          Booking
        </Link>
        <Box sx={{ padding: "0 15px" }}>
          <Avatar
            sx={{ cursor: "pointer", width: 35, height: 35 }}
            onClick={handleAvatarClick}
            alt="User Logo"
          />
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem onClick={handleHistoryClick}> {/* Change to History */}
          <Typography variant="body1">History</Typography>
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <Typography variant="body1">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <Typography variant="body1">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopBar_User;