"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TopBar_User from "@components/Topbar_User";
import Popup from 'reactjs-popup';
import './popup.css';

const ArcherBooking = () => {
  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที (เวลาเป็นวินาที)
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedCourts, setSelectedCourts] = useState("");
  const [selectedDatePaid, setSelectedDatePaid] = useState("");
  const [selectedTimePaid, setSelectedTimePaid] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const showfirstPopup = () => {
    setShowPopup(true);
  };

  // ✅ Fetch Data from API and Filter Type "Archer"
  useEffect(() => {
    axios
      .get("http://localhost:5005/api/buildings") // ✅ Ensure correct API route
      .then((response) => {
        console.log("API Response:", response.data);

        let archerData = response.data;

        // ✅ Handle API returning an array
        if (Array.isArray(response.data)) {
          archerData = response.data.find((item) => item.Type === "Archer");
        }

        if (archerData && archerData.Type === "Archer") {
          setData(archerData.Building);
          setSelectedBuilding(Object.keys(archerData.Building)[0]); // Auto-select first building
        } else {
          console.error("⚠️ No Archer data found.");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    axios
        .get("http://localhost:5000/api/users/current", {
          withCredentials: true, // 🔥 Ensures cookies or tokens are sent
        })
        .then((response) => {
          console.log("✅ Current User:", response.data);
          setUsername(response.data.id); // Use `id` for userId
          setRole(response.data.role);
        })
        .catch((error) => {
          console.error("❌ Error fetching current user:", error.response?.data || error);
        });
  }, []);
  
  
  const handleConfirmBooking = async () => {
    const selectedCourts = Object.keys(selectedCheckboxes).filter(
      (field) => selectedCheckboxes[field]
    );
  
    if (!selectedDate || !selectedBuilding || selectedCourts.length === 0) {
      alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
  
    const bookingData = {
      userId: username, // Assuming `username` is actually the userId from API
      name: username || "Unknown User",
      role: role || "user",
      day: selectedDate,
      time: selectedTimes || "ไม่ระบุ",
      location: selectedBuilding,
      field: selectedCourts.join(", "),
      status: "reserve",
      price: totalPrice || 0,
      type: "archer",
      building: selectedBuilding,
      datepaid: selectedDatePaid ? new Date(selectedDatePaid).toISOString() : new Date().toISOString(),
      timepaid: selectedTimePaid || "",
    };
  
    console.log("📌 Booking Data Sent:", bookingData);
  
    try {
      const response = await fetch("http://localhost:5002/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "เกิดข้อผิดพลาด");
  
      alert("✅ จองสำเร็จ!");
      setShowImagePopup(false);
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาดในการจอง");
    }
  };
  
  
  // ✅ Function to handle checkbox selection
  const handleCheckboxChange = (field) => {
    setSelectedCheckboxes((prev) => {
      const updatedCheckboxes = { ...prev, [field]: !prev[field] };
      
      // Update selectedCourts to reflect checked boxes
      const updatedCourts = Object.keys(updatedCheckboxes)
        .filter((key) => updatedCheckboxes[key]);
  
      setSelectedCourts(updatedCourts);
      return updatedCheckboxes;
    });
  };
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    console.log("⏰ Time Selected:", selectedTime);
    setSelectedTimePaid(selectedTime); // Assuming selectedTimePaid holds the selected time
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  const handleImagePopup = () => {
    setShowPopup(false);
    setShowQRPopup(false);
    setShowImagePopup(true); selectedTimes
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // ตั้งค่าภาพที่อัปโหลด
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น URL
    }
  };

  // ✅ Compute selected times
  const selectedTimes = Object.keys(selectedCheckboxes)
    .filter((field) => selectedCheckboxes[field])
    .map((field) => data[selectedBuilding]?.[field]?.open || "Unknown Time")
    .join(", ") || "No time selected";

  // ✅ Compute total price
  const totalPrice = Object.keys(selectedCheckboxes)
    .filter((field) => selectedCheckboxes[field])
    .reduce((total, field) => total + (parseFloat(data[selectedBuilding]?.[field]?.Price) || 0), 0);

  // ✅ Clear only checkboxes (keep date & building selection)
  const handleClear = () => {
    setSelectedCheckboxes({}); // Clears all checkboxes but keeps other selections
  };
  const handleConfirm = async () => {
    console.log("handleConfirm ถูกเรียกแล้ว ✅");
    console.log("selectedCourts:", selectedCourts); // ตรวจสอบค่าที่เลือก

    // if (selectedCourts.length === 0) {
    //   alert("กรุณาเลือกการจองก่อน");
    //   return;
    // }

    try {
      setShowQRPopup(true);
      console.log("Popup ควรเปิดตอนนี้: ", showPopup);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Top Navigation */}
      <TopBar_User textColor={"black"} />

      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-center h-[300px] flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/assets/Archer/Archer1.png')",
          backgroundBlendMode: "multiply",
          opacity: 0.9,
        }}
      >
        <h1 className="text-4xl font-bold shadow-lg">Archer Booking</h1>
      </div>

      {/* Booking Controls */}
      <div className="max-w-5xl mx-auto mt-5 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {/* Date Input */}
          <input
            type="date"
            value={selectedDatePaid}
            onChange={(e) => {
              console.log("📅 Date Selected:", e.target.value);
              setSelectedDate(e.target.value);
            }}
            className="border rounded-md px-3 py-2"
          />

          {/* Building Dropdown */}
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {Object.keys(data).map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Booking Table */}
      <div className="max-w-5xl mx-auto mt-5">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-300 text-black">
              <th className="p-2">Select</th>
              <th className="p-2">Court</th>
              <th className="p-2">Price</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {data[selectedBuilding] &&
              Object.entries(data[selectedBuilding]).map(([field, details]) => (
                <tr key={field} className="border-b text-center">
                  <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selectedCheckboxes[field]} // ✅ Syncs with state
                    onChange={() => handleCheckboxChange(field)}
                    disabled={!details.Booking}
                  />
                  </td>
                  <td className="p-2">{field}</td>
                  <td className="p-2">{details.Price}</td>
                  <td className="p-2">{details.open},{details.close}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Popup Button */}
      <div className="popup-container text-center mt-5">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md" onClick={showfirstPopup}>
          Booking
        </button>
        <button onClick={handleClear} className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md">
          Clear
        </button>
      </div>

      {/* Popup for Booking Details */}
      <Popup open={showPopup} modal nested onClose={() => setShowPopup(false)}>
                <div className="modal">
                  <div className="header">รายละเอียดการจอง</div>
                  <div className="content">
                    <div className="booking-details">
                      <p><span>สถานที่:</span> <span>{selectedBuilding || "กรุณาเลือกสถานที่"}</span></p>
                      <p><span>วันที่:</span> <span>{selectedDatePaid || "กรุณาเลือกวันที่"}</span></p>
                      <p><span>เวลา:</span><span>{selectedTimes}</span></p>
                      <p><span>ราคารวม:</span><span>฿{totalPrice.toFixed(2)}</span></p>
                    </div>
                  </div>
                  <div className="actions">
                    <button className="confirm-button" onClick={handleConfirm}>
                      ยืนยัน
                    </button>
                    <button className="cancel-button" onClick={() => setShowPopup(false)}>
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </Popup>

              {/* Popup สำหรับแสดง QR Code */}
              <Popup
                open={showQRPopup}
                modal
                nested
                onClose={() => setShowQRPopup(false)} // ปิด Popup QR Code
              >
                <div className="modal">
                  <div className="header"></div>
                  <div className="content">
                    <div style={{ position: 'relative' }}>
                      <img
                        src="/myqr.png"
                        alt="QR Code"
                        className="qr-image"
                        style={{ width: '250px', height: '250px' }}
                      />
                      {/* ข้อความที่แสดง */}
                      <p className="qr-description">
                        Arena Pattaya co.ltd<br />฿{totalPrice.toFixed(2)}
                      </p>
                      <div className="qr-price">
                        <div>ชำระเงินภายใน</div>
                        <span>{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                    <div className="actions">
                      <button
                        className="confirm-button"
                        onClick={handleImagePopup} // เปิด Popup สำหรับอัปโหลดรูปภาพ
                      >
                        ยืนยัน
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setShowQRPopup(false)}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>

              {/* Popup สำหรับอัปโหลดรูปภาพ */}
              <Popup open={showImagePopup} modal nested onClose={() => setShowImagePopup(false)}>
                <div className="modal">
                  <div className="header">แนบหลักฐานการชำระเงิน</div>
                  <div className="content">
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                    {uploadedImage && (
                      <div className="uploaded-image-container">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "10px",
                          }}
                        />
                        <p className="image-caption">กรุณาเลือก วัน/เวลา ที่ชำระ</p>
                        {/* Container สำหรับ วัน เดือน ปี */}
                        <div
                          className="date-picker-container"
                          style={{
                            display: "flex",
                            gap: "10px", // ระยะห่างระหว่าง dropdown
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          {/* <div className="pl-2 py-1">
                            <DatePicker style={{ border: "none" }} onChange={changeDatepaid} />
                          </div> */}
                        </div>

                        {/* ส่วนของเวลา */}
                        <div
                          className="time-picker-container"
                          style={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >

                          <input
                            type="time"
                            id="timepaid"
                            value={selectedTimePaid} // ✅ ตรวจสอบว่า value เป็น string
                            onChange={handleTimeChange} // ✅ อัปเดตค่าให้ถูกต้อง
                            style={{
                              padding: "5px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                            }}
                          />


                        </div>
                      </div>
                    )}
                  </div>
                  <div className="actions">
                    <button
                      className="confirm-button"
                      onClick={handleConfirmBooking}
                    >
                      ยืนยัน
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setShowImagePopup(false)}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </Popup>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-5">
      </div>
    </div>
  );
};

export default ArcherBooking;