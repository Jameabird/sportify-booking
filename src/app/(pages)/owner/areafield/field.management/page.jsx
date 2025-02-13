"use client";  // ต้องบอกว่าเป็น Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // แก้ไขจาก next/router เป็น next/navigation
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

const initialCourtData = [
    { id: 1, building: "อาคารแบด 1", courtsCount: 5, type: "สนามแบดมินตัน", price: "200 บาท", open: "08:00", close: "20:00" },
    { id: 2, building: "อาคารฟุตบอล", courtsCount: 2, type: "สนามฟุตบอล", price: "500 บาท", open: "10:00", close: "22:00" },
    { id: 3, building: "อาคารเทนนิส", courtsCount: 3, type: "สนามเทนนิส", price: "300 บาท", open: "09:00", close: "21:00" },
    { id: 4, building: "อาคารแบด 2", courtsCount: 10, type: "สนามแบดมินตัน", price: "200 บาท", open: "08:00", close: "20:00" },
];

const CourtManagement = () => {
    const [courtData, setCourtData] = useState(initialCourtData);
    const [filterType, setFilterType] = useState("ทั้งหมด");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const [isClient, setIsClient] = useState(false); // Track client-side render
    const router = useRouter();

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
                                    {["No.", "Building", "Courts Count", "ประเภทสนาม", "Price", "Open", "Close", "Actions"].map((head, index) => (
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
        </Box>
    );
};

export default CourtManagement; // ส่งออก Default ถูกต้อง
