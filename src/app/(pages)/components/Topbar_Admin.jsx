"use client";
import { Box, Button, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_Admin = ({ isLoggedIn, textColor }) => {  // เพิ่ม prop isLoggedIn
  const currentPath = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAvatarClick = event => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    router.push("/admin/login");
  };

  const handleSettingsClick = () => {
    router.push("/setting");
  };

  const getLinkStyle = path => ({
    padding: "0 15px",
    color: currentPath === path ? "orange" : textColor,
    fontSize: "1.25rem",
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
      p={2}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)"
      }}
    >
      <Box component="div" display="flex" borderRadius="3px">
        <Link href="/">
          <div className="text-3xl font-bold flex pl-10">
            <div style={{ color: textColor }}>SPORTIFY</div>
            <div className="pl-2 text-orange-500">BOOKING</div>
          </div>
        </Link>
      </Box>
      <Box display="flex">
        <Link href="/admin">
          <Box sx={{ padding: "0 10px", paddingTop: "4px", color: currentPath === "/admin" ? "orange" : textColor, cursor: "pointer", "&:hover": { color: "#868dfb" } }}>
            <div className="font-bold text-xl">Home</div>
          </Box>
        </Link>
        <Link href="/admin/category">
          <Box sx={{ padding: "0 10px", paddingTop: "4px", cursor: "pointer", color: currentPath === "/admin/category" ? "orange" : textColor, "&:hover": { color: "#868dfb" } }}>
            <div className="font-bold text-xl">Category</div>
          </Box>
        </Link>
        <Link href="/admin/history">
          <Box sx={{ padding: "0 10px", paddingTop: "4px", cursor: "pointer", color: currentPath === "/admin/history" ? "orange" : textColor, "&:hover": { color: "#868dfb" } }}>
            <div className="font-bold text-xl">History</div>
          </Box>
        </Link>
        
        {/* หากล็อกอินแล้วจะแสดง Avatar ถ้ายังไม่ล็อกอินจะแสดงปุ่ม Sign In */}
        {isLoggedIn ? (
          <Box sx={{ padding: "0 15px" }}>
            <Avatar
              sx={{ cursor: "pointer", width: 35, height: 35 }}
              onClick={handleAvatarClick}
              alt="User Logo"
            />
          </Box>
        ) : (
          <Box sx={{ padding: "0 3px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/admin/login")}
            >
              Sign In
            </Button>
          </Box>
        )}
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

export default TopBar_Admin;
