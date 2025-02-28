"use client";  // ต้องบอกว่าเป็น Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // แก้ไขจาก next/router เป็น next/navigation
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Typography, Box, MenuItem, Select, FormControl, InputLabel, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import TopBar_Officer from "@components/Topbar_Officer";
import styles from "./CourtManagement.module.css"; // นำเข้า CSS

const initialCourtData = [
    { id: 1, building: "อาคารแบด 1", courtsCount: 5, type: "สนามแบดมินตัน", open: "08:00", close: "20:00", status: "เปิด" },
    { id: 2, building: "อาคารฟุตบอล", courtsCount: 2, type: "สนามฟุตบอล", open: "10:00", close: "22:00", status: "ปิด" },
    { id: 3, building: "อาคารเทนนิส", courtsCount: 3, type: "สนามเทนนิส", open: "09:00", close: "21:00", status: "เปิด" },
    { id: 4, building: "อาคารแบด 2", courtsCount: 10, type: "สนามแบดมินตัน", open: "08:00", close: "20:00", status: "ปิด" },
];

const CourtManagement = () => {
    const [courtData, setCourtData] = useState(initialCourtData);
    const [filterType, setFilterType] = useState("ทั้งหมด");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [editingRowId, setEditingRowId] = useState(null);
    const [isClient, setIsClient] = useState(false); // Track client-side render
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // Add this line

    const handleToggleStatus = (courtId) => {
        setCourtData((prevData) =>
            prevData.map((court) =>
                court.id === courtId ? { ...court, status: court.status === "เปิด" ? "ปิด" : "เปิด" } : court
            )
        );
    };

    const handleMenuOpen = (event, court) => {
        setAnchorEl(event.currentTarget);
        setSelectedCourt(court);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCourt(null);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const courtTypes = ["ทั้งหมด", ...new Set(initialCourtData.map((court) => court.type))];

    const filteredCourts = courtData
        .filter((court) => filterType === "ทั้งหมด" || court.type === filterType)
        .filter((court) => court.building.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleClickOpen = (court) => {
        setSelectedBuilding(court);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBuilding(null);
    };

    const handleDelete = () => {
        if (selectedBuilding) {
            setCourtData(courtData.filter((court) => court.id !== selectedBuilding.id));
            handleClose();
        }
    };
    
    const [openModal, setOpenModal] = useState(false); // ใช้เปิด/ปิด Modal
    const [formData, setFormData] = useState({
        building: "",
        courtsCount: "",
        courtType: "",
        price: "",
        open: "",
        close: ""
    });

    const handleModalOpen = (court) => {
        if (!court) return;
        setSelectedCourt(court);
        setFormData({
            building: court.building || "",
            courtsCount: court.courtsCount || "",
            courtType: court.type || "",
            price: court.price || "",
            open: court.open || "",
            close: court.close || "",
        });
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!selectedBuilding) {
            console.error("No building selected for update.");
            return;
        }

        setCourtData((prevData) =>
            prevData.map((court) =>
                court.id === selectedBuilding.id
                    ? { ...court, ...formData }
                    : court
            )
        );
        handleModalClose(); // ปิด Modal
        setIsPopupVisible(true); // แสดง Popup แจ้งเตือน
    };

    if (!isClient) {
        return null; // Render nothing until client-side
    }

    return (
        <Box className={styles.container}>
            <TopBar_Officer textColor={"black"} />
            <Box className={styles.contentBox}>
                <Box className={styles.header} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        จัดการสนามกีฬา
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" className={styles.buttonFilterGroup}>
                    <Box display="flex" gap={2} width="100%">
                        <FormControl className={styles.filterDropdown} style={{ flex: 1 }}>
                            <InputLabel>ประเภทสนาม</InputLabel>
                            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                {courtTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="ค้นหาชื่ออาคาร"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchField}
                            style={{ flex: 1, width: "300px" }}
                        />
                    </Box>
                </Box>

                <Box className={styles.contentBox} mt={4}> {/* เพิ่ม mt={4} หรือค่าอื่นๆ เพื่อขยับลง */}
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table>
                            <TableHead className={styles.tableHead}>
                                <TableRow>
                                    {["No.", "Building", "Courts Count", "ประเภทสนาม", "Open", "Close", "Status", "Actions"].map((head, index) => (
                                        <TableCell key={index} className={styles.tableHeadCell}>
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {courtData.map((court, index) => (
                                    <TableRow key={court.id} className={styles.tableRow}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{court.building}</TableCell>
                                        <TableCell align="center">{court.courtsCount}</TableCell>
                                        <TableCell align="center">{court.type}</TableCell>
                                        <TableCell align="center">{court.open}</TableCell>
                                        <TableCell align="center">{court.close}</TableCell>

                                        {/* คอลัมน์สถานะ */}
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color={court.status === "เปิด" ? "success" : "error"}
                                                onClick={() => handleToggleStatus(court.id)} // เปลี่ยนสถานะเมื่อคลิก
                                            >
                                                {court.status}  {/* แสดงสถานะของสนาม */}
                                            </Button>
                                        </TableCell>

                                        {/* ปุ่มแก้ไข */}
                                        <IconButton
                                            color="primary"
                                            className={styles.iconButton}
                                            onClick={(event) => handleMenuOpen(event, court)}
                                        >
                                            <Edit />
                                        </IconButton>

                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => handleModalOpen(selectedCourt)}>จัดการอาคาร</MenuItem>
                                            <Dialog open={openModal} onClose={handleModalClose}>
                                                <DialogTitle>แก้ไขข้อมูลอาคาร</DialogTitle>
                                                <DialogContent>
                                                    <TextField
                                                        label="Open"
                                                        name="open"
                                                        type="time"
                                                        value={formData.open}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                    <TextField
                                                        label="Close"
                                                        name="close"
                                                        value={formData.close}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        margin="normal"
                                                        type="time"
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleModalClose} color="primary">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleSubmit} color="primary">
                                                        Save
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Menu>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default CourtManagement;
