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
import axios from "axios"

const CourtManagement = () => {
    const [courtData, setCourtData] = useState([]);
    const [Userid, setUserid] = useState(""); // ✅ Store logged-in user ID
    const router = useRouter();

    // ✅ Fetch Current User ID from Local Storage
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const tokenData = JSON.parse(localStorage.getItem("token"));
                const token = tokenData?.token;
                if (!token) {
                    console.error("❌ No valid token found");
                    return;
                }
        
                console.log("📌 Token being sent:", token);
                const response = await axios.get("http://localhost:5000/api/bookings/current", {
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                const data = response.data; // ✅ Use response.data instead of response.json()
        
                if (Array.isArray(data) && data.length > 0) {
                    setUserid(data[0]._id); // ✅ Save logged-in user ID
                    console.log("✅ User fetched:", data[0]);
                } else {
                    console.error("❌ No user data received");
                }
            } catch (error) {
                console.error("❌ Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    // ✅ Fetch Buildings for the Logged-in User
    useEffect(() => {
        if (!Userid) return; // ✅ Ensures we only fetch when Userid is available
        console.log("📌 Fetching buildings for UserID:", Userid);
    
        const fetchCourtData = async () => {
            try {
                const response = await fetch(`http://localhost:5005/api/buildings?userid=${String(Userid)}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
    
                console.log("✅ Raw Data from API:", JSON.stringify(data, null, 2));
    
                if (!Array.isArray(data)) {
                    throw new Error("❌ Data is not an array!");
                }
    
                // ✅ Ensure unique `_id` separation
                const formattedData = data.map(item => ({
                    username: item.name,  // ✅ Store unique _id
                    type: item.Type,
                    buildings: Object.entries(item.Building || {}).map(([buildingName, fields]) => ({
                        name: buildingName,
                        fields: Object.entries(fields || {}).map(([fieldName, fieldData]) => ({
                            id: fieldName,
                            price: fieldData?.Price || "N/A",
                            open: fieldData?.open || "00:00",
                            close: fieldData?.close || "00:00",
                            booking: fieldData?.Booking ?? false
                        }))
                    }))
                }));
    
                console.log("✅ Processed Data for State:", JSON.stringify(formattedData, null, 2));
                setCourtData(formattedData); // ✅ Ensures state updates correctly
    
            } catch (error) {
                console.error("❌ Error fetching court data:", error);
                setCourtData([]); // Prevent UI errors
            }
        };
    
        fetchCourtData();
    }, [Userid]); // ✅ Runs when Userid updates
    

    // ✅ Toggle Booking Status
    const toggleBooking = async (type, buildingName, fieldKey, currentStatus) => {
        if (!buildingName || !fieldKey) {
            console.error("❌ Missing Building Name or Field Key:", { buildingName, fieldKey });
            return;
        }

        const newStatus = !currentStatus; // ✅ Toggle the booking status

        const requestData = {
            Name: name,
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

                {courtData.length > 0 ? (
                    courtData.map((courtGroup, typeIndex) => (
                        <Box key={courtGroup._id} className={styles.typeSection}> {/* ✅ Use `_id` as unique key */}
                            <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                                ประเภทกีฬา: {courtGroup.type}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                                ประเภทกีฬา: {courtGroup.username}
                            </Typography>
                            {courtGroup.buildings.map((building, buildingIndex) => (
                                <Box key={`${courtGroup._id}-${buildingIndex}`} sx={{ mb: 4 }}> {/* ✅ Unique Key */}
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
                    ))
                ) : (
                    <Typography variant="h6" color="textSecondary" align="center">
                        ❌ No data available for this user.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CourtManagement;
