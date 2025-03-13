"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import { useRouter } from "next/navigation";

const FinancialReport = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, refundRes] = await Promise.all([
          axios.get("http://localhost:5009/api/confirm"),
          axios.get("http://localhost:5002/api/bookings"),
        ]);

        const today = new Date().toISOString().split("T")[0];

        const salesMap = salesRes.data.reduce((acc, item) => {
          if (item.location && item.price) {
            if (!acc[item.location]) {
              acc[item.location] = {
                location: item.location,
                day: today,
                price: 0,
                refunded: 0,
              };
            }
            acc[item.location].price += Number(item.price);
          }
          return acc;
        }, {});

        refundRes.data
          .filter((refund) => refund.status === "refunded" && refund.price)
          .forEach((refund) => {
            if (!salesMap[refund.location]) {
              salesMap[refund.location] = {
                location: refund.location,
                day: today,
                price: 0,
                refunded: 0,
              };
            }
            salesMap[refund.location].refunded += Number(refund.price);
          });

        const finalData = Object.values(salesMap).map((item, index) => {
          const netIncome = item.price - item.refunded;
          const deduction = netIncome * 0.05;
          const payout = netIncome - deduction;

          return {
            id: index,
            ...item,
            netIncome,
            deduction: deduction.toFixed(2),
            payout: payout.toFixed(2),
          };
        });

        setData(finalData);
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Checkbox Change
  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Handle Save (POST เฉพาะแถวที่ถูกเลือก)
  const handleSave = async () => {
    const selectedData = data.filter((row) => selectedRows[row.id]);

    if (selectedData.length === 0) {
      alert("⚠️ โปรดเลือกข้อมูลที่ต้องการบันทึก");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5008/api/finance", selectedData);
      if (response.status === 201) {
        alert("✅ บันทึกข้อมูลเรียบร้อย!");
      }
    } catch (error) {
      console.error("🚨 Error saving data:", error);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-full max-w-4xl">
          <table className="table-fixed w-full text-sm">
            <thead className="bg-gray-200 text-gray-700 text-center">
              <tr>
                <th className="p-3">เลือก</th>
                <th className="p-3">วัน</th>
                <th className="p-3">สถานที่</th>
                <th className="p-3">รายได้รวม</th>
                <th className="p-3">คืนเงิน</th>
                <th className="p-3">หัก 5%</th>
                <th className="p-3">เงินออก</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="bg-white">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows[row.id] || false}
                      onChange={() => handleCheckboxChange(row.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-3">{row.day}</td>
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.price} ฿</td>
                  <td className="p-3">{row.refunded || "-"} ฿</td>
                  <td className="p-3">{row.deduction} ฿</td>
                  <td className="p-3">{row.payout} ฿</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xl hover:bg-blue-600 mt-5"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default FinancialReport;
