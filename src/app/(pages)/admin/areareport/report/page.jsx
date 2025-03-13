"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

const FinancialReport = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [modalData, setModalData] = useState(null);
  const [mergedData, setmergedData] = useState()
  const [combinedData, setcombinedData] = useState() // ✅ เก็บข้อมูลสำหรับ Popup
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ ดึง token และตรวจสอบ
        const storedToken = localStorage.getItem("token");
        const tokenObject = storedToken ? JSON.parse(storedToken) : null;
        const token = tokenObject?.token || "";

        if (!token) {
          alert("⚠️ กรุณาเข้าสู่ระบบก่อน");
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        console.log("🔹 Headers:", headers);

        // ✅ เรียก API ทั้งหมด
        const [salesRes, refundRes, historyRes, ownersRes] = await Promise.all([
          axios.get("http://localhost:5009/api/confirm", { headers }),
          axios.get("http://localhost:5002/api/bookings", { headers }),
          axios.get("http://localhost:4003/api/history", { headers }),
          axios.get("http://localhost:5011/api/users", { headers }), // ✅ เพิ่ม API /owners
        ]);
        console.log("🔹 History Data:", historyRes.data);
        console.log("🔹 Owners Data:", ownersRes.data); // ✅ แสดงข้อมูล owners ใน console
        const ownersMap = ownersRes.data.reduce((acc, owner) => {
          acc[owner._id] = owner;
          return acc;
        }, {});

        // ✅ รวมข้อมูล history กับ owner
        const mergedData = historyRes.data.map(item => ({
          ...item,
          ownerInfo: ownersMap[item.owner._id] || null // ถ้าไม่พบ owner ให้เป็น null
        }));
        setmergedData(mergedData)
        console.log(mergedData);
        const today = new Date().toISOString().split("T")[0];

        const salesMap = salesRes.data.reduce((acc, item) => {
          if (item.location && item.price) {
            if (!acc[item.location]) {
              acc[item.location] = {
                location: item.location,
                day: today,
                price: 0,
                refunded: 0,
                deduction: 0,
                payout: 0
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
                deduction: 0,
                payout: 0
              };
            }
            salesMap[refund.location].refunded += Number(refund.price);
          });

        const finalData = Object.values(salesMap).map((item) => {
          const netRevenue = item.price - item.refunded;
          const deduction = 0.05 * netRevenue;
          const payout = netRevenue - deduction;

          return {
            id: uuidv4(),
            ...item,
            deduction: deduction.toFixed(2),
            payout: payout.toFixed(2)
          };
        });
        // ✅ สร้าง Map จาก finalData เพื่อเข้าถึงข้อมูลได้เร็วขึ้น
        const mergedMap = mergedData.reduce((acc, item) => {
          acc[item.location] = item; // บันทึกข้อมูล location เป็น key
          return acc;
        }, {});
        
        // ✅ ดึงเฉพาะข้อมูลที่มีอยู่ใน finalData และเติม ownerInfo ถ้ามี
        const matchedData = finalData.map(item => ({
          ...item,
          ownerInfo: mergedMap[item.location]?.ownerInfo || null // เติมข้อมูล owner ถ้ามี
        }));

        setcombinedData(matchedData)
        setData(finalData);
        setOwners(ownersRes.data); // ✅ บันทึก owners ไว้ใน state

      } catch (error) {
        console.error("🚨 Error fetching data:", error);
        if (error.response && error.response.status === 401) {
          alert("❌ Token หมดอายุ หรือไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่");
          router.push("/login");
        }
      }
    };

    fetchData();
  }, []);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const tokenObject = storedToken ? JSON.parse(storedToken) : null;
        const token = tokenObject?.token || "";

        if (!token) {
          alert("⚠️ กรุณาเข้าสู่ระบบก่อน");
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const ownersRes = await axios.get("http://localhost:5011/api/users", { headers });

        // Filter เฉพาะ owner ที่มี role เป็น "owner"
        const filteredOwners = ownersRes.data.filter(item => item.role === "owner");
        setOwners(filteredOwners);
      } catch (error) {
        console.error("🚨 Error fetching owners data:", error);
      }
    };

    fetchOwners();
  }, []);




  const handleCheckboxChange = (row) => {
    setSelectedRows((prev) => {
      const newSelectedRows = { ...prev };
      if (newSelectedRows[row.id]) {
        delete newSelectedRows[row.id];
      } else {
        newSelectedRows[row.id] = {
          date: row.day,
          location: row.location,
          totalRevenue: row.price,
          refund: row.refunded || 0,
          deduction5Percent: parseFloat(row.deduction),
          payout: parseFloat(row.payout),
        };
      }
      return newSelectedRows;
    });
  };

  const handleSave = async () => {
    const selectedData = Object.values(selectedRows);

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
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {combinedData ? combinedData.map((row) => (
                <tr key={row.id} className="bg-white">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[row.id]}
                      onChange={() => handleCheckboxChange(row)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-3">{row.day}</td>
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.price.toFixed(2)} ฿</td>
                  <td className="p-3">{row.refunded.toFixed(2)} ฿</td>
                  <td className="p-3">{row.deduction} ฿</td>
                  <td className="p-3">{row.payout} ฿</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setModalData(row)
                        console.log("🔹 data:",data)
                        console.log("🔹 mergedData:", mergedData);
                        console.log("🔹 combinedData:", combinedData)
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-green-600"
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              )):<>Loading...</>}
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

      {/* ✅ Popup (Modal) สำหรับแสดงรายละเอียด */}
      {modalData && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3">รายละเอียด</h2>
            <p><strong>วัน:</strong> {modalData.day}</p>
            <p><strong>สถานที่:</strong> {modalData.location}</p>
            <p><strong>รายได้รวม:</strong> {modalData.price.toFixed(2)} ฿</p>
            <p><strong>คืนเงิน:</strong> {modalData.refunded.toFixed(2)} ฿</p>
            <p><strong>หัก 5%:</strong> {modalData.deduction} ฿</p>
            <p><strong>เงินออก:</strong> {modalData.payout} ฿</p>
            <p><strong>firstname:</strong> {modalData.ownerInfo.firstName} </p>
            <p><strong>email:</strong> {modalData.ownerInfo.bank} </p>
            <p><strong>accountNumber:</strong> {modalData.ownerInfo.accountNumber}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setModalData(null)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinancialReport;
