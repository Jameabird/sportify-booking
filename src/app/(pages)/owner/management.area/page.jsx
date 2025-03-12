"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import TopBar_Owner from "@components/Topbar_Owner";
import "@app/globals.css";
import axios from "axios";

export default function AddNewPlace() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [buildings, setBuildings] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState("");
  const [type, setType] = useState("");

  const handleSave = async () => {
    console.log("Type ที่บันทึก:", type); // ✅ Debug ค่า Type

    if (!name || !location || !link || !details || !type || !image) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formData = { type, name, location, link, details, image };

    try {
      const response = await axios.post("http://localhost:5005/api/Place", formData);
      alert(response.data.message);
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || "ไม่สามารถบันทึกข้อมูลได้"));
    }
  };

  const handleCancel = () => {
    setName("");
    setLocation("");
    setBuildings("");
    setLink("");
    setType("");
    setDetails("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            zIndex: -1,
          }}
        />

        <div className="relative h-full w-full">
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <TopBar_Owner textColor={"black"} />
            </div>
          </div>

          <Box
            sx={{
              maxWidth: "600px",
              margin: "50px auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              padding: "30px",
            }}
          >
            <Typography variant="h4" textAlign="center" gutterBottom>
              Add new place
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="150px"
                border="2px dashed gray"
                borderRadius="8px"
                position="relative"
                overflow="hidden"
              >
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="h4" color="gray">
                    +
                  </Typography>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </Box>

              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Location (จังหวัด)"
                variant="outlined"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <TextField
                label="Details"
                variant="outlined"
                fullWidth
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <TextField
                label="Google Map"
                variant="outlined"
                fullWidth
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <TextField
                label="Type"
                variant="outlined"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
              />

              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" onClick={handleSave}>
                  SAVE
                </Button>
                <Button variant="contained" color="error" onClick={handleCancel}>
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}
