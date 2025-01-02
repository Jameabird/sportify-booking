"use client";
import React,{useState,useEffect} from "react";
import "@app/globals.css";
import { Box, useTheme } from "@mui/material";
import TopBar from "@components/Topbar";

export default function Home() {
  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        {/* พื้นหลังเลเยอร์ */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/gym_bg2.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply", 
            opacity: 0.9,
            zIndex: -1
          }}
        />
        <div className="relative h-full w-full">
        {/* เมื่อมีการใช้ครบ 12 ช่องแล้วจะสร้าง row ใหม่(บรรทัดใหม่) */}
          <div className="grid grid-rows-auto gap-2">  
            {/* สร้าง grid ให้มีขนาด 12 ช่องเท่าๆกัน ต่อ 1 บรรทัด  สามารถปรับลด ช่องได้ */}
            <div className="grid grid-cols-12">
              {/* จองพื้นที่ไว้ 12 คอลัมภ์ */}
              <div className="col-span-12">
                <TopBar textColor={"white"} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}