"use client";
import React, { useState, useEffect } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import axios from "axios";

const FinancialReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/confirm");
        setData(res.data);
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        <h1 className="text-xl font-semibold mb-4">Financial Report</h1>

        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-full max-w-4xl">
          <table className="table-fixed w-full text-sm">
            <thead className="bg-gray-200 text-gray-700 text-center">
              <tr>
                <th className="p-3 w-1/5">Day</th>
                <th className="p-3 w-1/5">Location</th>
                <th className="p-3 w-1/5">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-blue-50" : "bg-white"}`}>
                    <td className="p-3 text-center">{row.day}</td>
                    <td className="p-3 text-center">{row.location}</td>
                    <td className="p-3 text-center">{row.total_price} ฿</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">No data available</td>
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
