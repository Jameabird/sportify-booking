"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "./CssHistory.css";
import { usershistory } from "@app/(pages)/(user)/history/history";

const TopBar_User = dynamic(() => import("@components/Topbar_User"), {
  ssr: false,
});

const HistoryPage = () => {
  const [showDetails, setShowDetails] = useState(false);

  // นับจำนวนประเภทที่จอง
  const bookingCounts = usershistory.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  // หาจำนวนครั้งที่จองทั้งหมด
  const totalBookings = usershistory.length;

  return (
    <>
      <TopBar_User textColor={"black"} />
      <div className="background-page">
        <div className="booking-header">
          <div></div>
          <div className="button-container">
            <button 
              className="booked-button" 
              onClick={() => setShowDetails(!showDetails)}
            >
              จองแล้ว {totalBookings} ครั้ง
            </button>
            {showDetails && (
              <div className="booking-details">
                {Object.entries(bookingCounts).map(([type, count]) => (
                  <div key={type} className="detail-item">
                    {type} {count} ครั้ง
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="booking-container">
          {usershistory.map((item) => (
            <div key={item.id} className="booking-card">
              <img
                src={item.imag}               
                className="booking-image"
              />
              <div className="booking-info">
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Date:</strong> {item.day}</p>
                <p><strong>Time:</strong> {item.time}</p>
                <p><strong>Price:</strong> {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default HistoryPage;
