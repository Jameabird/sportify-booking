"use client";
import React from "react";
import "@app/globals.css";
import { Box, Typography } from "@mui/material";
import TopBar_Officer from "@components/Topbar_Officer";
import { useRouter } from "next/navigation"; // เพิ่ม useRouter

export default function Officer() {
  const router = useRouter(); // สร้างอินสแตนซ์ของ useRouter

  // ฟังก์ชันเปลี่ยนเส้นทาง
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div
      className="app"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden", // Prevent vertical scrolling
      }}
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
        <TopBar_Officer textColor="white" />

        {/* Admin Dashboard Container */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={6}
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Management Section */}
          <Box
            sx={{
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.6)",
              borderRadius: "16px",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              width: "90%",
              maxWidth: "500px",
              transition: "0.3s ease-in-out",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Court Management
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
              {[
                { text: "Manage", path: "/officer/management" },
                { text: "Inform to Owner", path: "/officer/inform" },
              ].map((item, index) => (
                <Box
                  key={index}
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
                  onClick={() => handleNavigation(item.path)} // เพิ่มการคลิกเพื่อนำทาง
                >
                  {item.text}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </main>
    </div>
  );
}
