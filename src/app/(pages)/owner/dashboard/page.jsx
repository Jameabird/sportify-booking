"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TopBar_Owner from '@components/Topbar_Owner';
import { Bar, Pie } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleselectdate = () => {
    router.push("/owner/dashboardnext");
  };

  const [data, setData] = useState({
    income: [21, 48, 90, 81, 56, 55, 100],
    peopleOut: [21, 48, 19, 19, 55, 27, 40],
    fieldsMostPlayed: { labels: ["แบดมินตัน", "สระว่ายน้ำ", "สนามฟุตบอล"], values: [50, 30, 20] },
    fieldsLeastPlayed: { labels: ["เทนนิส", "แบดมินตัน", "กอล์ฟ"], values: [40, 35, 25] },
    summary: { accounts: 500, totalIncome: 200000, withdrawable: 200000, refunded: 9000, incomeplatform: 300000, tax: 190000 },
  });

  const handleArrowClick = () => {
    router.push("/owner");
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [summary, setSummary] = useState({
    accounts: 0,
    totalRevenue: 0,
    refund: 0,
    deduction5Percent: 0,
    payout: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const tokenObject = storedToken ? JSON.parse(storedToken) : null;
        const token = tokenObject?.token || "";
        const headers = { Authorization: `Bearer ${token}` };

        const [historyRes, financeRes] = await Promise.all([
          axios.get("http://localhost:4003/api/history", { headers }),
          axios.get("http://localhost:5008/api/finance", { headers })
        ]);

        const historyData = historyRes.data;
        const financeData = financeRes.data;

        // หาคนจองทั้งหมด (accounts)
        const accounts = historyData.length;

        // หา location ที่ตรงกันใน finance
        const matchedFinance = financeData.find(fin =>
          historyData.some(hist => hist.location === fin.location)
        );

        if (matchedFinance) {
          setSummary({
            accounts,
            totalRevenue: matchedFinance.totalRevenue,
            refund: matchedFinance.refund,
            deduction5Percent: matchedFinance.deduction5Percent,
            payout: matchedFinance.payout
          });
        }
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
      }
    };

    fetchData();
  }, []);




  return (
    <>
      <TopBar_Owner textColor="black" />
      <div className="p-6">
        {/* Dropdown ปี */}
        <div className="flex justify-end mb-4">
          <select
            className="border p-2 rounded"
            value={selectedYear}
            onChange={(e) => {
              const year = e.target.value;
              setSelectedYear(year);
              handleselectdate();
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>พ.ศ. {year + 543}</option>
            ))}
          </select>
        </div>

        {/* ปุ่มย้อนกลับ */}
        <div>
          <button className="p-4 text-black font-bold rounded-full text-3xl">
            <span className="text-3xl" onClick={handleArrowClick}>&lt;</span>
          </button>
        </div>

        <input type="date" className="ml-12 p-2 rounded background-black mt-3" />

        {/* กราฟแท่ง */}
        <div className="bg-white shadow p-4 rounded mb-4 max-w-md mx-auto">
          <h2 className="text-md font-bold mb-3 text-center">แสดงยอดเงินเข้าและออก</h2>
          <div className="h-50">
            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                  { label: "เงินเข้า", data: data.income, backgroundColor: "rgba(54, 162, 235, 0.6)" },
                  { label: "คนออก", data: data.peopleOut, backgroundColor: "rgba(75, 192, 192, 0.6)" }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } }
              }}
            />
          </div>
        </div>

        {/* กราฟวงกลม */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div></div>
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

        {/* สรุปข้อมูล */}
        <div className="grid grid-cols-2 gap-6 ">
          <div className="bg-white shadow p-6 rounded text-center">
            <h3 className="text-lg font-bold">จำนวนผู้คนที่จองทั้งหมด</h3>
            <p className="text-2xl font-semibold">{summary.accounts} บัญชี</p>
            <h3 className="text-lg font-bold mt-5">Payout</h3>
            <p className="text-2xl font-semibold">{summary.payout.toLocaleString()} บาท</p>
          </div>

          <div className="bg-white shadow p-6 rounded text-center">
            <h3 className="text-lg font-bold">Total Revenue</h3>
            <p className="text-2xl font-semibold">{summary.totalRevenue.toLocaleString()} บาท</p>
            <h3 className="text-lg font-bold mt-5">Refund</h3>
            <p className="text-2xl font-semibold">{summary.refund.toLocaleString()} บาท</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
