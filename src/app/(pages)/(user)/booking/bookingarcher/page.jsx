"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TopBar_User from "@components/Topbar_User";
import Popup from "reactjs-popup";
import imageCompression from "browser-image-compression";
import "./popup.css";

// ====== coupons =======//
import CouponList from "./coupons/CouponList";
import CouponDetail from "./coupons/CouponDetail";
// import CouponsPage from "./coupons/CouponsPage";
import "./coupons/CssCoupons.css";
// ====== end coupons =======//

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
  const [Userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const showfirstPopup = () => {
    setShowPopup(true);
  };
  const [preview, setPreview] = useState(null);

  //=== แก้ตรงนี้ coupons ===//
  const [promotions, setPromotions] = useState([]);
    const [couponCounts, setCouponCounts] = useState({}); // ✅ เก็บข้อมูลการจอง
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ ตั้งค่าเริ่มต้นเป็น true
    const [showCoupons, setShowCoupons] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [bookingType, setBookingType] = useState("archer");
  
  
    useEffect(() => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const token = tokenData?.token || null;
  
      if (!token || Date.now() > tokenData?.expirationTime) {
        setError("Token is missing or expired. Please log in again.");
        return;
      }
  
      const fetchPromotions = async () => {
        setLoading(true); 
        try {
          const res = await axios.get("http://localhost:5005/api/promotions", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setPromotions(res.data.promotions);
          setCouponCounts(res.data.couponCounts); 
        } catch (error) {
          setError("Failed to load promotions");
        } finally {
          setLoading(false); 
        }
      };
  
      fetchPromotions();
    }, []);
  

  

  // ✅ Fetch Data from API and Filter Type "Archer"
  useEffect(() => {
    axios
      .get("http://localhost:5005/api/building-user") // ✅ Ensure correct API route
      .then((response) => {
        console.log("API Response:", response.data);

        let archerData = response.data;

        // ✅ Handle API returning an array
        if (Array.isArray(response.data)) {
          archerData = response.data.find((item) => item.Type === "Archer");
        }

        if (archerData && archerData.Type === "Archer") {
          setData(archerData.Building);
          setSelectedBuilding(Object.keys(archerData.Building)[0]);
          setName(archerData.name); // Auto-select first building
        } else {
          console.error("⚠️ No Archer data found.");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
      });
  }, []);

  const canUseCoupon = !loading && couponCounts[bookingType] && couponCounts[bookingType] > 0;
//=== end coupons ===//


  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token")); // Parse stored JSON
    const token = tokenData?.token; // Extract token
  
    if (!token) {
      console.error("❌ No valid token found");
      return;
    }
  
    console.log("Token being sent:", token);
    
    axios
      .get("http://localhost:5000/api/bookings/current", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Correct format
        },
      })
      .then((response) => {
        console.log("✅ Current User Data:", response.data);
        
        // ✅ Ensure response is an array and extract the first object
        if (Array.isArray(response.data) && response.data.length > 0) {
          const user = response.data[0]; // Extract first user
          setUsername(user.username); // ✅ Corrected
          setRole(user.role);
          setUserid(user._id) // ✅ Corrected
          console.log("Username:", user.username);
          console.log("Role:", user.role);
          console.log("Role:", user._id);
        } else {
          console.error("❌ No user data received");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching current user:", error.response?.data || error);
      });
  }, []);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(15 * 60); // รีเซ็ตเป็น 15 นาที
      setShowImagePopup(false);
      setShowPopup(false);
      setShowQRPopup(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // ล้าง interval เมื่อ component ถูก unmount
  }, [timeLeft]);
  
  const handleConfirmBooking = async () => {
    const selectedCourts = Object.keys(selectedCheckboxes).filter(
      (field) => selectedCheckboxes[field]
    );

    if (!selectedDate || !selectedBuilding || selectedCourts.length === 0) {
      alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    const finalPrice = discountedPrice !== null ? discountedPrice : totalPrice;

    const bookingData = {
      userId: Userid,
      name: username || "Unknown User",
      role: role || "user",
      day: selectedDate,
      time: selectedTimes || "ไม่ระบุ",
      location: name,
      field: selectedCourts.join(", "),
      status: "reserve",
      price: finalPrice, 
      // เพิ่มตรงนี้
      type: "archer",
      building: selectedBuilding,
      datepaid: selectedDatePaid
        ? new Date(selectedDatePaid).toISOString()
        : new Date().toISOString(),
      timepaid: selectedTimePaid || "",
      image: uploadedImage,
    };

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
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`);
      console.error("📌 รายละเอียดข้อผิดพลาด:", error);
    }
  };

  // ✅ Function to handle checkbox selection
  const handleCheckboxChange = (field) => {
    setSelectedCheckboxes((prev) => {
      const updatedCheckboxes = { ...prev, [field]: !prev[field] };

      // Update selectedCourts to reflect checked boxes
      const updatedCourts = Object.keys(updatedCheckboxes).filter(
        (key) => updatedCheckboxes[key]
      );

      setSelectedCourts(updatedCourts);
      return updatedCheckboxes;
    });
  };
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    console.log("⏰ Time Selected:", selectedTime);
    setSelectedTimePaid(selectedTime); // Assuming selectedTimePaid holds the selected time
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const options = {
        maxSizeMB: 5, // Limit file size to 1MB
        maxWidthOrHeight: 800, // Resize if needed
        initialQuality: 0.8,
        useWebWorker: true, // Improve performance
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setUploadedImage(reader.result); // ✅ Store compressed base64 image
          setPreview(reader.result); // ✅ Show preview
        };
      } catch (error) {
        console.error("❌ Error compressing image:", error);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  const handleImagePopup = () => {
    setShowPopup(false);
    setShowQRPopup(false);
    setShowImagePopup(true);
    selectedTimes;
  };
  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setUploadedImage(reader.result); // ตั้งค่าภาพที่อัปโหลด
  //     };
  //     reader.readAsDataURL(file); // อ่านไฟล์เป็น URL
  //   }
  // };

  // ✅ Compute selected times
  const selectedTimes =
    Object.keys(selectedCheckboxes)
      .filter((field) => selectedCheckboxes[field])
      .map((field) => {
        const openTime =
          data[selectedBuilding]?.[field]?.open || "Unknown Open Time";
        const closeTime =
          data[selectedBuilding]?.[field]?.close || "Unknown Close Time";
        return `${openTime} - ${closeTime}`; // Format as "Open - Close"
      })
      .join(", ") || "No time selected";

  // ✅ Compute total price
  const totalPrice = Object.keys(selectedCheckboxes)
    .filter((field) => selectedCheckboxes[field])
    .reduce(
      (total, field) =>
        total + (parseFloat(data[selectedBuilding]?.[field]?.Price) || 0),
      0
    );

  // ✅ Clear only checkboxes (keep date & building selection)
  const handleClear = () => {
    setSelectedCheckboxes({}); // Clears all checkboxes but keeps other selections
  };
  const handleConfirm = async () => {
    console.log("handleConfirm ถูกเรียกแล้ว ✅");
    console.log("selectedCourts:", selectedCourts); // ตรวจสอบค่าที่เลือก
    // ทำสิ่งที่ต้องการ เช่น บันทึกข้อมูลการจอง
    console.log("ยืนยันการจองสำเร็จ");

    // ปิด Popup
    setShowPopup(false);

    // เปิด Popup QR Code (ถ้าต้องการ)
    setShowQRPopup(true);
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
          backgroundImage: "url('/assets/archer/archer.png')",
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
            value={selectedDate}
            onChange={(e) => {
              console.log("📅 Date Selected:", e.target.value);
              setSelectedDatePaid(e.target.value);
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
                  <td className="p-2">
                    {details.open},{details.close}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Popup Button */}
      <div className="popup-container text-center mt-5">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md"
          onClick={showfirstPopup}
        >
          Booking
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md"
        >
          Clear
        </button>
      </div>

      {/* Popup for Booking Details */}
      {/* แก้ตรงนี้ เพิ่มคูปอง*/}
      {(showPopup || showQRPopup || showImagePopup) && (
        <div className="modal-overlay"></div>
      )}
      <Popup open={showPopup} modal nested onClose={() => setShowPopup(false)}>
        <div className="modal">
          <div className="header">รายละเอียดการจอง</div>
          <div className="content">
            <div className="booking-details">
            <p>
                <span>Type:</span> <span>archer</span>
              </p>
              <p>
                <span>สถานที่:</span> <span>{name || "กรุณาเลือกสถานที่"}</span>
              </p>
              <p>
                <span>วันที่:</span>{" "}
                <span>{selectedDatePaid || "กรุณาเลือกวันที่"}</span>
              </p>
              <p>
                <span>เวลา:</span>
                <span>{selectedTimes}</span>
              </p>
              <p>
                <span>ราคารวม:</span>
                <span>฿{totalPrice.toFixed(2)}</span>
              </p>

              <div className="container">
                <h1>คูปอง</h1>
                <div className="coupon-select-box">
                
                  <button
                    className="coupon-button"
                    onClick={() => setShowCoupons(true)}
                    disabled={!canUseCoupon}
                    style={{
                      cursor: canUseCoupon ? "pointer" : "not-allowed",
                    }}
                  >
                    🎫 เลือกคูปอง
                  </button>
                
                </div>
                <div className="summary-box">
                  {discountedPrice !== null ? (
                    <div className="discount-box">
                      <h2>รวมทั้งสิ้น : {discountedPrice} บาท</h2>
                      <button
                        className="cancel-btn"
                        onClick={() => setDiscountedPrice(null)}
                      >
                        ❌ ยกเลิกคูปอง
                      </button>
                    </div>
                  ) : (
                    <div className="discount-box">
                      <p>🔹 ยังไม่มีการใช้คูปอง</p>
                      <button
                        className="cancel-btn"
                        onClick={() => setDiscountedPrice(null)}
                        disabled
                      >
                        ❌ ยกเลิกคูปอง
                      </button>
                    </div>
                  )}
                </div>
                {showCoupons && !selectedCoupon && (
                  <CouponList
                    promotions={promotions}
                    onSelect={(coupon) => {
                      setSelectedCoupon(coupon);
                      setShowCoupons(false);
                    }}
                    onClose={() => setShowCoupons(false)}
                  />
                )}
                {selectedCoupon && (
                  <CouponDetail
                    selectedCoupon={selectedCoupon}
                    onClose={() => {
                      setSelectedCoupon(null);
                      setShowCoupons(true);
                    }}
                    price={totalPrice.toFixed(2)}
                    onApply={(newPrice) => {
                      setDiscountedPrice(newPrice); // ✅ อัปเดตราคาใหม่หลังใช้คูปอง
                      setSelectedCoupon(null);
                      setShowCoupons(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="confirm-button" onClick={handleConfirm}>
              ยืนยัน
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowPopup(false)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Popup>
      {/* ถึงตรงนี้ */}

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
            <div style={{ position: "relative" }}>
              <img
                src="/myqr.png"
                alt="QR Code"
                className="qr-image"
                style={{ width: "250px", height: "250px" }}
              />
              {/* ข้อความที่แสดง */}
              <p className="qr-description">
                Arena Pattaya co.ltd
                <span>
                  ฿
                  {discountedPrice !== null
                    ? discountedPrice.toFixed(2)
                    : totalPrice.toFixed(2)}
                </span>
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
      <Popup
        open={showImagePopup}
        modal
        nested
        onClose={() => setShowImagePopup(false)}
      >
        <div className="modal">
          <div className="header">แนบหลักฐานการชำระเงิน</div>
          <div className="content">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 m-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 mt-2 rounded-lg"
              />
            )}
            {uploadedImage && (
              <div className="uploaded-image-container">
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
            <button className="confirm-button" onClick={handleConfirmBooking}>
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
      <div className="flex justify-center gap-4 mt-5"></div>
    </div>
  );
};

export default ArcherBooking;
