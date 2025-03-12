"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import { useRouter } from "next/navigation";

const FinancialReport = () => {
  const [data, setData] = useState([]); // 👈 ใช้ state สำหรับเก็บข้อมูลจาก API
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5009/api/confirm");
        console.log("📌 API Response:", response.data); // Debug
        setData(response.data);
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  

  const handleDateClick = (date) => {
    console.log(`Selected date: ${date}`);
  };

  const handleArrowClick = () => {
    router.push("/admin/areareport");
  };

  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        <div className="flex items-center w-full mb-4 justify-between">
          <button className="p-4 text-black font-bold rounded-full text-3xl" onClick={handleArrowClick}>
            &lt;
          </button>
          <h1 className="text-xl font-semibold">Financial Report</h1>
          <div className="w-10" />
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-full max-w-4xl">
          <table className="table-fixed w-full text-sm">
            <thead className="bg-gray-200 text-gray-700 text-center">
              <tr>
                <th className="p-3 w-1/5 text-left">Select</th>
                <th className="p-3 w-1/5 text-left">Day</th>
                <th className="p-3 w-1/5 text-left">Location</th>
                <th className="p-3 w-1/5 text-left">รายได้รวม</th>
                <th className="p-3 w-1/5 text-left">คืนเงิน</th>
                <th className="p-3 w-1/5 text-center">หัก 5%</th>
                <th className="p-3 w-1/5 text-center">เงินออก</th>
                <th className="p-3 w-1/5 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-blue-50" : "bg-white"}`}>
                    <td className="p-3 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDateClick(row.day)} className="text-blue-600 hover:underline">
                        {row.day}
                      </button>
                    </td>
                    <td className="p-3">{row.location}</td>
                    <td className="p-3 px-5 text-left">{row.price} ฿</td>
                    <td className="p-3 px-5">-</td>
                    <td className="p-3 text-center">{(row.total_price * 0.05).toFixed(2)} ฿</td>
                    <td className="p-3 text-center">{(row.total_price * 0.95).toFixed(2)} ฿</td>
                    <td className="p-3 text-center">-</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-3 text-center text-gray-500">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FinancialReport;
