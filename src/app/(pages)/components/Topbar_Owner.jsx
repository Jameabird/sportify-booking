"use client";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_Admin = props => {
  const currentPath = usePathname();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // สมมติว่า login แล้ว
  const [anchorEl, setAnchorEl] = useState(null);

  // เปิด dropdown
  const handleAdminClick = event => {
    setAnchorEl(event.currentTarget);
  };

  // ปิด dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ไปหน้า settings
  const handleSettingsClick = () => {
    router.push("/admin/setting");
    handleClose();
  };

  // ออกจากระบบ
  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
    handleClose();
  };

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
      <Box component="div" display="flex">
        <Link href="/">
          <div className="text-3xl font-bold flex pl-10">
            <div style={{ color: props.textColor }}>SPORTIFY</div>
            <div className="pl-2 text-orange-500">BOOKING</div>
          </div>
        </Link>
      </Box>

      <Box display="flex">
        <Link href="/admin">
          <Box sx={{ padding: "0 10px", paddingTop: "4px", cursor: "pointer", color: currentPath === "/onwer" ? "orange" : props.textColor, "&:hover": { color: "#868dfb" } }}>
            <div className="font-bold text-xl">Home</div>
          </Box>
        </Link>
        <Link href="/admin/history">
          <Box sx={{ padding: "0 10px", paddingTop: "4px", cursor: "pointer", color: currentPath === "/owner/history" ? "orange" : props.textColor, "&:hover": { color: "#868dfb" } }}>
            <div className="font-bold text-xl">History</div>
          </Box>
        </Link>

        {/* ปุ่ม Admin + Dropdown */}
        <Box sx={{ padding: "0 3px" }}>
          {isLogin ? (
            <>
              <Button
                variant="contained"
                onClick={handleAdminClick}
                sx={{
                  backgroundColor: "#007BFF", // สีฟ้า
                  borderRadius: "20px", // มุมมน
                  padding: "8px 20px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#0056b3" } // สีเข้มขึ้นเมื่อ hover
                }}
              >
                Owner
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleSettingsClick}>
                  <Typography variant="body1">Settings</Typography>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <Typography variant="body1">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar_Admin;
