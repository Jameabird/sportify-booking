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
import axios from "axios";

const CourtManagement = () => {
    const [courtData, setCourtData] = useState([]); // ✅ Ensure it's always an array
    const [Userid, setUserid] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const tokenData = JSON.parse(localStorage.getItem("token"));
                const token = tokenData?.token;
                if (!token) return;

                const response = await axios.get("http://localhost:5011/api/bookings/current", {
                    headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed syntax error
                });

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setUserid(response.data[0]._id);
                }
            } catch (error) {
                console.error("❌ Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!Userid) return;

        const fetchCourtData = async () => {
            try {
                const response = await fetch(`http://localhost:5005/api/buildings?userid=${String(Userid)}`);
                if (!response.ok) throw new Error("Failed to fetch data");

                const data = await response.json();
                console.log("🏀 Fetched Court Data:", data); // ✅ Debug API response

                if (!Array.isArray(data)) throw new Error("❌ Data is not an array!");

                const bookingResponse = await fetch("http://localhost:5002/api/bookings");
                const bookings = await bookingResponse.json();

                const formattedData = data.map(item => ({
                    username: item.name,
                    type: item.Type,
                    buildings: Object.entries(item.Building || {}).map(([buildingName, fields]) => ({
                        name: buildingName,
                        fields: Object.entries(fields || {})
                            .filter(([fieldName]) => fieldName.toLowerCase() !== "_id")
                            .map(([fieldName, fieldData]) => {
                                const fieldBookings = bookings.filter(b => b.fieldId === fieldName);
                                const isBooked = fieldBookings.length > 0;

                                return {
                                    id: fieldName,
                                    price: fieldData?.Price || "N/A",
                                    open: fieldData?.open || "00:00",
                                    close: fieldData?.close || "00:00",
                                    status: isBooked ? "🔴 Booked" : "🟢 Available"
                                };
                            })
                    }))
                }));

                setCourtData(formattedData);
            } catch (error) {
                console.error("❌ Error fetching court data:", error);
                setCourtData([]); // ✅ Prevent undefined state
            }
        };

        fetchCourtData();
    }, [Userid]);

    const deleteField = async (buildingId, fieldId) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this field?")) return;

        try {
            const response = await fetch(`http://localhost:5005/api/buildings/${buildingId}/fields/${fieldId}`, {
                method: "DELETE"
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "❌ Failed to delete field");

            console.log("✅ Field deleted:", data);

            // Update state to remove the field from UI
            setCourtData(prevData =>
                prevData.map(courtGroup => ({
                    ...courtGroup,
                    buildings: courtGroup.buildings.map(building =>
                        building.name === buildingId
                            ? { ...building, fields: building.fields.filter(field => field.id !== fieldId) }
                            : building
                    )
                }))
            );
        } catch (error) {
            console.error("❌ Error deleting field:", error);
        }
    };

    return (
        <>
        <TopBar_Owner />
        <Box className={styles.contentBox}>
            <Typography variant="h4" fontWeight="bold" color="primary">
                จัดการสนามกีฬา
            </Typography>

            {courtData.length > 0 ? (
                courtData.map((courtGroup, typeIndex) => (
                    <Box key={typeIndex} className={styles.typeSection}>
                        {/* Show Sport Type & Owner */}
                        <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                            ประเภทกีฬา: {courtGroup.type}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                            เจ้าของสนาม: {courtGroup.username}
                        </Typography>

                        {/* Check if there are buildings */}
                        {courtGroup?.buildings?.length > 0 ? (
                            courtGroup.buildings.map((building, buildingIndex) => (
                                <Box key={buildingIndex} sx={{ mb: 4 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        อาคาร: {building.name}
                                    </Typography>

                                    <TableContainer component={Paper} className={styles.tableContainer}>
                                        <Table>
                                            <TableHead className={styles.tableHead}>
                                                <TableRow>
                                                    {["No.", "Field", "Price", "Time", "Status", "Actions"].map((head, index) => (
                                                        <TableCell key={index} className={styles.tableHeadCell}>
                                                            {head}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {building?.fields?.length > 0 ? (
                                                    building.fields.map((field, fieldIndex) => (
                                                        <TableRow key={field.id} className={styles.tableRow}>
                                                            <TableCell align="center">{buildingIndex + 1}.{fieldIndex + 1}</TableCell>
                                                            <TableCell align="center">{field.id}</TableCell>
                                                            <TableCell align="center">{field.price}</TableCell>
                                                            <TableCell align="center">{field.open} - {field.close}</TableCell>
                                                            <TableCell align="center">{field.status}</TableCell> 
                                                            <TableCell align="center">
                                                                <IconButton color="primary"><Edit /></IconButton>
                                                                <IconButton color="error" onClick={() => deleteField(building.name, field.id)}><Delete /></IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center">
                                                            ❌ ไม่มีสนามในอาคารนี้
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            ))
                        ) : null}
                    </Box>
                ))
            ) : (
                <Typography variant="h6" color="textSecondary" align="center">
                    ❌ No data available for this user.
                </Typography>
            )}
        </Box>
        </>
    );    

};

export default CourtManagement;
