"use client";
import React, { useState, useEffect } from "react";
import "@app/globals.css";
import { Box, Button, Typography } from "@mui/material";
import TopBar_User from "@components/Topbar_User";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Link from "next/link";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {/* พื้นหลังเลเยอร์ */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/gym_bg2.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply",
            opacity: 0.85,
            zIndex: -1,
          }}
        />

        {/* ห่อหุ้มคอนเทนต์ */}
        <div className="relative h-full w-full">
          <div className="grid grid-rows-auto gap-0">
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <TopBar_User textColor={"white"} />
              </div>

              {/* สไลด์โชว์โปรโมชั่น */}
              <div className="col-span-12 relative">
                <AliceCarousel
                  autoPlay
                  autoPlayInterval={2500}
                  infinite
                  disableDotsControls
                  disableButtonsControls
                >
                  <div className="relative">
                    <img
                      src="/promo1.jpg"
                      alt="Promotion 1"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "325px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        filter: "blur(1px)",
                      }}
                    />
                    {/* ข้อความกลางภาพ */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Typography variant="h4" fontWeight="700" color="white" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
                        จองสนามกีฬาได้ง่าย ๆ กับ SPORTIFY
                      </Typography>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="/promo2.jpg"
                      alt="Promotion 2"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "325px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        filter: "blur(1px)",
                      }}
                    />
                    {/* ข้อความกลางภาพ */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Typography variant="h4" fontWeight="700" color="white" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
                        ค้นหาสนามกีฬาที่ดีที่สุดใกล้คุณ
                      </Typography>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="/promo3.jpg"
                      alt="Promotion 3"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "325px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        filter: "blur(1px)",
                      }}
                    />
                    {/* ข้อความกลางภาพ */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Typography variant="h4" fontWeight="700" color="white" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
                        โปรโมชั่นสุดคุ้ม! จอง 10 ครั้ง ฟรี 1 ครั้ง
                      </Typography>
                    </div>
                  </div>
                </AliceCarousel>
              </div>

              {/* แสดงเวลา Real-Time (เวลาประเทศไทย) */}
              <div className="col-span-12 bg-white text-center text-black py-4">
                <Typography variant="h5" fontWeight="600" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                  เวลาปัจจุบัน: {currentTime}
                </Typography>
              </div>
            </div>

            {/* เพิ่มความยาวของพื้นหลังสีขาว */}
            <div className="w-full bg-white" style={{ minHeight: "400px" }}>
              <Typography variant="h4" fontWeight="bold" className="text-gray-800 text-center">
                ขั้นตอนการจองสนามได้ง่ายๆ เพียง 4 ขั้นตอน!
              </Typography>

              {/* Layout แบบ 2 คอลัมน์ */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4">

                {/* รูปมือถือ */}
                <div className="flex justify-center">
                  <img src="/home.png" alt="จองสนามผ่านมือถือ" className="w-80" />
                </div>

                <div className="space-y-6 text-left">
                  {[
                    "ค้นหาและเลือกสนามที่ต้องการ",
                    "ตรวจสอบและยืนยันการจอง",
                    "เช็คเอาท์ด้วย QR Code",
                    "เสร็จสิ้น ขอให้สนุกกับการออกกำลังกาย",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      {/* วงกลมตัวเลข */}
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full text-2xl font-bold">
                        {index + 1}
                      </div>
                      {/* คำอธิบาย */}
                      <p className="text-lg text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ปุ่มจองสนามกีฬาและประวัติการจอง */}
              <div className="flex justify-center gap-6 mt-8">
                {/* ปุ่มจองสนามกีฬา */}
                <Link href="/category" passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full py-3 text-xl font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    จองสนามกีฬา
                  </Button>
                </Link>

                {/* ปุ่มประวัติการจองสนามกีฬา */}
                <Link href="/history" passHref>
                  <Button
                    variant="contained"
                    color="secondary"
                    className="w-full py-3 text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    ประวัติการจองสนามกีฬา
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
