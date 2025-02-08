"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import Link from "next/link";  // Import Link from Next.js

export default function Home() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto">
        {/* พื้นหลัง */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/gym_bg2.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            zIndex: -1,
          }}
        />
        
        <div className="relative w-full h-full">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <TopBar textColor="white" />

              {/* ส่วนข้อความต้อนรับ */}
              <Box className="text-center mb-8">
                <Typography variant="h4" fontWeight="bold" gutterBottom className="text-4xl font-semibold text-gray-800">
                  Welcome to Sportify Platform!
                </Typography>
                <Typography variant="h6" color="text.secondary" className="text-lg text-gray-500">
                  Your one-stop platform for sports venue booking.
                </Typography>
              </Box>

              {/* เนื้อหาหลัก */}
              <div className="px-4 py-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
                {/* ส่วนหัว */}
                <div className="mb-10">
                  <p className="text-xl text-gray-600">
                    Sportify Booking - สะดวก รวดเร็ว คัดสรรสนามคุณภาพเพื่อคุณ
                  </p>
                </div>

                {/* เนื้อหาหลัก */}
                <p className="mb-6 text-lg text-gray-700">
                  <b>Sportify Booking</b> เป็นแพลตฟอร์มที่ออกแบบมาเพื่อให้การจองสนามกีฬากลายเป็นเรื่องง่าย
                  เราช่วยให้คุณสามารถค้นหาและจองสนามได้สะดวกเพียงไม่กี่คลิก โดยไม่ต้องเสียเวลาโทรสอบถามหรือเดินทางไปจองด้วยตัวเอง
                </p>

                <p className="mb-6 text-lg text-gray-700">
                  เรามีตัวเลือกสนามกีฬาหลากหลายประเภทให้คุณได้เลือก ไม่ว่าจะเป็น ฟุตบอล, บาสเกตบอล, แบดมินตัน, เทนนิส และอื่น ๆ
                  พร้อมทั้งระบบคัดคุณภาพสนาม ไม่ว่าจะเป็นรีวิวจากผู้ใช้งานจริง คะแนนบริการ และข้อมูลตำแหน่งสนามที่ใกล้คุณที่สุด
                </p>

                <p className="text-lg text-gray-700">
                  ไม่ว่าคุณจะเป็นนักกีฬามืออาชีพ หรือเพียงแค่ต้องการสถานที่ออกกำลังกายกับเพื่อน ๆ
                  <b>Sportify Booking</b> พร้อมช่วยให้การจองสนามเป็นเรื่องง่าย รวดเร็ว และน่าเชื่อถือ!
                </p>

                {/* ปุ่มเริ่มจองเลย! */}
                <div className="flex justify-center gap-4 mt-6">
                  <Link href="/Spectator/category" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full py-3 text-xl font-semibold rounded-lg shadow-md hover:bg-orange-600"
                    >
                      เริ่มจองเลย!
                    </Button>
                  </Link>
                  
                  {/* ปุ่มเกี่ยวกับเรา */}
                  <Link href="/Spectator/about" passHref>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="w-full py-3 text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-600"
                    >
                      เกี่ยวกับเรา
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
