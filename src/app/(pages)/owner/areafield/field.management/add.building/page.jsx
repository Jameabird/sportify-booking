"use client";  // ระบุว่าเป็น Client Component
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ใช้ 'next/navigation' แทน 'next/router'
import TopBar_Owner from "@components/Topbar_Owner";  // เพิ่มการ import TopBar_Owner
import './AddBuildingForm.css';

function AddBuildingForm() {
  const router = useRouter(); // ใช้ useRouter จาก next/navigation
  const [formData, setFormData] = useState({
    building: '',
    courtsCount: '',
    type: 'residential',
    price: '',
    open: '',
    close: ''
  });
  
  const [errorMessages, setErrorMessages] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSeverity, setDialogSeverity] = useState('success');  // Can be 'success' or 'error'
  
  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Clear specific field errors on change
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Form validation
    let errors = {};
    if (!formData.building) errors.building = 'กรุณากรอกชื่ออาคาร';
    if (!formData.courtsCount) errors.courtsCount = 'กรุณากรอกจำนวนสนาม';
    if (!formData.price) errors.price = 'กรุณากรอกราคา';
    if (!formData.open) errors.open = 'กรุณากรอกเวลาเปิด';
    if (!formData.close) errors.close = 'กรุณากรอกเวลาปิด';
  
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      // Show error dialog instead of alert
      setDialogSeverity("error");
      setDialogMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setOpenDialog(true);
      return;
    } else {
      setErrorMessages({});
    }
  
    // Simulation of successful form submission
    try {
      // Show success dialog instead of alert
      setDialogSeverity("success");
      setDialogMessage('ข้อมูลบันทึกสำเร็จ!');
      setOpenDialog(true);

      setFormData({
        building: '',
        courtsCount: '',
        type: 'residential',
        price: '',
        open: '',
        close: ''
      });

      // Redirect after successful submission
      setTimeout(() => {
        router.push('/owner/areafield/field.management');
      }, 1500);  // Wait for 2 seconds before redirecting
    } catch (error) {
      console.error('Error:', error);
      // Show error dialog if something goes wrong
      setDialogSeverity("error");
      setDialogMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      setOpenDialog(true);
    }
  };

  return (
    <div className="page-container">
      <TopBar_Owner /> {/* เพิ่ม TopBar_Owner ที่นี่ */}

      <div className="form-container">
        <h2>เพิ่มข้อมูลอาคาร</h2> {/* ตอนนี้ใส่ไปในกรอบเดียวกัน */}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="building">ชื่ออาคาร:</label>
            <input
              type="text"
              id="building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              required
            />
            {errorMessages.building && <span className="error">{errorMessages.building}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="courtsCount">จำนวนสนาม:</label>
            <input
              type="number"
              id="courtsCount"
              name="courtsCount"
              value={formData.courtsCount}
              onChange={handleChange}
              required
            />
            {errorMessages.courtsCount && <span className="error">{errorMessages.courtsCount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">ประเภทสนาม:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="residential">สนามแบดมินตัน</option>
              <option value="commercial">สนามฟุตบอล</option>
              <option value="industrial">สนามเทนนิส</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">ราคา:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            {errorMessages.price && <span className="error">{errorMessages.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="open">เวลาเปิด:</label>
            <input
              type="time"  // เปลี่ยนจาก date เป็น time
              id="open"
              name="open"
              value={formData.open}
              onChange={handleChange}
              required
            />
            {errorMessages.open && <span className="error">{errorMessages.open}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="close">เวลาปิด:</label>
            <input
              type="time"  // เปลี่ยนจาก date เป็น time
              id="close"
              name="close"
              value={formData.close}
              onChange={handleChange}
              required
            />
            {errorMessages.close && <span className="error">{errorMessages.close}</span>}
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn">save</button>
            <button type="button" className="cancel-btn" onClick={() => router.push('/owner/areafield/field.management')}>
              cancel
            </button>
          </div>
        </form>
      </div>

      {/* Dialog for success/error */}
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
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: dialogSeverity === "success" ? '#1e40af' : '#f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {dialogSeverity === "success" ? (
            <span style={{ color: '#1e40af' }}>✔</span>
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
          {/* Dialog Button */}
          <Button
            onClick={handleCloseDialog}
            color={dialogSeverity === "success" ? "primary" : "error"} // ใช้ primary หรือกำหนดเองด้านล่าง
            variant="contained"
            sx={{
              backgroundColor: dialogSeverity === "success" ? '#1e40af' : '#d32f2f',
              '&:hover': {
                backgroundColor: dialogSeverity === "success" ? '#162d68' : '#b71c1c',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              },
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '8px 20px',
              textTransform: 'none',
              borderRadius: '8px',
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddBuildingForm;