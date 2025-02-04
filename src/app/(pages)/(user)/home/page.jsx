"use client";
import React, { useState, useEffect } from "react";
import "@app/globals.css";
import { Box, useTheme } from "@mui/material";
import TopBar_User from "@components/Topbar_User";
import AliceCarousel from "react-alice-carousel"; // นำเข้า AliceCarousel
import "react-alice-carousel/lib/alice-carousel.css"; // นำเข้าสตายล์ของ AliceCarousel

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
                <TopBar_User textColor={"white"} />
              </div>

              {/* สไลด์โชว์โปรโมชั่น */}
              <div className="col-span-12 mt-4 relative">
                <AliceCarousel
                  autoPlay // เปิดการเลื่อนอัตโนมัติ
                  autoPlayInterval={3000} // ระยะเวลาในการเลื่อน (3 วินาที)
                  infinite // เลื่อนวนลูป
                  disableDotsControls // ไม่ให้แสดงจุดควบคุม
                  disableButtonsControls // ไม่ให้แสดงปุ่มควบคุมลูกศร
                >
                  <div>
                    <img
                      src="/promo1.jpg" // ใช้ path ที่ถูกต้อง
                      alt="Promotion 1"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "300px", // ปรับขนาดให้เล็กลง
                        objectFit: "cover", // ทำให้รักษาสัดส่วน
                        borderRadius: "15px", // ขอบมน
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src="/promo2.jpg" // ใช้ path ที่ถูกต้อง
                      alt="Promotion 2"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "300px", // ปรับขนาดให้เล็กลง
                        objectFit: "cover", // ทำให้รักษาสัดส่วน
                        borderRadius: "15px", // ขอบมน
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src="/promo3.jpg" // ใช้ path ที่ถูกต้อง
                      alt="Promotion 3"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "300px", // ปรับขนาดให้เล็กลง
                        objectFit: "cover", // ทำให้รักษาสัดส่วน
                        borderRadius: "15px", // ขอบมน
                      }}
                    />
                  </div>
                </AliceCarousel>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
