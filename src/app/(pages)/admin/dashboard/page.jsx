"use client";

import React, { useState } from "react";

const FinancialReport = () => {
  const [data] = useState([
    { id: 1, date: "01/01/25", item: "จองสนามแบด", amount: 2500, fee: 2375, officer: "อาคารแบด 1", status: "success" },
    { id: 2, date: "01/01/25", item: "คืนเงินลูกค้า", amount: -1200, fee: "-", officer: "user B", status: "refunded" },
    { id: 3, date: "01/01/25", item: "จองสนามฟุตบอล", amount: 3000, fee: 2850, officer: "อาคารฟุตบอล 1", status: "success" },
  ]);

  const handleDateClick = (date) => {
    console.log(`Selected date: ${date}`);
    // Add custom logic here, e.g., show more details for the selected date.
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button className="p-2 mr-4 bg-gray-200 rounded hover:bg-gray-300 transition">←</button>
        <h1 className="text-xl font-semibold">Financial Report</h1>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col items-start mb-4">
        <div className="text-lg mb-2">
          รายได้รวม : <span className="font-medium">27,000฿</span> |
          หัก 5% : <span className="font-medium">3,000฿</span> |
          Officer Payout : <span className="font-medium">25,000฿</span> |
          Refunded : <span className="font-medium">2,000฿</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">📅</span>
          <input type="date" className="mr-2 p-2 rounded" />
          
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="table-auto w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 text-left">วันที่</th>
              <th className="p-2 text-left">รายการ</th>
              <th className="p-2 text-right">จำนวนเงิน</th>
              <th className="p-2 text-right">หัก 5%</th>
              <th className="p-2 text-left">Officer</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className={`border-b ${
                  row.id % 2 === 0 ? "bg-blue-50" : "bg-white"
                }`}
              >
                <td className="p-2">
                  <button
                    onClick={() => handleDateClick(row.date)}
                    className="text-blue-600 hover:underline"
                  >
                    {row.date}
                  </button>
                </td>
                <td className="p-2">{row.item}</td>
                <td className="p-2 text-right">{row.amount}</td>
                <td className="p-2 text-right">{row.fee}</td>
                <td className="p-2">{row.officer}</td>
                <td className="p-2 text-center">
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
  );
};

export default FinancialReport;
