"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Button, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
  const [openDialog, setOpenDialog] = useState(false);
  const handleChangePasswordClick = () => setIsChangingPassword(true);
  const [dialogMessage, setDialogMessage] = useState("");  // เพิ่ม state สำหรับข้อความใน Dialog
  const [dialogSeverity, setDialogSeverity] = useState("success");  // เพิ่ม state สำหรับระดับของข้อความ (success หรือ error)

  // เพิ่ม state สำหรับควบคุมการแสดงผลรหัสผ่าน
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveClick = async () => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData ? tokenData.token : null;

    const updatedData = {};
    ["username", "phoneNumber", "firstName", "lastName", "accountNumber", "bank"].forEach((field) => {
      if (profileData[field] !== undefined) { // ✅ ส่งค่าที่เป็น "" ไปด้วย
        updatedData[field] = profileData[field];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      setDialogMessage("No changes detected.");
      setDialogSeverity("error");
      setOpenDialog(true);
      return;
    }

    try {
      await axios.put("http://localhost:5011/api/users/me", updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setDialogMessage("Changes saved successfully!");
      setDialogSeverity("success");
      setOpenDialog(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setDialogMessage(error.response?.data?.message || "Failed to update profile.");
      setDialogSeverity("error");
      setOpenDialog(true);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setDialogMessage("Please fill in all fields.");
      setDialogSeverity("error");
      setOpenDialog(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setDialogMessage("Passwords do not match.");
      setDialogSeverity("error");
      setOpenDialog(true);
      return;
    }

    // ✅ ดึง token จาก localStorage
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData ? tokenData.token : null;

    if (!token) {
      setDialogMessage("Authentication failed. Please log in again.");
      setDialogSeverity("error");
      setOpenDialog(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5011/api/users/me/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ ส่ง token เพื่อ auth
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setDialogMessage("Password changed successfully!");
      setDialogSeverity("success");
      setOpenDialog(true);

      // ✅ ล้างฟอร์มหลังจากเปลี่ยนรหัสผ่านสำเร็จ
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setDialogMessage(error.message);
      setDialogSeverity("error");
      setOpenDialog(true);
    }
  };

  const handleEditClick = () => {
    setOriginalProfileData(profileData); // เก็บค่าเดิมไว้
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setProfileData(originalProfileData);
    setIsEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`Changing ${name} to`, value);

    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  // ฟังก์ชันสำหรับปิด Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData ? tokenData.token : null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      console.log("❌ Token is missing or expired.");
      setError("Token is missing or expired. Please log in again.");
      setLoading(false);
      return;
    } else {
      console.log("✅ Token is valid:", token);

      const fetchUserData = async () => {
        setLoading(true);
        try {
          const res = await axios.get("http://localhost:5011/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("✅ User data received:", res.data);
          setProfileData(res.data);
        } catch (error) {
          console.error("🚨 Error fetching user data:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
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
              <Typography variant="h6" className="profile-title">
                {isEditing ? "Edit Profile" : "Profile"}
              </Typography>
  
              <Box width="100%" display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Name"
                  name="username"
                  fullWidth
                  value={profileData.username}
                  disabled={true}
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
                  name="phoneNumber"
                  fullWidth
                  value={profileData.phoneNumber}
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
                  name="accountNumber"
                  fullWidth
                  value={profileData.accountNumber}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className="text-field"
                />
                <FormControl fullWidth variant="outlined" className="select-control">
                  <InputLabel className="select-label">Bank Name</InputLabel>
                  <Select
                    name="bank"
                    value={profileData.bank}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    label="Bank Name"
                    className="select-field"
                  >
                    <MenuItem value="PromptPay"> PromptPay </MenuItem>
                    <MenuItem value="BAAC">เพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)</MenuItem>
                    <MenuItem value="SCB">ไทยพาณิชย์ (SCB)</MenuItem>
                    <MenuItem value="KBank">กสิกรไทย (KBank)</MenuItem>
                    <MenuItem value="Krungthai">กรุงไทย (Krungthai)</MenuItem>
                    <MenuItem value="TTB">ทีทีบี (TTB)</MenuItem>
                    <MenuItem value="BBL">กรุงเทพ (BBL)</MenuItem>
                    <MenuItem value="Krungsri">กรุงศรีอยุธยา (Krungsri)</MenuItem>
                    <MenuItem value="Thanachart">ธนชาต (Thanachart)</MenuItem>
                  </Select>
                </FormControl>
  
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
