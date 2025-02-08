"use client"; // เพิ่มตรงนี้ก่อน import ใดๆ

import { useRouter } from "next/navigation"; // Import useRouter
import React from "react";
import "@app/globals.css";
import TopBar_Admin from "@components/Topbar_Admin";
import { Box, Typography, Button } from "@mui/material";

export default function Management() {
  const router = useRouter(); // ใช้งาน useRouter

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        <TopBar_Admin textColor={"white"} />
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

        <div className="relative h-full w-full flex flex-col items-center justify-start text-white pt-24">
          <Typography variant="h1" className="font-bold mb-10">
            Better Club Pattaya
          </Typography>

          <div className="grid grid-cols-2 gap-6">
            <Button variant="contained" color="primary" className="p-10 rounded-lg text-center mr-5">
              <Typography variant="h5">Promotion Management</Typography>
            </Button>
            <Button variant="contained" color="primary" className="p-10 rounded-lg text-center ml-5">
              <Typography variant="h5">Refund Management</Typography>
            </Button>
            <Button variant="contained" color="primary" className="p-10 rounded-lg text-center mt-9 mr-5">
              <Typography variant="h5">Financial Report</Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="p-10 rounded-lg text-center mt-9 ml-5"
              onClick={() => router.push("/admin/confirmpayment")} // เปลี่ยนหน้า
            >
              <Typography variant="h5">Confirm Payment</Typography>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
