"use client";
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './popup.css';

export default function PopupBooking() {
    const [isClient, setIsClient] = useState(false);
    const [showQRPopup, setShowQRPopup] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);  // เพิ่มการประกาศ showImagePopup
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที (เวลาเป็นวินาที)
    const [uploadedImage, setUploadedImage] = useState(null); // สำหรับจัดการการอัปโหลดรูปภาพ

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000); // ลดเวลาทุก 1 วินาที

        return () => clearInterval(timer); // คอยลบ interval เมื่อ component หยุดทำงาน
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleConfirm = () => {
        setShowQRPopup(true); // เปิด Popup แสดง QR Code
    };

    const handleImagePopup = () => {
        setShowQRPopup(false);
        setShowImagePopup(true);
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

    if (!isClient) return null;

    return (
        <div className="popup-container">
            <Popup
                trigger={<button className="trigger-button">จอง</button>}
                modal
                nested
            >
                {close => (
                    <div className="modal">
                        <div className="header">รายละเอียดการจอง</div>
                        <div className="content">
                            <div className="booking-details">
                                <p><span>สถานที่:</span><span>Arena Pattaya</span></p>
                                <p><span>วันที่:</span><span>xx/xx/xx</span></p>
                                <p><span>เวลา:</span><span>xx : xx - xx : xx</span></p>
                                <p><span>ราคารวม:</span><span>฿360.00</span></p>
                            </div>
                        </div>
                        <div className="actions">
                            <button
                                className="confirm-button"
                                onClick={() => {
                                    handleConfirm();
                                    close(); // ปิด Popup แรก
                                }}
                            >
                                ยืนยัน
                            </button>
                            <button className="cancel-button" onClick={close}>
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                )}
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
                                Arena Pattaya co.ltd<br />฿360.00
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
            {/* Dropdown สำหรับวัน */}
            <select
              id="day"
              className="date-select"
              defaultValue=""
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="" disabled>
                วัน
              </option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {/* Dropdown สำหรับเดือน */}
            <select
              id="month"
              className="date-select"
              defaultValue=""
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="" disabled>
                เดือน
              </option>
              {[
                "มกราคม",
                "กุมภาพันธ์",
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม",
              ].map((month, i) => (
                <option key={i + 1} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            {/* Dropdown สำหรับปี */}
            <select
              id="year"
              className="date-select"
              defaultValue=""
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="" disabled>
                ปี
              </option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
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
            <label htmlFor="time" style={{ marginRight: "10px" }}>
              เวลา:
            </label>
            <input
              type="time"
              id="time"
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
        onClick={() => setShowImagePopup(false)}
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

        </div>
    );
}
