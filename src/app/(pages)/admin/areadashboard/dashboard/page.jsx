"use client";

import React, { useState } from "react";
import TopBar_Admin from '@components/Topbar_Admin';
import { useRouter } from "next/navigation";
const FinancialReport = () => {
  const [data] = useState([
    { id: 1, date: "01/01/25", item: "จองสนามแบด", amount: 2500, officer: "อาคารแบด 1", status: "success" },
    { id: 2, date: "01/01/25", item: "คืนเงินลูกค้า", amount: -1200, officer: "user B", status: "refunded" },
    { id: 3, date: "01/01/25", item: "จองสนามฟุตบอล", amount: 3000, officer: "อาคารฟุตบอล 1", status: "success" },
  ]);

  const handleDateClick = (date) => {
    console.log(`Selected date: ${date}`);
  };
  const router = useRouter();
  const handleArrowClick = () => {
    router.push("/admin/areadashboard"); // Route to /admin/area
  };
  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center w-full mb-4 justify-between">
          <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition" onClick={handleArrowClick}>←</button>
          <h1 className="text-xl font-semibold">Financial Report</h1>
          <div className="w-10" /> {/* สำหรับความสมดุลของการจัดกลาง */}
        </div>

        {/* Summary Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center mb-2">
            <input type="date" className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="text-lg text-center">
            รายได้รวม: <span className="font-medium">27,000฿</span> |
            หัก 5%: <span className="font-medium">3,000฿</span> |
            Officer Payout: <span className="font-medium">25,000฿</span> |
            Refunded: <span className="font-medium">2,000฿</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-full max-w-4xl">
          <table className="table-fixed w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 w-1/5 text-left">วันที่</th>
                <th className="p-3 w-1/5 text-left">รายการ</th>
                <th className="p-3 w-1/5 text-left">จำนวนเงิน</th>
                <th className="p-3 w-1/5 text-left">Officer</th>
                <th className="p-3 w-1/5 text-center">Status</th>
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
