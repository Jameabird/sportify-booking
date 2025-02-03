"use client";
import { Box, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_Owner = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLogin(!!token); // Check if there is a token
  }, []);

  // Open menu when clicking Avatar
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigate to different pages
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

      {/* Main Menu */}
      <Box display="flex" alignItems="center">
        <Link href="/admin" style={getLinkStyle("/admin")}>
          Home
        </Link>
        <Link href="/admin/promotion" style={getLinkStyle("/admin/promotion")}>
          Promotion
        </Link>
        <Link href="/admin/history" style={getLinkStyle("/admin/history")}>
          History
        </Link>

        {/* Avatar User */}
        <Box sx={{ padding: "0 15px" }}>
          {isLogin ? (
            <>
              <Avatar
                sx={{ cursor: "pointer", width: 35, height: 35 }}
                onClick={handleAvatarClick}
                alt="Admin Logo"
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => navigateTo("/admin/setting")}>
                  <Typography variant="body1">Settings</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigateTo("/login")}>
                  <Typography variant="body1">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Avatar
              sx={{ cursor: "pointer", width: 35, height: 35 }}
              onClick={handleAvatarClick}
              alt="Admin Logo"
            />
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => navigateTo("/admin/setting")}>
          <Typography variant="body1">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigateTo("/login")}>
          <Typography variant="body1">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopBar_Owner;