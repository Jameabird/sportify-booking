"use client";

import React, { useState } from "react";
import TopBar_Admin from '@components/Topbar_Admin';
import { useRouter } from "next/navigation";
const FinancialReport = () => {
  const [data] = useState([
    { id: 1, date: "01/01/25"},
    
  ]);

  const handleDateClick = (date) => {
    console.log(`Selected date: ${date}`);
  };
  const router = useRouter();
  const handleArrowClick = () => {
    router.push("/admin/areareport"); // Route to /admin/area
  };
  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center w-full mb-4 justify-between">
        <button
            className="p-4  text-black font-bold rounded-full text-3xl"
            
          >
            <span className="text-3xl" onClick={handleArrowClick}>&lt;</span>
          </button>
          <h1 className="text-xl font-semibold">Financial Report</h1>
          <div className="w-10" /> {/* สำหรับความสมดุลของการจัดกลาง */}
        </div>

        {/* Summary Section */}
        <div className="flex flex-col items-center mb-6">
          
        </div>

        {/* Table Section */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-full max-w-4xl">
          <table className="table-fixed w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 w-1/5 text-left">Day</th>
                <th className="p-3 w-1/5 text-left">Name</th>
                <th className="p-3 w-1/5 text-left">รายได้รวม</th>
                <th className="p-3 w-1/5 text-left">คืนเงิน</th>
                <th className="p-3 w-1/5 text-center">หัก 5%</th>
                <th className="p-3 w-1/5 text-center">เงินออก</th>
                <th className="p-3 w-1/5 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
  {data.map((row) => (
    <tr
      key={row.id}
      className={`border-b ${row.id % 2 === 0 ? "bg-blue-50" : "bg-white"}`}
    >
      <td className="p-3">
        <button
          onClick={() => handleDateClick(row.date)}
          className="text-blue-600 hover:underline"
        >
          {row.date}
        </button>
      </td>
      <td className="p-3">{row.item}</td>
      <td className="p-3 px-5 text-left">{row.amount}</td>
      <td className="p-3 px-5">{row.officer}</td>
      <td className="p-3 text-center">
        {row.status === "success" ? (
          <span className="text-green-500">✓ success</span>
        ) : (
          <span className="text-red-500">✗ refunded</span>
        )}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FinancialReport;
