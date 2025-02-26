"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "./CssHistory.css";

const TopBar_User = dynamic(() => import("@components/Topbar_User"), {
  ssr: false,
});

const HistoryPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [usershistory, setUsersHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData ? tokenData.token : null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      console.log("❌ Token is missing or expired.");
      setError("Token is missing or expired. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("✅ Token is valid:", token);
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ User data received:", res.data);
        setUsersHistory(res.data);
      } catch (error) {
        console.error("🚨 Error fetching user data:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const bookingCounts = usershistory.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const totalBookings = usershistory.length;

  return (
    <>
      <TopBar_User textColor={"black"} />
      <div className="background-page">
        <div className="booking-header">
          <div></div>
          <div className="button-container">
            <button className="booked-button" onClick={() => setShowDetails(!showDetails)}>
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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            usershistory.map((item) => (
              <div key={item._id} className="booking-card">
                <img src={item.image} className="booking-image" />
                <div className="booking-info">
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Date:</strong> {item.day}</p>
                  <p><strong>Time:</strong> {item.time}</p>
                  <p><strong>Price:</strong> {item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
