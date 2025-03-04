"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Typography, Box
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import TopBar_Owner from "@components/Topbar_Owner";
import styles from "./CourtManagement.module.css";

const CourtManagement = () => {
    const [courtData, setCourtData] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        fetchCourtData();
    }, []);

    const fetchCourtData = async () => {
        try {
            const response = await fetch("http://localhost:5005/api/buildings");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();

            // แปลงข้อมูล JSON เป็นรูปแบบที่ใช้งานง่าย
            const formattedData = data.map(item => {
                const buildingName = Object.keys(item.Building)[0]; // เช่น "Building1"
                const fields = Object.entries(item.Building[buildingName]).map(([fieldName, fieldData]) => ({
                    id: fieldName, // เช่น "Field1", "Field2"
                    building: buildingName,
                    price: fieldData.Price,
                    time: fieldData.Time,
                    booking: fieldData.Booking // ค่าจริง/เท็จ
                }));
                return {
                    type: item.Type, // ประเภทกีฬา เช่น "Archer"
                    building: buildingName,
                    fields
                };
            });

            setCourtData(formattedData);
        } catch (error) {
            console.error("❌ Error fetching court data:", error);
        }
    };

    // ฟังก์ชันเปิด/ปิด Booking
    const toggleBooking = async (type, building, fieldId, currentStatus) => {
        const newBookingStatus = !currentStatus; // Toggle true/false
    
        console.log("📤 Sending data:", JSON.stringify({ type, building, fieldId, booking: newBookingStatus }));
    
        try {
            const response = await fetch("http://localhost:5005/api/update-buildings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, building, fieldId, booking: newBookingStatus }),
            });
    
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`❌ Failed: ${responseData.message || "Unknown error"}`);
            }
    
            console.log(`✅ Booking updated: ${responseData.message}`);
    
            // รีโหลดข้อมูลใหม่จาก API
            fetchCourtData();
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };
    

    if (!isClient) {
        return null;
    }

    return (
        <Box className={styles.container}>
            <TopBar_Owner textColor={"black"} />
            <Box className={styles.contentBox}>
                <Typography variant="h4" fontWeight="bold" color="primary">จัดการสนามกีฬา</Typography>

                {courtData.map((courtGroup, typeIndex) => (
                    <Box key={typeIndex} className={styles.typeSection}>
                        <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                            ประเภทกีฬา: {courtGroup.type}
                        </Typography>
                        <TableContainer component={Paper} className={styles.tableContainer}>
                            <Table>
                                <TableHead className={styles.tableHead}>
                                    <TableRow>
                                        {["No.", "Building", "Field", "Price", "Time", "Booking", "Actions"].map((head, index) => (
                                            <TableCell key={index} className={styles.tableHeadCell}>{head}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courtGroup.fields.map((field, fieldIndex) => (
                                        <TableRow key={`${courtGroup.building}-${field.id}`} className={styles.tableRow}>
                                            <TableCell align="center">{typeIndex + 1}.{fieldIndex + 1}</TableCell>
                                            <TableCell align="center">{courtGroup.building}</TableCell>
                                            <TableCell align="center">{field.id}</TableCell>
                                            <TableCell align="center">{field.price}</TableCell>
                                            <TableCell align="center">{field.time}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color={field.booking ? "success" : "error"}
                                                    onClick={() => toggleBooking(courtGroup.type, courtGroup.building, field.id)}
                                                >
                                                    {field.booking ? "✅ เปิด" : "❌ ปิด"}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary"><Edit /></IconButton>
                                                <IconButton color="error"><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CourtManagement;
