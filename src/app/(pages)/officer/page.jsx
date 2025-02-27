"use client";
import React from "react";
import "@app/globals.css";
import { Box, Typography } from "@mui/material";
import TopBar_Officer from "@components/Topbar_Officer";
import { useRouter } from "next/navigation";

export default function Officer() {
  const router = useRouter();

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
        overflow: "hidden",
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

        {/* Officer Dashboard Container */}
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          gap={4}
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            overflow: "hidden",
            padding: { xs: "20px", sm: "40px" },
          }}
        >
          {/* Sections (Management and Messages) */}
          {[
            {
              title: "Management",
              button: {
                text: "Field Management",
                path: "/officer/areafield",
              },
            },
            {
              title: "Messages",
              button: {
                text: "Send Messages",
                path: "/officer/sendmessages",
              },
            },
          ].map((section, index) => (
            <Box
              key={index}
              sx={{
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.6)",
                borderRadius: "16px",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                width: { xs: "100%", sm: "45%", md: "30%" },
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
                {section.title}
              </Typography>

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
                onClick={() => handleNavigation(section.button.path)}
              >
                {section.button.text}
              </Box>
            </Box>
          ))}
        </Box>
      </main>
    </div>
  );
}
