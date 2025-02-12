"use client";
import React, { useState } from "react";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Typography, Box, MenuItem, Select, FormControl, InputLabel, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import { Edit, Delete } from "@mui/icons-material";
import TopBar_Owner from "@components/Topbar_Owner";
import styles from "./CourtManagement.module.css"; // นำเข้า CSS
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// ข้อมูลเริ่มต้น
const initialCourtData = [
    { id: 1, image: "https://via.placeholder.com/100", building: "อาคารแบด 1", courtsCount: 5, type: "สนามแบดมินตัน", price: "200 บาท", open: "08:00", close: "20:00" },
    { id: 2, image: "https://via.placeholder.com/100", building: "อาคารฟุตบอล", courtsCount: 2, type: "สนามฟุตบอล", price: "500 บาท", open: "10:00", close: "22:00" },
    { id: 3, image: "https://via.placeholder.com/100", building: "อาคารเทนนิส", courtsCount: 3, type: "สนามเทนนิส", price: "300 บาท", open: "09:00", close: "21:00" },
    { id: 4, image: "https://via.placeholder.com/100", building: "อาคารแบด 2", courtsCount: 10, type: "สนามแบดมินตัน", price: "200 บาท", open: "08:00", close: "20:00" },
];

const CourtManagement = () => {
    const [courtData, setCourtData] = useState(initialCourtData);
    const [filterType, setFilterType] = useState("ทั้งหมด");
    const [searchQuery, setSearchQuery] = useState("");  // สถานะสำหรับช่องค้นหา
    const [open, setOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const courtTypes = ["ทั้งหมด", ...new Set(initialCourtData.map((court) => court.type))];

    // ฟังก์ชันกรองข้อมูล
    const filteredCourts = courtData
        .filter((court) => filterType === "ทั้งหมด" || court.type === filterType)
        .filter((court) => court.building.toLowerCase().includes(searchQuery.toLowerCase()));  // ค้นหาตามชื่ออาคาร

    // เปิด Alert Confirm ลบ
    const handleClickOpen = (court) => {
        setSelectedBuilding(court);
        setOpen(true);
    };

    // ปิด Alert Confirm ลบ
    const handleClose = () => {
        setOpen(false);
        setSelectedBuilding(null);
    };

    // ลบข้อมูล
    const handleDelete = () => {
        if (selectedBuilding) {
            setCourtData(courtData.filter((court) => court.id !== selectedBuilding.id));
            handleClose();
        }
    };

    return (
        <Box className={styles.container}>
            <TopBar_Owner textColor={"black"} />

            <Box className={styles.contentBox}>
                {/* Header Section */}
                <Box className={styles.header} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        จัดการสนามกีฬา
                    </Typography>

                    {/* ปุ่มที่ขนานกับ "จัดการสนามกีฬา" */}
                    <Box display="flex" gap={2}>
                        <Button variant="contained" color="error" startIcon={<EditLocationIcon />} className={styles.button}>
                            แก้ไขสถานที่
                        </Button>
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} className={styles.button}>
                            เพิ่มข้อมูลอาคาร
                        </Button>
                    </Box>
                </Box>

                {/* เลื่อนปุ่มลงมาขนานกับช่องค้นหากับ Dropdown */}
                <Box display="flex" justifyContent="space-between" alignItems="center" className={styles.buttonFilterGroup}>
                    {/* ที่กรองประเภทสนามจะอยู่ทางซ้าย */}
                    <Box display="flex" gap={2} width="100%">
                        <FormControl className={styles.filterDropdown} style={{ flex: 1 }}>
                            <InputLabel>ประเภทสนาม</InputLabel>
                            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                {courtTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* ช่องค้นหาจะอยู่ข้างๆกับ dropdown และชิดซ้าย */}
                        <TextField
                            label="ค้นหาชื่ออาคาร"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchField}
                            style={{ flex: 1, width: "300px" }} // กำหนดความกว้างของช่องค้นหาที่ชิดซ้าย
                        />
                    </Box>
                </Box>

                {/* ตารางแสดงข้อมูลสนาม */}
                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table>
                        <TableHead className={styles.tableHead}>
                            <TableRow>
                                {["No.", "Picture", "Building", "Courts Count", "ประเภทสนาม", "Price", "Open", "Close", "Actions"].map((head, index) => (
                                    <TableCell key={index} className={styles.tableHeadCell}>
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredCourts.map((court, index) => (
                                <TableRow key={court.id} className={styles.tableRow}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">
                                        <img src={court.image} alt="court" width="70" height="50" className={styles.image} />
                                    </TableCell>
                                    <TableCell align="center">{court.building}</TableCell>
                                    <TableCell align="center">{court.courtsCount}</TableCell>
                                    <TableCell align="center">{court.type}</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "green" }}>
                                        {court.price}
                                    </TableCell>
                                    <TableCell align="center">{court.open}</TableCell>
                                    <TableCell align="center">{court.close}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" className={styles.iconButton}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" className={styles.iconButton} onClick={() => handleClickOpen(court)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default CourtManagement;
