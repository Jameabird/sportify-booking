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
            zIndex: -1
          }}
        />
        
        {/* ห่อหุ้มคอนเทนต์ */}
        <div className="relative h-full w-full">
          <div className="grid grid-rows-auto gap-4">
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <TopBar_User textColor={"white"} />
              </div>

              {/* แสดงเวลา Real-Time (เวลาประเทศไทย) */}
              <div className="col-span-12 text-center text-white mt-4">
                <Typography variant="h5" fontWeight="600" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                  เวลาปัจจุบัน: {currentTime}
                </Typography>
              </div>

              {/* สไลด์โชว์โปรโมชั่น */}
              <div className="col-span-12 mt-6 relative">
                <AliceCarousel
                  autoPlay
                  autoPlayInterval={5000}
                  infinite
                  disableDotsControls
                  disableButtonsControls
                >
                  <div>
                    <img
                      src="/promo1.jpg"
                      alt="Promotion 1"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src="/promo2.jpg"
                      alt="Promotion 2"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                    />
                  </div>
                  <div>
                    <img
                      src="/promo3.jpg"
                      alt="Promotion 3"
                      className="w-full h-auto object-cover"
                      style={{
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                    />
                  </div>
                </AliceCarousel>
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
      </main>
    </div>
  );
}
