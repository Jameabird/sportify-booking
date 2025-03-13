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
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/bookings`);

        // Filter only bookings where status is "refunded"
        const refundedBookings = response.data
          .filter((booking) => booking.status === "reserve") // Only keep refunded bookings
          .map((booking) => ({
            _id: booking._id,
            name: booking.name,
            image: `/assets/${booking.type}/${booking.type}.png`,
            location: `${booking.building} ${booking.location}`,
            day: booking.day,
            time: booking.time,
            status: booking.status,
            price: booking.price,
            type: booking.type,
            datepaid: booking.datepaid,
            timepaid: booking.timepaid,
          }));

        setBookings(refundedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  });

  const handleCancel = async (booking) => {
  try {
    const updateResponse = await axios.put(
      `http://localhost:5002/api/bookings/${booking._id}`,
      { status: "refund" }
    );
    console.log("✅ Status updated to 'refund'");
    if (updateResponse.status === 200) {     
      alert("✅ ทำการยกเลิกเสร็จสิ้นรอระบบคืนเงิน");
    } else {
      console.error("❌ Failed to update status");
    }
  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
   
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
              <div
                key={booking._id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <img
                  src={booking.image}
                  alt="Sport field"
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-2">
                  <p>
                    <strong>Type: </strong>
                    {booking.type}
                  </p>
                  <p>
                    <strong>Location: </strong>
                    {booking.location}
                  </p>
                  <p>
                    <strong>Date: </strong>
                    {booking.day}
                  </p>
                  <p>
                    <strong>Time: </strong>
                    {booking.time}
                  </p>
                  <p>
                    <strong>Price: </strong>
                    {booking.price}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    {booking.status}
                  </p>

                  <button
                    onClick={() => handleCancel(booking)}
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
