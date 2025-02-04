"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./CssHistory.css";

const TopBar_User = dynamic(() => import("@components/Topbar_User"), {
  ssr: false,
});

const history_page = () => {
  return (
    <>
      <TopBar_User textColor={"black"} />
      <div className="background-page">
        <div className="booking-header">
          <div></div>
          <button className="booked-button">จองแล้ว 3 ครั้ง</button>
        </div>
        <div className="booking-container">
          <div className="booking-card">
            <img src="/images/badminton.jpg" alt="badminton" className="booking-image" />
            <div className="booking-info">
              <p><strong>Location:</strong> Building 3 สนาม 1</p>
              <p><strong>Date:</strong> 01/20/2025</p>
              <p><strong>Time:</strong> 18.00 - 20.00 น.</p>
            </div>
          </div>
          <div className="booking-card">
            <img src="/images/swimming.jpg" alt="swimming" className="booking-image" />
            <div className="booking-info">
              <p><strong>Location:</strong> Building 2 สระ 1</p>
              <p><strong>Date:</strong> 01/18/2025</p>
              <p><strong>Time:</strong> 18.00 - 20.00 น.</p>
            </div>
          </div>
          <div className="booking-card">
            <img src="/images/golf.jpg" alt="golf" className="booking-image" />
            <div className="booking-info">
              <p><strong>Location:</strong> Building 4 1 คน</p>
              <p><strong>Date:</strong> 01/19/2025</p>
              <p><strong>Time:</strong> 13.00 - 14.00 น.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default history_page;