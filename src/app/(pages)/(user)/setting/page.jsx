"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Avatar, TextField, Button, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TopBar_User from "../../components/Topbar_User";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import './profile.css';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // เพิ่ม state สำหรับควบคุมการแสดงผลรหัสผ่าน
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    const token = tokenData ? tokenData.token : null;
  
    if (!token || Date.now() > tokenData?.expirationTime) {
      console.log("Token is missing or expired.");
      setError("Token is missing or expired. Please log in again.");
      setLoading(false);
      return; // ถ้า token หายไปหรือหมดอายุ จะไม่ดำเนินการต่อ
    } else {
      console.log("Token is valid:", token);
  
      const fetchUserData = async () => {
        setLoading(true); // เริ่มโหลดข้อมูล
        try {
          const res = await axios.get("http://localhost:5000/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`, // ใช้ token ที่ได้จาก localStorage
            },
          });
  
          setProfileData(res.data); // Set profile data เมื่อดึงข้อมูลสำเร็จ
        } catch (error) {
          console.error("Error fetching user data:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to load profile");
        } finally {
          setLoading(false); // ปิดการโหลดข้อมูลเมื่อเสร็จ
        }
      };
  
      fetchUserData(); // เรียกฟังก์ชันดึงข้อมูล
    }
  }, []); // ขึ้นอยู่กับค่าที่เก็บใน localStorage
  
  if (loading) return <p>Loading...</p>; // หากกำลังโหลดข้อมูล
  if (error) return <p>{error}</p>; // แสดง error message หากเกิดข้อผิดพลาด
  if (!profileData) return <p>Error loading profile</p>; // หากไม่มีข้อมูลผู้ใช้    

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw" className="box-container">
      {/* Background Box */}
      <Box className="background-box" />
      <TopBar_User /> {/* Fixed top bar */}
      {/* Profile Section */}
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} width="100%" className="profile-section">
        <Box className="profile-box">
          {!isChangingPassword ? (
            <>
              <Box position="relative" textAlign="center" mb={2}>
                <Avatar
                  src={profileImage}
                  alt="Profile Picture"
                  className="avatar-style"
                />
                {isEditing && (
                  <IconButton
                    color="primary"
                    className="avatar-edit-button"
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
              <Typography variant="h6" className="profile-title">
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
                  className="text-field"
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={profileData.email}
                  disabled={true}
                  className="text-field"
                />
                <TextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className="text-field"
                />

                {/* Bank Information Section */}
                <Typography variant="h8" className="bank-info-title">
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
                    className="text-field"
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="text-field"
                  />
                </Box>
                <TextField
                  label="Bank Account"
                  name="bankAccount"
                  fullWidth
                  value={profileData.bankAccount}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className="text-field"
                />
                <FormControl fullWidth variant="outlined" className="select-control">
                  <InputLabel className="select-label">Bank Name</InputLabel>
                  <Select
                    name="bankName"
                    value={profileData.bankName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    label="Bank Name"
                    className="select-field"
                  >
                    <MenuItem value="SCB">SCB</MenuItem>
                    <MenuItem value="KBANK">KBANK</MenuItem>
                    <MenuItem value="BAY">BAY</MenuItem>
                    <MenuItem value="BKK">BKK</MenuItem>
                  </Select>
                </FormControl>

                {/* Bank Account Image (Always visible, allows upload even in view mode) */}
                <Typography variant="body1" className="bank-image-title">
                  Bank Account Image
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" position="relative" textAlign="center" mb={2}>
                  {profileData.bankAccountImage ? (
                    <Avatar
                      src={profileData.bankAccountImage}
                      alt="Bank Account"
                      className="bank-account-image"
                    />
                  ) : (
                    <Box className="no-image-box">
                      <Typography variant="body2" className="no-image-text">No Image</Typography>
                    </Box>
                  )}
                  {isEditing && (
                    <IconButton
                      color="primary"
                      className="image-edit-button"
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
                      <Button
                        variant="contained"
                        onClick={handleSaveClick}
                        className="save-button"
                      >
                        Save
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        className="cancel-button"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleChangePasswordClick}
                        className="change-password-button"
                      >
                        Change Password
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        className="edit-button"
                        onClick={handleEditClick}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box width="100%" display="flex" flexDirection="column" gap={2} className="change-password-section">
                <Typography variant="h6" className="change-password-title">
                  Change Password
                </Typography>

                <TextField
                  label="Old Password"
                  type={showOldPassword ? "text" : "password"}
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="password-field"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                          {showOldPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-field"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="password-field"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && <Typography color="error" className="error-message">{error}</Typography>}

                {/* Change Password Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleChangePassword}
                  className="change-password-button"
                >
                  Change Password
                </Button>

                {/* Back to Setting Button */}
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  className="back-button"
                  onClick={() => setIsChangingPassword(false)}
                >
                  Back to setting
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Dialog for success/error */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        className="dialog-box"
      >
        {/* Dialog Title */}
        <DialogTitle className="dialog-title">
          {dialogSeverity === "success" ? (
            <span className="success-icon">✔</span>
          ) : (
            <span className="error-icon">❌</span>
          )}
          {dialogSeverity === "success" ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="body1" className="dialog-message">
            {dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={handleCloseDialog}
            className="dialog-button"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
