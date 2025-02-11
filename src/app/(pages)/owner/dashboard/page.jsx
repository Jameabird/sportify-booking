"use client";
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState({
    income: [21, 48, 90, 81, 56, 55, 100], // เงินเข้า
    peopleOut: [21, 48, 19, 19, 55, 27, 40], // คนออก
    fieldsMostPlayed: { labels: ["แบดมินตัน", "สระว่ายน้ำ", "สนามฟุตบอล"], values: [50, 30, 20] },
    fieldsLeastPlayed: { labels: ["เทนนิส", "แบดมินตัน", "กอล์ฟ"], values: [40, 35, 25] },
    summary: { accounts: 500, totalIncome: 300000, withdrawable: 200000, refunded: 9000 }
  });

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="p-6">
      {/* Dropdown ปี */}
      <div className="flex justify-end mb-4">
        <select className="border p-2 rounded" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>{`พ.ศ.${year + 543}`}</option>
          ))}
        </select>
      </div>

      {/* กราฟแท่ง */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-bold mb-4">แสดงยอดเงินเข้าและออก</h2>
        <Bar
          data={{
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
              { label: "เงินเข้า", data: data.income, backgroundColor: "rgba(54, 162, 235, 0.6)" },
              { label: "คนออก", data: data.peopleOut, backgroundColor: "rgba(75, 192, 192, 0.6)" }
            ]
          }}
          options={{ responsive: true, plugins: { legend: { position: "top" } } }}
        />
      </div>

      {/* กราฟวงกลม */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-bold mb-4">สนามที่มีคนเล่นมากที่สุด</h2>
          <Pie
            data={{
              labels: data.fieldsMostPlayed.labels,
              datasets: [{ data: data.fieldsMostPlayed.values, backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0"] }]
            }}
          />
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-bold mb-4">สนามที่มีคนเล่นน้อยที่สุด</h2>
          <Pie
            data={{
              labels: data.fieldsLeastPlayed.labels,
              datasets: [{ data: data.fieldsLeastPlayed.values, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }]
            }}
          />
        </div>
      </div>

      {/* การ์ดข้อมูลสรุป */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded text-center">
          <h3 className="text-lg font-bold">จำนวนบัญชีที่เปิดใช้งาน</h3>
          <p className="text-2xl font-semibold">{data.summary.accounts} บัญชี</p>
        </div>
        <div className="bg-white shadow p-6 rounded text-center">
          <h3 className="text-lg font-bold">จำนวนเงินที่เข้า</h3>
          <p className="text-2xl font-semibold">{data.summary.totalIncome.toLocaleString()} บาท</p>
        </div>
        <div className="bg-white shadow p-6 rounded text-center">
          <h3 className="text-lg font-bold">คืนเงินให้ลูกค้า</h3>
          <p className="text-2xl font-semibold">{data.summary.refunded.toLocaleString()} บาท</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
