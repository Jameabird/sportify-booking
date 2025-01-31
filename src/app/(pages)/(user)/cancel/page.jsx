"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import TopBar from "@components/Topbar";
import "@app/globals.css";
import styles from "./BookingCard.module.css"; // สร้างไฟล์ CSS module

const BookingPage = () => {
  const bookings = [
    {
      id: 1,
      location: "Building 3 สนาม 1",
      date: "01/20/2025",
      time: "18.00 - 20.00 น.",
      //image: "/images/badminton.jpg",
    },
    {
      id: 2,
      location: "Building 2 สระ 1",
      date: "01/18/2025",
      time: "18.00 - 20.00 น.",
      //image: "/images/swimming.jpg",
    },
    {
      id: 3,
      location: "Building 4 1 คน",
      date: "01/19/2025",
      time: "13.00 - 14.00 น.",
      //image: "/images/golf.jpg",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.fullBookingButton}>จองครบ 10 ครั้ง</button>
      </div>
      <div className={styles.cardContainer}>
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.card}>
            <img src={booking.image} alt={booking.location} className={styles.image} />
            <div className={styles.details}>
              <p><strong>Location:</strong> {booking.location}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
            </div>
            <button className={styles.cancelButton}>ยกเลิก</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;