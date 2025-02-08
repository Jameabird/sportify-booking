"use client";
import React from "react";
import "@app/globals.css";
import "./aboutPage.css"; // Import CSS
import { Box, useTheme } from "@mui/material";
import TopBar from "@components/Topbar"; // Import TopBar

export default function About() {
  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        {/* พื้นหลังเลเยอร์ */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            zIndex: -1,
          }}
        />

        <div className="relative h-full w-full">
          {/* TopBar */}
          <TopBar textColor={"white"} />

          {/* ส่วนเนื้อหาหลัก */}
          <div className="about-container">
            {/* ส่วนหัว */}
            <div className="about-header">
              <h1 className="about-title">เกี่ยวกับเรา</h1>
              <p className="about-subtitle">
                Sportify Booking - สะดวก รวดเร็ว คัดสรรสนามคุณภาพเพื่อคุณ
              </p>
            </div>

            {/* เนื้อหาหลัก */}
            <p className="about-text">
              <b>Sportify Booking</b> เป็นแพลตฟอร์มที่ออกแบบมาเพื่อให้การจองสนามกีฬากลายเป็นเรื่องง่าย
              เราช่วยให้คุณสามารถค้นหาและจองสนามได้สะดวกเพียงไม่กี่คลิก โดยไม่ต้องเสียเวลาโทรสอบถามหรือเดินทางไปจองด้วยตัวเอง
            </p>

            <p className="about-text">
              เรามีตัวเลือกสนามกีฬาหลากหลายประเภทให้คุณได้เลือก ไม่ว่าจะเป็น ฟุตบอล, บาสเกตบอล, แบดมินตัน, เทนนิส และอื่น ๆ
              พร้อมทั้งระบบคัดคุณภาพสนาม ไม่ว่าจะเป็นรีวิวจากผู้ใช้งานจริง คะแนนบริการ และข้อมูลตำแหน่งสนามที่ใกล้คุณที่สุด
            </p>

            <p className="about-text">
              ไม่ว่าคุณจะเป็นนักกีฬามืออาชีพ หรือเพียงแค่ต้องการสถานที่ออกกำลังกายกับเพื่อน ๆ
              <b>Sportify Booking</b> พร้อมช่วยให้การจองสนามเป็นเรื่องง่าย รวดเร็ว และน่าเชื่อถือ!
            </p>

            {/* รายชื่อสมาชิก */}
            <div className="about-members">
              <h2 className="members-title">📌 สมาชิกผู้จัดทำ</h2>
              <ul className="members-list">
                <li>6330300160 - ชญานิน ตลับเงิน</li>
                <li>6330300071 - กิตติญาภรณ์ ดวงไกร</li>
                <li>6530300686 - อิสราภรณ์ นิลประดับ</li>
                <li>6530300953 - ฟาริดา ภักดีชาติ</li>
                <li>6530301038 - ศิริกุล ก่อสูงเนิน</li>
                <li>6530300759 - เจมจิรัฏฐ์ งามสินจำรัส</li>
                <li>6530300589 - สุนันทา ธูปสมุทร</li>
                <li>6530300465 - รินรดา คัตตพันธ์</li>
                <li>6530300554 - สิริวิมล แสงทอง</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
