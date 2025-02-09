"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen relative">
      {/* พื้นหลัง (ให้คลุมทั้งหน้าจอ) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/gym_bg2.jpg')",
          backgroundColor: "rgba(70, 80, 100, 0.7)",
          backgroundBlendMode: "multiply",
          opacity: 0.9,
          zIndex: -1, // ทำให้พื้นหลังอยู่ด้านล่างสุด
        }}
      />

      {/* TopBar */}
      <TopBar textColor="white" />

      {/* ข้อความต้อนรับ */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <Typography variant="h3" fontWeight="bold" className="text-white">
          Welcome to Sportify Platform!
        </Typography>
        <Typography variant="h6" className="text-gray-300">
          Your one-stop platform for sports venue booking.
        </Typography>
      </div>

      {/* กล่องเนื้อหา (อยู่ด้านล่าง) */}
      <div className="bg-white py-12 px-6 shadow-lg rounded-t-3xl mt-auto w-full relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* หัวเรื่อง */}
          <div className="mb-6 text-center">
            <Typography variant="h5" fontWeight="bold" className="text-gray-600">
              Sportify Booking - สะดวก รวดเร็ว คัดสรรสนามคุณภาพเพื่อคุณ
            </Typography>
          </div>

          {/* เนื้อหาหลัก */}
          <Typography variant="body1" paragraph className="text-lg text-gray-700 leading-relaxed">
            <b>Sportify Booking</b> เป็นแพลตฟอร์มที่ออกแบบมาเพื่อให้การจองสนามกีฬากลายเป็นเรื่องง่าย
            เราช่วยให้คุณสามารถค้นหาและจองสนามได้สะดวกเพียงไม่กี่คลิก โดยไม่ต้องเสียเวลาโทรสอบถามหรือเดินทางไปจองด้วยตัวเอง
          </Typography>

          <Typography variant="body1" paragraph className="text-lg text-gray-700 leading-relaxed">
            เรามีตัวเลือกสนามกีฬาหลากหลายประเภทให้คุณได้เลือก ไม่ว่าจะเป็น ฟุตบอล, บาสเกตบอล, แบดมินตัน, เทนนิส และอื่น ๆ
            พร้อมทั้งระบบคัดคุณภาพสนาม ไม่ว่าจะเป็นรีวิวจากผู้ใช้งานจริง คะแนนบริการ และข้อมูลตำแหน่งสนามที่ใกล้คุณที่สุด
          </Typography>

          <Typography variant="body1" className="text-lg text-gray-700 leading-relaxed">
            ไม่ว่าคุณจะเป็นนักกีฬามืออาชีพ หรือเพียงแค่ต้องการสถานที่ออกกำลังกายกับเพื่อน ๆ  
            <b> Sportify Booking </b> พร้อมช่วยให้การจองสนามเป็นเรื่องง่าย รวดเร็ว และน่าเชื่อถือ!
          </Typography>

          {/* ปุ่ม */}
          <div className="flex justify-center gap-6 mt-8">
            <Link href="/Spectator/category" passHref>
              <Button
                variant="contained"
                color="primary"
                className="w-full sm:w-auto py-3 px-8 text-xl font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-orange-600"
              >
                เริ่มจองเลย!
              </Button>
            </Link>

            <Link href="/Spectator/about" passHref>
              <Button
                variant="contained"
                color="secondary"
                className="w-full sm:w-auto py-3 px-8 text-xl font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-600"
              >
                เกี่ยวกับเรา
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
