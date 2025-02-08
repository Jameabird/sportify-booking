"use client";
import React, { useEffect } from "react";
import "@app/globals.css";
import { useRouter } from "next/navigation";
import TopBar from "@components/Topbar";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/Spectator/home"); // Redirect ไปที่ /Spectator
  }, []);

  return null; // ไม่ต้องแสดงอะไรเพราะจะถูก Redirect
}
