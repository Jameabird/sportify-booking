"use client";
import React from "react";
import "@app/globals.css";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation"; // ✅ นำเข้า useRouter
import TopBar_Admin from "@components/Topbar_Admin";

// ** ข้อมูลหมวดหมู่และปุ่ม (รวม Promotion เข้า Management) **
const adminCategories = [
  {
    title: "Financial Management",
    buttons: ["Confirm Payment", "Refund"],
  },
  {
    title: "Management",
    buttons: ["Owner Management", "Dashboard", "Promotion"], // ✅ เพิ่ม "Promotion" เข้า Management
  },
];

// ** ปุ่มในแต่ละหมวด **
const AdminButton = ({ text }) => {
  const router = useRouter(); // ✅ ใช้ useRouter() เพื่อเปลี่ยนหน้า

  // ✅ ฟังก์ชันกำหนดเส้นทาง
  const handleClick = () => {
    if (text === "Owner Management") {
      router.push("/admin/management"); // ✅ เปลี่ยนหน้าเมื่อกดปุ่ม "Owner Management"
    }
    if(text === "Confirm Payment"){
      router.push("/admin/areacomfirm");
    }
    if(text === "Refund"){
      router.push("/admin/arearefund");
    }
    if(text === "Dashboard"){
      router.push("/admin/areadashboard");
    }
    if(text === "Promotion"){
      router.push("/admin/promotion");
    }
  };
  

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,123,255,0.9)",
        padding: "16px 32px",
        borderRadius: "12px",
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "bold",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.3s",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        minWidth: "180px",
        "&:hover": {
          backgroundColor: "rgba(0,123,255,1)",
          boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.6)",
          transform: "scale(1.05)",
        },
      }}
      onClick={handleClick} // ✅ กำหนด event onClick
    >
      {text}
    </Box>
  );
};

export default function AdminHome() {
  return (
    <div
      className="app"
      style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}
    >
      <main
        className="content"
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background Layer */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/gym_bg2.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            zIndex: -1,
          }}
        />

        {/* Overlay Background */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            zIndex: -1,
          }}
        />

        {/* Top Navigation Bar */}
        <TopBar_Admin textColor="white" />

        {/* Admin Dashboard Container */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={6}
          sx={{ position: "relative", zIndex: 1, height: "100%", overflow: "hidden" }}
        >
          {adminCategories.map((category, categoryIndex) => (
            <Box
              key={categoryIndex}
              sx={{
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.6)",
                borderRadius: "16px",
                padding: "25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                width: "90%",
                maxWidth: "550px",
                transition: "0.3s ease-in-out",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {category.title}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                {category.buttons.map((text, index) => (
                  <AdminButton key={index} text={text} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </main>
    </div>
  );
}
