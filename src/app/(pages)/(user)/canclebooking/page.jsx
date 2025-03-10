"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TopBar_User from "@components/Topbar_User";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก Local Storage หรือ API (กรณีใช้ JWT หรือ Session)
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return; // ถ้ายังไม่มีข้อมูลผู้ใช้ ให้รอ

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/bookings?userId=${user._id}`);
        const formattedData = response.data.map((booking) => ({
          _id: booking._id,
          image: `/assets/${booking.type}/${booking.type}.jpg`,
          location: `${booking.building} ${booking.location}`,
          day: booking.day,
          time: booking.time,
        }));
        setBookings(formattedData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancel = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5002/api/bookings/${id}`);
      if (response.status === 200) {
        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== id));
      } else {
        console.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div>
      <TopBar_User textColor="black" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow-md rounded-lg p-4">
                <img
                  src={booking.image}
                  alt="Sport field"
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-2">
                  <p className="text-blue-600 font-bold">Location</p>
                  <p>{booking.location}</p>
                  <p className="text-blue-600 font-bold mt-2">Date</p>
                  <p>{booking.day}</p>
                  <p className="text-blue-600 font-bold mt-2">Time</p>
                  <p>{booking.time}</p>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="mt-4 bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-700"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default BookingList;
