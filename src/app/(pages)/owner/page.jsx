"use client";
import React,{useState,useEffect} from "react";
import "@app/globals.css";
import TopBar_Owner from "@components/Topbar_Owner";

export default function OwnerHome() {
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
          <div className="grid grid-rows-auto gap-2">
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <TopBar_Owner textColor={"white"} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
