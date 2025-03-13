"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TopBar_User from "@components/Topbar_User";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [Userid, setUserid] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("token")); // Get JWT Token
        const token = tokenData?.token;
        if (!token) {
          console.error("❌ No valid token found");
          return;
        }
        console.log("Token being sent:", token);
        const response = await axios.get(
          "http://localhost:5000/api/bookings/current",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (Array.isArray(response.data) && response.data.length > 0) {
          const fetchedUser = response.data[0]; // ✅ Store entire user object
          setUserid(fetchedUser._id); // ✅ Now `user` will be available
          console.log("✅ User fetched:", fetchedUser);
        } else {
          console.error("❌ No user data received");
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };
  
    fetchUser();
  }, []);
  

  useEffect(() => {
    if (!Userid) {
      console.log("✅ User ID is OK.");
      return;
    }
  
    const fetchBookings = async () => {
      try {
        console.log("Fetching bookings for User ID:", Userid);
  
        const response = await axios.get(`http://localhost:5002/api/bookings?userId=${Userid}`);
  
        console.log("✅ API Response:", response.data);
  
        if (!Array.isArray(response.data)) {
          console.error("❌ Expected an array but got:", response.data);
          return;
        }
  
        // 🔹 Filter only "reserve" status bookings for the current user
        let bookingData = response.data.filter((booking) => booking.status === "reserve");
  
        // 🔹 If the user has an "archer" booking, apply special formatting
        bookingData = bookingData.map((booking) => ({
          _id: booking._id,
          name: booking.name,
          image: `/assets/${booking.type}/${booking.type}.png`,
          location: `${booking.building} ${booking.location}`,
          day: booking.day,
          time: booking.time,
          status: booking.status,
          price: booking.price,
          datepaid: booking.datepaid,
          timepaid: booking.timepaid,
          type: booking.type,
        }));
  
        setBookings(bookingData); // ✅ Update state with filtered bookings
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
      }
    };
  
    fetchBookings();
  }, [Userid]); // ✅ Runs when `Userid` changes
  
  const handleCancel = async (booking) => {
    try {
      const token = localStorage.getItem("token");

      const updateResponse = await axios.put(
        `http://localhost:5002/api/bookings/${booking._id}`,
        { status: "refund" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateResponse.status === 200) {
        console.log("✅ Booking status updated");

        setBookings((prev) => prev.filter((b) => b._id !== booking._id));
        alert("✅ Booking successfully canceled!");
      } else {
        console.error("❌ Failed to update booking");
      }
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      alert("❌ An error occurred while canceling the booking.");
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
                <img src={booking.image} alt="Sport field" className="w-full h-40 object-cover rounded-md" />
                <div className="mt-2">
                  <p><strong>Type: </strong>{booking.type}</p>
                  <p><strong>Location: </strong>{booking.location}</p>
                  <p><strong>Date: </strong>{booking.day}</p>
                  <p><strong>Time: </strong>{booking.time}</p>
                  <p><strong>Price: </strong>{booking.price}</p>
                  <p><strong>Status: </strong>{booking.status}</p>

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
