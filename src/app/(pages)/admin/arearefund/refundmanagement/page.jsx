"use client";
import React, { useState, useEffect } from 'react';
import TopBar_Admin from '@components/Topbar_Admin';
import { useRouter } from "next/navigation";
import axios from "axios";

const AdminPaidTable = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [userData, setUserData] = useState({});
  const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ token
    req.user = decoded; // ใส่ข้อมูล user ใน request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/bookings-old");
        const filteredData = response.data?.filter(
          (booking) => booking && booking.status?.trim().toLowerCase() === "cancel"
        );
        setRows(filteredData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        const userArray = res.data; // ได้เป็น Array
      
        console.log("📌 Full User Data:", userArray); // เช็คข้อมูล API
  
        // หา user ที่มี _id ตรงกับที่ต้องการ
        const matchedUser = userArray.find(user => user._id === "67bf3de50e51f05aa264045d");
  
        if (matchedUser) {
          console.log("✅ Account Number:", matchedUser.accountNumber); // แสดงค่า accountNumber
          setUserData(matchedUser); // อัปเดต state
        } else {
          console.log("❌ No matching user found!");
        }
      } catch (error) {
        console.error("🚨 Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  
  
  
  
  
  

  const [showManagePopup, setShowManagePopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleArrowClick = () => {
    router.push("/admin/");
  };

  const handleManageClick = (row) => {
    setSelectedData(row);
    setShowManagePopup(true);
  };

  const handleCloseManagePopup = () => {
    setShowManagePopup(false);
    setSelectedData(null);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5002/api/bookings/${id}`, { status });
      setRows(rows.map(row => row._id === id ? { ...row, status } : row));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  const handleRefundPayment = async () => {
    if (!selectedData) return;
    await updateBookingStatus(selectedData._id, "refunded");
    handleCloseManagePopup();
  };

  const handleDeleteRow = async (id) => {
    await updateBookingStatus(id, "reserve");
  };

  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6">
        <div className="flex items-center">
          <button className="p-4 text-black font-bold rounded-full text-3xl">
            <span className="text-3xl" onClick={handleArrowClick}>&lt;</span>
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-4">Refund Management</h1>

        <table className="table-auto w-full border-collapse border border-gray-300 mt-4 text-center shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Name</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length > 0 ? (
              rows.map((row) => (
                <tr key={row?._id} className="border-b border-gray-300 hover:bg-gray-100 transition">
                  <td className="p-3">{row?.day}</td>
                  <td className="p-3">{row?.name}</td>
                  <td className="p-3">{row?.time}</td>
                  <td className="p-3">{row?.status}</td>
                  <td className="p-3">{row?.price} baht</td>
                  <td className="p-3 flex justify-center gap-2">
                    <img
                      src={row?.paymentDetails?.image || "/placeholder.png"}
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleManageClick(row)}
                    />
                    <button
                      onClick={() => handleDeleteRow(row?._id)}
                      className="p-2 bg-red-500 text-white rounded shadow hover:bg-red-700 transition"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">ไม่มีข้อมูลการจองที่ถูกยกเลิก</td>
              </tr>
            )}
          </tbody>
        </table>

        {showManagePopup && selectedData && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
              <input type="file" onChange={handleFileChange} className="mb-2" />
              <p><strong>Day:</strong> {selectedData.day}</p>
              <p><strong>Name:</strong> {selectedData.name}</p>
              <p><strong>Payment Method:</strong> Transfer money through bank account</p>
              <p><strong>Bank Number:</strong> {userData ? userData.accountNumber : "Loading..."}</p>
              <button
                className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg shadow hover:bg-green-700"
                onClick={handleRefundPayment}
              >
                Refund Payment
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 mt-4 ml-2 rounded-lg shadow hover:bg-gray-700"
                onClick={handleCloseManagePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPaidTable;
