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
import { Building } from "lucide-react";

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
    
            console.log("✅ Raw Data from API after update:", JSON.stringify(data, null, 2));
    
            if (!Array.isArray(data)) {
                throw new Error("❌ Data is not an array!");
            }
    
            const formattedData = data.map(item => ({
                type: item.Type,
                buildings: Object.entries(item.Building || {}).map(([buildingName, fields]) => ({
                    name: buildingName,
                    fields: Object.entries(fields || {}).map(([fieldName, fieldData]) => ({
                        id: fieldName,
                        price: fieldData?.Price || "N/A",
                        open: fieldData?.open || "00:00",
                        close: fieldData?.close || "00:00",
                        booking: fieldData?.Booking ?? false // ✅ Ensure state changes
                    }))
                }))
            }));
    
            console.log("✅ Processed Data for State:", JSON.stringify(formattedData, null, 2));
    
            setCourtData([...formattedData]); // ✅ Forces a state update
    
        } catch (error) {
            console.error("❌ Error fetching court data:", error);
            setCourtData([]); // Prevent UI errors
        }
    };    
    
    // ฟังก์ชันเปิด/ปิด Booking
    const toggleBooking = async (type, buildingName, fieldKey, currentStatus) => {
        if (!buildingName || !fieldKey) {
            console.error("❌ Missing Building Name or Field Key:", { buildingName, fieldKey });
            return;
        }
    
        const newStatus = !currentStatus; // Toggle the booking status
    
        const requestData = {
            Type: type,
            Building: {
                [buildingName]: {
                    [fieldKey]: {
                        Booking: newStatus
                    }
                }
            }
        };
    
        console.log("📌 Sending data to API:", JSON.stringify(requestData, null, 2));
    
        try {
            const response = await fetch("http://localhost:5005/api/update-buildings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });
    
            const data = await response.json();
            console.log("✅ Updated Data from API:", JSON.stringify(data, null, 2));
    
            if (!response.ok) {
                throw new Error(data.message || "❌ Failed to update booking");
            }
    
            // ✅ Fetch updated data after API request
            await fetchCourtData();
    
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };       
    
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
                        {courtGroup.buildings.map((building, buildingIndex) => (
                            <Box key={buildingIndex} sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    อาคาร: {building.name}
                                </Typography>
                                <TableContainer component={Paper} className={styles.tableContainer}>
                                    <Table>
                                        <TableHead className={styles.tableHead}>
                                            <TableRow>
                                                {["No.", "Field", "Price", "Time", "Booking", "Actions"].map((head, index) => (
                                                    <TableCell key={index} className={styles.tableHeadCell}>{head}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {building.fields.map((field, fieldIndex) => (
                                                <TableRow key={`${building.name}-${field.id}`} className={styles.tableRow}>
                                                    <TableCell align="center">{buildingIndex + 1}.{fieldIndex + 1}</TableCell>
                                                    <TableCell align="center">{field.id}</TableCell>
                                                    <TableCell align="center">{field.price}</TableCell>
                                                    <TableCell align="center">{field.open} - {field.close}</TableCell>
                                                    <TableCell align="center">
                                                    <Button
                                                            variant="contained"
                                                            color={field.booking ? "success" : "error"}
                                                            onClick={() => toggleBooking(courtGroup.type, building.name, field.id, field.booking)}
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
                ))}
            </Box>
        </Box>
    );
};

export default CourtManagement;
