// src/app/user_setting1/page.jsx (หรือ user_setting1.jsx)
"use client";
import { Box, Button } from "@mui/material";
import Link from "next/link"; // ใช้ Link จาก Next.js
import React, { useState } from "react";

const TopBar = (props) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)"
      }}
    >
      <Box component="div" display="flex">
        <div className="text-3xl font-bold flex pl-10">
          <div style={{ color: props.textColor }}>SPORTIFY</div>
          <div className="pl-2 text-orange-500">BOOKING</div>
        </div>
      </Box>
      <Box display="flex">
        <Link href="/">
          <Box sx={{ padding: "0 10px", cursor: "pointer", "&:hover": { color: "#868dfb" } }}>
            <div className="font-bold text-xl">Home</div>
          </Box>
        </Link>
        <Box sx={{ padding: "0 3px" }}>
          <Link href="/sign-in">
            <Button variant="contained" color="primary">
              Sign In
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default function User2() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form">
      <div className="profile-image-container">
        <img
          src={profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-image"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
      </div>
      <div className="field">
        <div>Name</div>
        <div><input type="text" /></div>
      </div>
      <div className="field">
        <div>Email</div>
        <div><input type="email" /></div>
      </div>
      <div className="field">
        <div>Phone</div>
        <div><input type="tel" /></div>
      </div>
      <div className="field">
        <div>Bank</div>
        <div className="bank-container">
          <input
            type="text"
            className="bank-input"
          />
        </div>
      </div>
      <div className="buttons">
        <button className="Change Password-btn">Change Password</button>
        <button className="Edit-btn">Edit</button>
      </div>
    </div>
  );
}