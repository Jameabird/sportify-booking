"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { Pencil, Trash } from "lucide-react";
import TopBar_Officer from "@components/Topbar_Officer"; // Import TopBar_Owner

const courts = [
  { id: 1, name: "Court 1", open: "08:00", close: "20:00" },
  { id: 2, name: "Court 2", open: "08:00", close: "20:00" },
  { id: 3, name: "Court 3", open: "08:00", close: "20:00" },
  { id: 4, name: "Court 4", open: "08:00", close: "20:00" },
  { id: 5, name: "Court 5", open: "08:00", close: "20:00" },
  { id: 6, name: "Court 6", open: "08:00", close: "20:00" },
];

export default function CourtList() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ✅ เพิ่ม TopBar_Officer */}
      <TopBar_Officer />

      <div className="max-w-5xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-lg">
        {/* ✅ ลบปุ่มเพิ่มคอร์ดออก */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            รายการสนามแบดมินตัน
          </h1>
        </div>

        {/* ✅ ใช้ Tailwind ปรับตารางให้สวยขึ้น */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">Court Name</th>
                <th className="p-3 text-left">ประเภทสนาม</th>
                <th className="p-3 text-left">Open</th>
                <th className="p-3 text-left">Close</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court, index) => (
                <tr
                  key={court.id}
                  className="border-b transition hover:bg-blue-100"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{court.name}</td>
                  <td className="p-3 text-gray-700">สนามแบดมินตัน</td>
                  <td className="p-3">{court.open}</td>
                  <td className="p-3">{court.close}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <Button
                      variant="outlined"
                      size="small"
                      className="border-green-500 text-green-500 hover:bg-green-100"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
