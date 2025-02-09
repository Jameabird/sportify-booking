"use client";
import React from "react";
import "@app/globals.css";
import { Box, Typography, Button } from "@mui/material"; // Import Typography and Button
import TopBar from "@components/Topbar"; // Import TopBar

export default function About() {
  return (
    <div className="relative flex flex-col min-h-screen">
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
      <TopBar textColor={"white"} />

      {/* กล่องเนื้อหา (พื้นหลังสีขาว) */}
      <main className="flex-1 flex justify-center items-center px-6 py-12">
        <div className="max-w-4xl w-full bg-white p-10 rounded-2xl shadow-lg">
          {/* ส่วนหัว */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">เกี่ยวกับเรา</h1>
            <p className="text-lg text-gray-600">
              Sportify Booking - สะดวก รวดเร็ว คัดสรรสนามคุณภาพเพื่อคุณ
            </p>
            <hr className="w-20 mx-auto border-t-4 border-blue-500 my-4" />
          </div>

          {/* เนื้อหาหลัก (จัดเป็น Grid) */}
          <div className="mt-6 space-y-6 text-lg text-gray-700 leading-relaxed">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500 text-white rounded-full">
                📌
              </div>
              <p>
                <b>Sportify Booking</b> เป็นแพลตฟอร์มที่ออกแบบมาเพื่อให้การจองสนามกีฬากลายเป็นเรื่องง่าย
                เราช่วยให้คุณสามารถค้นหาและจองสนามได้สะดวกเพียงไม่กี่คลิก
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-500 text-white rounded-full">
                🎯
              </div>
              <p>
                มีสนามกีฬาให้เลือกหลากหลาย เช่น <b>ฟุตบอล, บาสเกตบอล, แบดมินตัน, เทนนิส</b> ฯลฯ
                พร้อมข้อมูลรีวิวจริง และตำแหน่งสนามที่ใกล้ที่สุด
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-500 text-white rounded-full">
                🚀
              </div>
              <p>
                ไม่ว่าคุณจะเป็นนักกีฬามืออาชีพ หรือแค่อยากออกกำลังกายกับเพื่อน ๆ
                <b> Sportify Booking </b> พร้อมช่วยให้คุณจองสนามได้สะดวก รวดเร็ว และน่าเชื่อถือ!
              </p>
            </div>
          </div>

          {/* รายชื่อสมาชิก */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              สมาชิกผู้จัดทำ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[ 
                { id: "6330300160", name: "ชญานิน ตลับเงิน" },
                { id: "6330300071", name: "กิตติญาภรณ์ ดวงไกร" },
                { id: "6530300465", name: "รินรดา คัตตพันธ์" },
                { id: "6530300554", name: "สิริวิมล แสงทอง" },
                { id: "6530300589", name: "สุนันทา ธูปสมุทร" },
                { id: "6530300759", name: "เจมจิรัฏฐ์ งามสินจำรัส" },
              ].map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-lg text-center shadow-md transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: "#f9fafb", // พื้นหลังเทาอ่อน
                  }}
                >
                  <p className="text-blue-500 font-semibold">{member.id}</p>
                  <p className="text-lg text-gray-800">{member.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Us Section (Moved Inside White Box) */}
          <div className="mt-12">
            <Typography variant="h5" fontWeight="bold" className="text-center">
              ติดต่อเรา
            </Typography>
            <Typography variant="body1" className="mt-4 text-lg text-gray-700 text-center">
              หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับการใช้บริการหรือการจองสนามกีฬา
              <br />
              สามารถติดต่อเราผ่านช่องทางด้านล่างนี้
            </Typography>

            <div className="mt-8 flex justify-center gap-6">
              {/* ส่งอีเมล */}
              <Button
                variant="outlined"
                color="primary"
                className="px-6 py-2 text-xl font-bold rounded-xl border-white hover:bg-white hover:text-gray-800 transition-all duration-300"
                onClick={() => window.location.href = 'mailto:support@sportify.com?subject=Inquiry&body=Hello, I have a question about booking a sports facility.'}
              >
                ส่งอีเมล
              </Button>

              {/* โทรติดต่อ */}
              <Button
                variant="outlined"
                color="secondary"
                className="px-6 py-2 text-xl font-bold rounded-xl border-white hover:bg-white hover:text-gray-800 transition-all duration-300"
                onClick={() => window.location.href = 'tel:+1234567890'} // Replace with your contact number
              >
                โทรติดต่อ
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
