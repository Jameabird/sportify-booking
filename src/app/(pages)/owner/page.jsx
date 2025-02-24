"use client";
import React from "react";
import { useRouter } from "next/navigation";
import "@app/globals.css";
import { Box, Typography } from "@mui/material";
import TopBar_Owner from "@components/Topbar_Owner";

export default function OwnerHome() {
  const router = useRouter(); // ใช้ router เพื่อเปลี่ยนเส้นทาง

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
        <TopBar_Owner textColor="white" />

        {/* Owner Dashboard Container */}
        <Box
          display="flex"
          flexDirection="column" // คงการจัดตำแหน่งในแนวตั้งสำหรับส่วนนี้
          alignItems="center"
          justifyContent="center"
          gap={6}
          sx={{ position: "relative", zIndex: 1, height: "100%", overflow: "hidden" }}
        >
          {/* Category Buttons (จัดเรียงหมวดหมู่ในแนวนอน) */}
          <Box
            display="flex"
            flexDirection="row" // จัดหมวดหมู่ในแนวนอน
            gap={6}
            sx={{
              justifyContent: "center",
              width: "100%",
              flexWrap: "wrap",
              padding: "0 20px",
            }}
          >
            {[ 
              {
                title: "Management",
                buttons: [
                  { text: "Office Management", path: "/owner/management" },
                  { text: "Dashboard", path: "/owner/dashboard" },
                  { text: "New Field", path: "/owner/management.area" },
                  { text: "Field Management", path: "/owner/areafield" }, // ✅ เพิ่มปุ่ม Field Management
                ],
              },
              {
                title: "Messages",
                buttons: [
                  { text: "Send Messages", path: "/owner/sendmessages" }, // New button for sending messages
                ],
              }
            ].map((category, categoryIndex) => (
              <Box
                key={categoryIndex}
                sx={{
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.6)",
                  borderRadius: "16px",
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column", // ปุ่มจัดเรียงในแนวตั้ง
                  alignItems: "center",
                  gap: 3,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  width: "100%",
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
                <Box display="flex" flexDirection="column" gap={2} justifyContent="center">
                  {category.buttons.map((button, index) => (
                    <Box
                      key={index}
                      onClick={() => router.push(button.path)}
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
                    >
                      {button.text}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </main>
    </div>
  );
}
