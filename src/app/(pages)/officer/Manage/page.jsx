"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Modal,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import "./managePage.css"; // นำเข้าไฟล์ CSS

export default function Manage() {
  const buildings = ["ตึก 1", "ตึก 2", "ตึก 3"];
  const sports = ["บาสเกตบอล", "แบดมินตัน", "ฟุตบอล"];

  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("เปิด");

  const courtsData = [
    { id: 1, name: "สนาม A", sport: "บาสเกตบอล", building: "ตึก 1", courtNumber: "1", openTime: "09:00", closeTime: "22:00", status: "เปิด", note: "" },
    { id: 2, name: "สนาม B", sport: "แบดมินตัน", building: "ตึก 2", courtNumber: "2", openTime: "08:00", closeTime: "21:00", status: "ปิด", note: "" },
    { id: 3, name: "สนาม C", sport: "ฟุตบอล", building: "ตึก 3", courtNumber: "3", openTime: "10:00", closeTime: "23:00", status: "เปิด", note: "" },
  ];

  const [courts, setCourts] = useState(courtsData);

  const filteredCourts = courts.filter((court) => {
    return (
      (selectedBuilding === "" || court.building === selectedBuilding) &&
      (selectedSport === "" || court.sport === selectedSport)
    );
  });

  const handleEdit = (court) => {
    setEditingCourt(court);
    setNote(court.note);
    setStatus(court.status);
    setOpenModal(true);
  };

  const handleSave = () => {
    setCourts(
      courts.map((court) =>
        court.id === editingCourt.id ? { ...court, status, note } : court
      )
    );
    setOpenModal(false);
  };

  const handleNotify = () => {
    setOpenSnackbar(true);
  };

  return (
    <Box className="manage-container">
      <Typography variant="h4" className="manage-title">
        จัดการสนามกีฬา
      </Typography>

      <Box className="dropdown-container">
        <FormControl className="dropdown">
          <InputLabel>เลือกตึก</InputLabel>
          <Select value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)}>
            <MenuItem value="">ทั้งหมด</MenuItem>
            {buildings.map((building, index) => (
              <MenuItem key={index} value={building}>
                {building}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="dropdown">
          <InputLabel>เลือกกีฬา</InputLabel>
          <Select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
            <MenuItem value="">ทั้งหมด</MenuItem>
            {sports.map((sport, index) => (
              <MenuItem key={index} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell>ชื่อสนาม</TableCell>
              <TableCell>ประเภทกีฬา</TableCell>
              <TableCell>ตึกที่</TableCell>
              <TableCell>คอร์ดที่</TableCell>
              <TableCell>เวลาเปิด-ปิด</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell className="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourts.length > 0 ? (
              filteredCourts.map((court) => (
                <TableRow key={court.id}>
                  <TableCell>{court.name}</TableCell>
                  <TableCell>{court.sport}</TableCell>
                  <TableCell>{court.building}</TableCell>
                  <TableCell>{court.courtNumber}</TableCell>
                  <TableCell>{court.openTime} - {court.closeTime}</TableCell>
                  <TableCell>{court.status}</TableCell>
                  <TableCell className="center">
                    <Button variant="contained" color="warning" onClick={() => handleEdit(court)}>
                      แก้ไข
                    </Button>
                    <Button variant="contained" color="error" onClick={handleNotify} className="notify-button">
                      แจ้งเตือน
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="no-data">
                  ไม่พบข้อมูลสนามกีฬา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modal-box">
          <Typography variant="h6">แก้ไขข้อมูลสนาม</Typography>

          <FormControl>
            <InputLabel>สถานะ</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="เปิด">เปิด</MenuItem>
              <MenuItem value="ปิด">ปิด</MenuItem>
            </Select>
          </FormControl>

          <TextField label="หมายเหตุ" value={note} onChange={(e) => setNote(e.target.value)} multiline rows={2} />

          <Box className="modal-actions">
            <Button variant="contained" color="secondary" onClick={() => setOpenModal(false)}>
              ยกเลิก
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              บันทึก
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar แจ้งเตือน */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          แจ้งเตือนไปยัง User แล้ว!
        </Alert>
      </Snackbar>
    </Box>
  );
}
