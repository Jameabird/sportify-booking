"use client";
import React from "react";
import { useRouter } from "next/navigation";
import TopBar_User from "@components/Topbar_User";

const bookings = [
  {
    id: 1,
    image: "/badminton.jpg",
    location: "Building 3 สนาม 1",
    date: "01/20/2025",
    time: "18.00 - 20.00 น."
  },
  {
    id: 2,
    image: "/swimming.jpg",
    location: "Building 2 สระ 1",
    date: "01/18/2025",
    time: "18.00 - 20.00 น."
  },
  {
    id: 3,
    image: "/golf.jpg",
    location: "Building 4 1 คน",
    date: "01/19/2025",
    time: "13.00 - 14.00 น."
  }
];

const BookingList = () => {
  const router = useRouter();

  const handleCancel = (id) => {
    console.log(`Booking ${id} cancelled`);
  };

  return (
    <div>
      <TopBar_User textColor="black" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={booking.image}
                alt="Sport field"
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="mt-2">
                <p className="text-blue-600 font-bold">Location</p>
                <p>{booking.location}</p>
                <p className="text-blue-600 font-bold mt-2">Date</p>
                <p>{booking.date}</p>
                <p className="text-blue-600 font-bold mt-2">Time</p>
                <p>{booking.time}</p>
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="mt-4 bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-700"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingList;