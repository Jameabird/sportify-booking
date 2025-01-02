"use client";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar = props => {
  const currentPath = usePathname(); // ใช้สำหรับตรวจสอบเส้นทางปัจจุบัน
  const router = useRouter(); // ใช้สำหรับนำทาง

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)", // สีโปร่งใส
        backdropFilter: "blur(7px)", // เบลอพื้นหลัง
        WebkitBackdropFilter: "blur(7px)", // สำหรับ Safari
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)" // เพิ่มเงา
      }}
    >
      <Box component="div" display="flex" borderRadius="3px">
        <Link href="/">
          <div className="text-3xl font-bold flex pl-10">
            <div style={{ color: props.textColor }}>SPORTIFY</div>
            <div className="pl-2 text-orange-500">BOOKING</div>
          </div>
        </Link>
      </Box>
      <Box display="flex">
        {/* ลิงก์แต่ละหน้า */}
        <Link href="/">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              color: currentPath === "/" ? "orange" : props.textColor,
              cursor: "pointer",
              "&:hover": {
                color: "#868dfb"
              }
            }}
          >
            <div className="font-bold text-xl">Home</div>
          </Box>
        </Link>
        <Link href="/category">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              cursor: "pointer",
              color: currentPath === "/category" ? "orange" : props.textColor,
              "&:hover": {
                color: "#868dfb"
              }
            }}
          >
            <div className="font-bold text-xl">Category</div>
          </Box>
        </Link>
        <Link href="/history">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              cursor: "pointer",
              color: currentPath === "/history" ? "orange" : props.textColor,
              "&:hover": {
                color: "#868dfb"
              }
            }}
          >
            <div className="font-bold text-xl">History</div>
          </Box>
        </Link>
        <Link href="/admin">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              cursor: "pointer",
              paddingRight: "50px",
              color: currentPath === "/admin" ? "orange" : props.textColor,
              "&:hover": {
                color: "#868dfb"
              }
            }}
          >
            <div className="font-bold text-xl">Admin</div>
          </Box>
        </Link>
        {/* ปุ่ม Sign In */}
        <Box sx={{ padding: "0 3px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/login")} // นำทางไปยัง "/login"
          >
            Sign In
          </Button>
        </Box>
        {/* </Link> */}
      </Box>
    </Box>
  );
};

export default TopBar;
