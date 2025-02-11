"use client";
import { Box, Button, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar = (props) => {
  const currentPath = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element
  const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility
  const [isLogin, setIsLogin] = useState(false); // For controlling sign-in state

  // Open the menu when the avatar is clicked
  const handleAvatarClick = (event) => {
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

  // Handle Settings Click
  const handleSettingsClick = () => {
    router.push("/setting");
  };

  // Handle Login Button
  const handleLoginClick = () => {
    router.push("/login");
  };

  // Normalize the current path to avoid issues with trailing slashes
  const normalizePath = (path) => {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  };

  const getLinkStyle = (path) => ({
    padding: "0 15px",
    color: normalizePath(currentPath) === normalizePath(path) ? "#1e40af" : props.textColor, // Active link color set to blue
    fontSize: "1.25rem",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      color: "#1e40af", // Blue on hover
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
            <div className="pl-2" style={{ color: "#1e40af" }}>BOOKING</div>
          </div>
        </Link>
      </Box>

      {/* เมนูหลัก */}
      <Box display="flex" alignItems="center">
        <Link href="/Spectator/home" style={getLinkStyle("/Spectator/home")}>
          Home
        </Link>
        <Link href="/Spectator/category" style={getLinkStyle("/Spectator/category")}>
          Category
        </Link>
        <Link href="/Spectator/booking" style={getLinkStyle("/Spectator/booking")}>
          Booking
        </Link>
        <Link href="/Spectator/about" style={getLinkStyle("/Spectator/about")}>
          About Contact Us
        </Link>
        {/* Avatar User or Sign In Button */}
        {isLogin ? (
          <Box sx={{ padding: "0 3px" }}>
            <Avatar onClick={handleAvatarClick} sx={{ cursor: "pointer" }} />
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ padding: "0 3px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
              sx={{ borderRadius: "20px" }} // Add this line to make the button rounded
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopBar;
