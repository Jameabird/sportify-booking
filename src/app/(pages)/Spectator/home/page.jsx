"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import TopBar from "@components/Topbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen relative">
      {/* พื้นหลังเต็มหน้าจอ */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/gym_bg2.jpg')",
          backgroundColor: "rgba(70, 80, 100, 0.7)",
          backgroundBlendMode: "multiply",
          zIndex: -1,
        }}
      />

      {/* TopBar */}
      <TopBar textColor="white" />

      {/* ข้อความต้อนรับ */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-16">
        <Typography variant="h3" fontWeight="bold" className="text-white">
          Welcome to Sportify Platform!
        </Typography>
        <Typography variant="h6" className="text-gray-300">
          Your one-stop platform for sports venue booking.
        </Typography>
      </div>

      {/* กล่องเนื้อหา */}
      <div className="bg-white py-12 px-6 shadow-lg rounded-t-3xl mt-20 w-full relative z-10">
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

          {/* ขั้นตอนการจอง */}
          <div className="mt-16 text-center">
            <Typography variant="h4" fontWeight="bold" className="text-gray-800">
              ขั้นตอนการจองสนามได้ง่ายๆ เพียง 4 ขั้นตอน!
            </Typography>

            {/* Layout แบบ 2 คอลัมน์ */}
            <div className="mt-10 grid grid-cols-2 gap-6 items-center">

              {/* รูปมือถือ */}
              <div className="flex justify-center">
                <img src="/home.png" alt="จองสนามผ่านมือถือ" className="w-80" />
              </div>

              <div className="space-y-6 text-left">
                {[
                  "ค้นหาและเลือกสนามที่ต้องการ",
                  "ตรวจสอบและยืนยันการจอง",
                  "เช็คเอาท์ด้วย QR Code",
                  "เสร็จสิ้น ขอให้สนุกกับการออกกำลังกาย"
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
          </div>


          <div className="flex justify-center gap-6 mt-12 pb-6">
            <Link href="/Spectator/category" passHref>
              <Button
                variant="contained"
                color="primary"
                className="py-2 px-6 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-orange-700"
                style={{ minWidth: "150px" }}
              >
                เริ่มจองเลย!
              </Button>
            </Link>

            <Link href="/Spectator/about" passHref>
              <Button
                variant="contained"
                color="secondary"
                className="py-2 px-6 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-indigo-700"
                style={{ minWidth: "150px" }}
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
