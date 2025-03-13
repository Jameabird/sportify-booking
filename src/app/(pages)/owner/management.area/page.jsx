"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import TopBar_Owner from "@components/Topbar_Owner";
import "@app/globals.css";
import axios from "axios";
import {provinces, types} from "./mockdata";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";


export default function AddNewPlace() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState(""); // ✅ จังหวัด stored here
  const [buildings, setBuildings] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState("");
  const [userid, setUserID] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  // ✅ List of Thai provinces (can be modified)

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token")); // Parse stored JSON
    const token = tokenData?.token; // Extract token
  
    if (!token) {
      console.error("❌ No valid token found");
      return;
    }
  
    console.log("Token being sent:", token);
    
    axios
      .get("http://localhost:5000/api/bookings/current", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Correct format
        },
      })
      .then((response) => {
        console.log("✅ Current User Data:", response.data);
        
        // ✅ Ensure response is an array and extract the first object
        if (Array.isArray(response.data) && response.data.length > 0) {
          const user = response.data[0]; // Extract first user
          setUsername(user.username); // ✅ Corrected
          setRole(user.role);
          setUserID(user._id) // ✅ Corrected
          console.log("Username:", user.username);
          console.log("Role:", user.role);
          console.log("id:", user._id);
        } else {
          console.error("❌ No user data received");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching current user:", error.response?.data || error);
      });
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const options = {
        maxSizeMB: 5, // Limit file size to 1MB
        maxWidthOrHeight: 800, // Resize if needed
        initialQuality: 0.8,
        useWebWorker: true, // Improve performance
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setUploadedImage(reader.result); // ✅ Store compressed base64 image
          setPreview(reader.result); // ✅ Show preview
        };
      } catch (error) {
        console.error("❌ Error compressing image:", error);
      }
    }
  };

  const handleSave = async () => {
    if (!name || !location || !link || !uploadedImage) {
      console.log(!name, !location, !link, !uploadedImage);
      alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
  
    const defaultBuildingData = {
      "Building1": {
        "Field1": { "Price": "250", "Booking": false, "close": "16:00", "open": "15:00" },
        "Field2": { "Price": "300", "Booking": true, "close": "17:00", "open": "16:00" },
        "Field3": { "Price": "350", "Booking": true, "close": "18:00", "open": "17:00" },
        "Field4": { "Price": "300", "Booking": false, "close": "19:00", "open": "18:00" },
        "Field5": { "Price": "315", "Booking": true, "close": "20:00", "open": "19:00" }
      },
      "Building2": {
        "Field1": { "Price": "150", "Booking": false, "close": "16:00", "open": "15:00" },
        "Field2": { "Price": "150", "Booking": false, "close": "17:00", "open": "16:00" },
        "Field3": { "Price": "150", "Booking": false, "close": "18:00", "open": "17:00" },
        "Field4": { "Price": "150", "Booking": false, "close": "19:00", "open": "18:00" },
        "Field5": { "Price": "150", "Booking": false, "close": "20:00", "open": "19:00" }
      }
    };
  
    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("username", username);
    formData.append("Type", type);
    formData.append("name", name);
    formData.append("location", location);
    formData.append("link", link);
    formData.append("details", details);
    formData.append("image", uploadedImage); // File should be appended like this
    formData.append("Building", JSON.stringify(defaultBuildingData)); // Append the Building data as a JSON string
  
    try {
      const response = await fetch("http://localhost:5005/api/buildings", {
        method: "POST",
        body: formData, // No JSON headers when sending FormData
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "เกิดข้อผิดพลาด");
  
      console.log("Data sent to API:", result);
      alert("✅ จองสำเร็จ!");
    } catch (error) {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`);
    }
  };
  
  const handleCancel = () => {
    setName("");
    setLocation("");
    setBuildings("");
    setLink("");
    setDetails("");
    setImage(null);
    setType("");
    router.push("/owner")
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage(URL.createObjectURL(file));
  //   }
  // };

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        <div className="absolute top-0 left-0 h-full w-full bg-cover bg-center" style={{ backgroundColor: "rgba(255, 255, 255, 1)", zIndex: -1 }} />
        <div className="relative h-full w-full">
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <TopBar_Owner textColor={"black"} />
            </div>
          </div>

          <Box sx={{
              maxWidth: "600px",
              margin: "50px auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              padding: "30px",
            }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Add new place
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="150px" border="2px dashed gray" borderRadius="8px" position="relative" overflow="hidden">
                {image ? (
                  <img src={image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Typography variant="h4" color="gray">+</Typography>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
                {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 mt-2 rounded-lg"
              />
            )}
              </Box>

              <TextField label="Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />

              {/* ✅ Dropdown select for จังหวัด (Province) */}
              <FormControl fullWidth variant="outlined">
                <InputLabel>จังหวัด</InputLabel>
                <Select value={location} onChange={(e) => setLocation(e.target.value)} label="จังหวัด">
                  {provinces.map((province, index) => (
                    <MenuItem key={index} value={province}>{province}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel>ประเภทกีฬา</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)} label="ประเภทกีฬา">
                  {types.map((types, index) => (
                    <MenuItem key={index} value={types}>{types}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Details" variant="outlined" fullWidth value={details} onChange={(e) => setDetails(e.target.value)} />
              <TextField label="Google Map" variant="outlined" fullWidth value={link} onChange={(e) => setLink(e.target.value)} />
                  
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
