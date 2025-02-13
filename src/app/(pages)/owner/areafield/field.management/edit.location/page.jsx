"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import TopBar_Owner from "@components/Topbar_Owner";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material"; // ✅ ใช้ Material UI Dialog
import "./EditInformation.css";

const EditInformation = () => {
  const router = useRouter();

  const [name, setName] = useState("Base Chonburi");
  const [location, setLocation] = useState("Thug Sukhla Rd, Thung Sukhla, Si Racha, Chonburi, 20230, Thailand");
  const [image, setImage] = useState("/path/to/default-image.jpg");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success"); // success or error

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSave = () => {
    // ✅ จำลองสถานะการบันทึกข้อมูล (จริง ๆ อาจใช้ API)
    const isSuccess = Math.random() > 0.2; // 80% success, 20% error

    if (isSuccess) {
      setDialogSeverity("success");
      setDialogMessage("Information saved successfully!");
    } else {
      setDialogSeverity("error");
      setDialogMessage("Failed to save. Please try again.");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (dialogSeverity === "success") {
      router.push("/owner/areafield/field.management"); // ✅ ถ้าสำเร็จให้เปลี่ยนหน้า
    }
  };

  const handleCancel = () => {
    router.push("/owner/areafield/field.management");
  };

  return (
    <div className="edit-container">
      <TopBar_Owner />

      <div className="edit-content">
        <div className="edit-card">
          <h2 className="edit-title">Edit Information</h2>

          {/* Image Upload */}
          <div className="edit-image-container">
            <img src={image} alt="Gym" className="edit-image" />
            <input type="file" accept="image/*" onChange={handleImageChange} id="fileInput" hidden />
            <label htmlFor="fileInput" className="edit-upload-text">Upload new picture</label>
          </div>

          {/* Name Field */}
          <div className="edit-input-group">
            <label className="edit-label">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="edit-input" />
          </div>

          {/* Location Field */}
          <div className="edit-input-group">
            <label className="edit-label">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="edit-input" />
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="edit-link">
              Search on map
            </a>
          </div>

          {/* Buttons */}
          <div className="edit-button-container">
            <button onClick={handleSave} className="edit-save-button">SAVE</button>
            <button onClick={handleCancel} className="edit-cancel-button">CANCEL</button>
          </div>
        </div>
      </div>

      {/* ✅ Dialog for Success/Error */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "400px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: dialogSeverity === "success" ? "#1e40af" : "#f44336",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {dialogSeverity === "success" ? "✔ Success" : "❌ Error"}
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent sx={{ textAlign: "center", paddingBottom: "20px" }}>
          <Typography variant="body1" sx={{ fontSize: "16px", color: "#333" }}>
            {dialogMessage}
          </Typography>
        </DialogContent>

        {/* Dialog Button */}
        <DialogActions sx={{ justifyContent: "center", paddingTop: "10px" }}>
          <Button
            onClick={handleCloseDialog}
            color={dialogSeverity === "success" ? "primary" : "error"}
            variant="contained"
            sx={{
              backgroundColor: dialogSeverity === "success" ? "#1e40af" : "#d32f2f",
              "&:hover": {
                backgroundColor: dialogSeverity === "success" ? "#162d68" : "#b71c1c",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
              },
              fontSize: "14px",
              fontWeight: "bold",
              padding: "8px 20px",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditInformation;
