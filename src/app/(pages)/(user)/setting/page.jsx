"use client";
import React, { useState } from "react";
import { Box, Avatar, TextField, Button, IconButton, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TopBar_User from "../../components/Topbar_User";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Jennie Lee",
    email: "SE@gmail.com",
    phone: "0123456789",
    firstName: "Jennie",
    lastName: "Lee",
    bankAccount: "1234567890",
    bankName: "SCB",
    bankAccountImage: null, // State to store bank account image
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    setIsEditing(false);
    alert("Changes saved successfully!");
  };
  const handleCancelClick = () => setIsEditing(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePasswordClick = () => setIsChangingPassword(true);

  const handleChangePassword = () => {
    if (oldPassword !== "currentPassword") {
      setError("Old password is incorrect!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    alert("Password changed successfully!");
    setIsChangingPassword(false);
  };

  // Function to handle the profile image change
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle the bank account image change
  const handleBankAccountImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevState) => ({
          ...prevState,
          bankAccountImage: reader.result, // Store the uploaded image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw" sx={{ backgroundColor: "#f4f4f4", position: "relative" }}>
      {/* Background Box */}
      <Box sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#f4f4f4",
        zIndex: -1, // Keeps the background below the profile section
      }} />
      
      <TopBar_User /> {/* Fixed top bar */}

      {/* Profile Section */}
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} width="100%" sx={{ paddingTop: "50px" }}> {/* Adjust paddingTop to prevent overlap */}
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" maxWidth="400px" sx={{ backgroundColor: "#fff", borderRadius: "8px", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          {!isChangingPassword ? (
            <>
              <Box position="relative" textAlign="center" mb={2}>
                <Avatar src={profileImage} alt="Profile Picture" sx={{ width: "100px", height: "100px", border: "2px solid #ddd", margin: "0 auto" }} />
                {isEditing && (
                  <IconButton
                    color="primary"
                    sx={{ position: "absolute", bottom: 0, right: "calc(50% - 20px)", backgroundColor: "#fff", boxShadow: 1, border: "1px solid #ddd" }}
                    onClick={() => document.getElementById("profile-image-input").click()}
                  >
                    <CameraAltIcon />
                  </IconButton>
                )}
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfileImageChange}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
                {isEditing ? "Edit Profile" : "Profile"}
              </Typography>

              <Box width="100%" display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={profileData.name}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={profileData.email}
                  disabled={true}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                />
                
                {/* Bank Information Section */}
                <Typography variant="h8" sx={{ fontWeight: "bold", marginTop: "px" }}>
                  Bank Information
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </Box>
                <TextField
                  label="Bank Account"
                  name="bankAccount"
                  fullWidth
                  value={profileData.bankAccount}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                />
                <FormControl fullWidth variant="outlined" sx={{ fontSize: "14px", marginTop: "8px" }}>
                  <InputLabel sx={{ fontSize: "14px" }}>Bank Name</InputLabel>
                  <Select
                    name="bankName"
                    value={profileData.bankName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    label="Bank Name"
                  >
                    <MenuItem value="SCB">SCB</MenuItem>
                    <MenuItem value="KBANK">KBANK</MenuItem>
                    <MenuItem value="BAY">BAY</MenuItem>
                    <MenuItem value="BKK">BKK</MenuItem>
                  </Select>
                </FormControl>

                {/* Bank Account Image Upload */}
                <Typography variant="body1" sx={{ marginTop: "20px" }}>
                  Upload Bank Account Image
                </Typography>
                {profileData.bankAccountImage && (
                  <Box textAlign="center" sx={{ marginBottom: "10px" }}>
                    <img
                      src={profileData.bankAccountImage}
                      alt="Bank Account"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                    />
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBankAccountImageChange}
                  disabled={!isEditing}
                  style={{ marginTop: "10px" }}
                />

                <Box display="flex" justifyContent="space-between" mt={2}>
                  {isEditing ? (
                    <>
                      <Button variant="contained" color="success" sx={{ width: "48%", fontSize: "13px" }} onClick={handleSaveClick}>
                        Save
                      </Button>
                      <Button variant="contained" color="error" sx={{ width: "48%", fontSize: "13px" }} onClick={handleCancelClick}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="contained" color="success" sx={{ width: "48%", fontSize: "13px" }} onClick={handleChangePasswordClick}>
                        Change Password
                      </Button>
                      <Button variant="contained" color="error" sx={{ width: "48%", fontSize: "13px" }} onClick={handleEditClick}>
                        Edit
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
                Change Password
              </Typography>
              <Box width="100%" display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Old Password"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  sx={{ marginBottom: "20px" }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ marginBottom: "20px" }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ marginBottom: "20px" }}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" color="success" fullWidth sx={{ fontSize: "13px" }} onClick={handleChangePassword}>
                  Change Password
                </Button>
                <Button variant="contained" color="error" fullWidth sx={{ marginTop: "10px", fontSize: "13px" }} onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
