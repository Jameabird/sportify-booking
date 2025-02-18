"use client";  // ต้องบอกว่าเป็น Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // แก้ไขจาก next/router เป็น next/navigation
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Typography, Box, MenuItem, Select, FormControl, InputLabel, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import { Edit, Delete } from "@mui/icons-material";
import TopBar_Owner from "@components/Topbar_Owner";
import styles from "./CourtManagement.module.css"; // นำเข้า CSS
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const initialCourtData = [
    { id: 1, building: "อาคารแบด 1", courtsCount: 5, type: "สนามแบดมินตัน", price: "200 บาท", open: "08:00", close: "20:00", status: "เปิด" },
    { id: 2, building: "อาคารฟุตบอล", courtsCount: 2, type: "สนามฟุตบอล", price: "500 บาท", open: "10:00", close: "22:00", status: "ปิด" },
    { id: 3, building: "อาคารเทนนิส", courtsCount: 3, type: "สนามเทนนิส", price: "300 บาท", open: "09:00", close: "21:00", status: "เปิด" },
    { id: 4, building: "อาคารแบด 2", courtsCount: 10, type: "สนามแบดมินตัน", price: "200 บาท", open: "08:00", close: "20:00", status: "ปิด" },
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

    const handleAddBuilding = () => {
        router.push("/owner/areafield/field.management/add.building");
    };

    const handleEditlocation = () => {
        router.push("/owner/areafield/field.management/edit.location");
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
        setFormData({
            building: court.building || "",
            courtsCount: court.courtsCount || "",
            courtType: court.type || "",
            price: court.price || "",
            open: court.open || "",
            close: court.close || ""
        });
        setSelectedBuilding(court); // ต้องเซ็ตตัวที่กำลังแก้ไข
        setOpenModal(true);
        handleMenuClose(); // ปิดเมนูก่อน
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
            <TopBar_Owner textColor={"black"} />
            <Box className={styles.contentBox}>
                <Box className={styles.header} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        จัดการสนามกีฬา
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<EditLocationIcon />}
                            className={styles.button}
                            onClick={handleEditlocation}
                        >
                            แก้ไขสถานที่
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            className={styles.button}
                            onClick={handleAddBuilding}
                        >
                            เพิ่มข้อมูลอาคาร
                        </Button>
                    </Box>
                </Box>
                {/* Popup for Success Message */}
                {isPopupVisible && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            zIndex: 1000,
                        }}
                    >
                        <Typography variant="h6" color="inherit" align="center">
                            ข้อมูลได้รับการบันทึกสำเร็จ
                        </Typography>
                        <Box display="flex" justifyContent="center" marginTop="10px">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsPopupVisible(false)} // Close the popup when button clicked
                            >
                                ปิด
                            </Button>
                        </Box>
                    </Box>
                )}

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
                                    {["No.", "Building", "Courts Count", "ประเภทสนาม", "Price", "Open", "Close", "Status", "Actions"].map((head, index) => (
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
                                        <TableCell align="center" sx={{ fontWeight: "bold", color: "green" }}>
                                            {court.price}
                                        </TableCell>
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

                                        {/* ปุ่มลบ */}
                                        <IconButton
                                            color="error"
                                            className={styles.iconButton}
                                            onClick={() => handleClickOpen(court)}
                                        >
                                            <Delete />
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
                                                        label="Building"
                                                        name="building"
                                                        value={formData.building}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                    <TextField
                                                        label="Courts Count"
                                                        name="courtsCount"
                                                        value={formData.courtsCount}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        margin="normal"
                                                        type="number"
                                                    />
                                                    <FormControl fullWidth margin="normal">
                                                        <InputLabel>ประเภทสนาม</InputLabel>
                                                        <Select
                                                            name="courtType"
                                                            value={formData.courtType}
                                                            onChange={handleChange}
                                                        >
                                                            <MenuItem value="indoor">สนามแบดมินตัน</MenuItem>
                                                            <MenuItem value="outdoor">สนามฟุตบอล</MenuItem>
                                                            <MenuItem value="synthetic">สนามเทนนิส</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <TextField
                                                        label="Price"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        margin="normal"
                                                        type="number"
                                                    />
                                                    <TextField
                                                        label="Open"
                                                        name="open"
                                                        value={formData.open}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        margin="normal"
                                                        type="time"
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
                                            <MenuItem onClick={() => {
                                                router.push(`/owner/areafield/field.management/manage.chords?building=${selectedCourt?.id}`);
                                                handleMenuClose();
                                            }}>
                                                จัดการคอร์ด
                                            </MenuItem>
                                        </Menu>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Delete Confirmation Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>ยืนยันการลบ</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            คุณต้องการลบข้อมูลสนามกีฬา {selectedBuilding?.building} ใช่หรือไม่?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            ยกเลิก
                        </Button>
                        <Button onClick={handleDelete} color="error">
                            ลบ
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
};

export default CourtManagement; // ส่งออก Default ถูกต้อง
