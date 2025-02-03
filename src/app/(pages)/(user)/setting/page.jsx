"use client";
import React, { useState } from "react";
import { Box, Avatar, TextField, Button, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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
    bankAccountImage: null,
  });

  const [originalProfileData, setOriginalProfileData] = useState({ ...profileData });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // เพิ่ม severity สำหรับแสดงใน Snackbar
  const [openDialog, setOpenDialog] = useState(false);
  const handleChangePasswordClick = () => setIsChangingPassword(true);
  const [dialogMessage, setDialogMessage] = useState("");  // เพิ่ม state สำหรับข้อความใน Dialog
  const [dialogSeverity, setDialogSeverity] = useState("success");  // เพิ่ม state สำหรับระดับของข้อความ (success หรือ error)

  const handleSaveClick = () => {
    if (!profileData.name || !profileData.phone || !profileData.firstName || !profileData.lastName || !profileData.bankAccount) {
      setDialogMessage("Please fill out all required fields.");
      setDialogSeverity("error");  // ใช้ "error" หากมีข้อผิดพลาด
      setOpenDialog(true);
      return;
    }

    setIsEditing(false);
    setDialogMessage("Changes saved successfully!");
    setDialogSeverity("success");  // ใช้ "success" เมื่อบันทึกสำเร็จ
    setOpenDialog(true);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setDialogMessage("Passwords do not match.");
      setDialogSeverity("error");  // ใช้ "error" หากรหัสผ่านไม่ตรงกัน
      setOpenDialog(true);
      return;
    }

    if (newPassword.length >= 6) {
      setDialogMessage("Password changed successfully!");
      setDialogSeverity("success");  // ใช้ "success" เมื่อเปลี่ยนรหัสผ่านสำเร็จ
      setOpenDialog(true);
    } else {
      setDialogMessage("New password is too short.");
      setDialogSeverity("error");  // ใช้ "error" หากรหัสผ่านสั้นเกินไป
      setOpenDialog(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEditClick = () => {
    setOriginalProfileData(profileData); // เก็บค่าเดิมไว้
    setIsEditing(true);
  };

  // Handle Dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCancelClick = () => {
    setProfileData(originalProfileData);
    setIsEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับปิด Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
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

                {/* Bank Account Image (Always visible, allows upload even in view mode) */}
                <Typography variant="body1" sx={{ marginTop: "20px" }}>
                  Bank Account Image
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" position="relative" textAlign="center" mb={2}>
                  {profileData.bankAccountImage ? (
                    <Avatar
                      src={profileData.bankAccountImage}
                      alt="Bank Account"
                      sx={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "8px",
                        border: "2px solid #ddd",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />

                  ) : (
                    <Box
                      sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        backgroundColor: "#f4f4f4",
                        border: "2px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#888" }}>No Image</Typography>
                    </Box>
                  )}
                  {isEditing && (
                    <IconButton
                      color="primary"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: "calc(50% - 20px)",
                        backgroundColor: "#fff",
                        boxShadow: 1,
                        border: "1px solid #ddd",
                      }}
                      onClick={() => document.getElementById("bank-account-image-input").click()}
                    >
                      <CameraAltIcon />
                    </IconButton>
                  )}
                  <input
                    id="bank-account-image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleBankAccountImageChange}
                  />
                </Box>

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

                {/* Change Password Button */}
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ fontSize: "13px" }}
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>

                {/* Back to Setting Button */}
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ marginTop: "10px", fontSize: "13px" }}
                  onClick={() => setIsChangingPassword(false)}
                >
                  Back to setting
                </Button>
              </Box>
            </>

          )}
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px', // Add rounded corners
            padding: '20px',
            maxWidth: '400px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: dialogSeverity === "success" ? '#4caf50' : '#f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {dialogSeverity === "success" ? (
            <span style={{ color: '#4caf50' }}>✔</span>
          ) : (
            <span style={{ color: '#f44336' }}>❌</span>
          )}
          {dialogSeverity === "success" ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', paddingBottom: '20px' }}>
          <Typography variant="body1" sx={{ fontSize: '16px', color: '#333' }}>
            {dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingTop: '10px' }}>
          <Button
            onClick={handleCloseDialog}
            color={dialogSeverity === "success" ? "success" : "error"}
            variant="contained"
            sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '8px 20px',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
