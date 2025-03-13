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
    const [courtData, setCourtData] = useState([]);
    const [Userid, setUserid] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const tokenData = JSON.parse(localStorage.getItem("token"));
                const token = tokenData?.token;
                if (!token) return;

                const response = await axios.get("http://localhost:5000/api/bookings/current", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;

                if (Array.isArray(data) && data.length > 0) {
                    setUserid(data[0]._id);
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

                if (!Array.isArray(data)) throw new Error("❌ Data is not an array!");

                const formattedData = data.map(item => ({
                    username: item.name,
                    type: item.Type,
                    buildings: Object.entries(item.Building || {}).map(([buildingName, fields]) => ({
                        name: buildingName,
                        fields: Object.entries(fields || {}).map(([fieldName, fieldData]) => ({
                            id: fieldName,
                            price: fieldData?.Price || "N/A",
                            open: fieldData?.open || "00:00",
                            close: fieldData?.close || "00:00"
                        }))
                    }))
                }));

                setCourtData(formattedData);
            } catch (error) {
                console.error("❌ Error fetching court data:", error);
                setCourtData([]);
            }
        };
        fetchCourtData();
    }, [Userid]);

    return (
        <Box className={styles.container}>
            <TopBar_Owner textColor={"black"} />
            <Box className={styles.contentBox}>
                <Typography variant="h4" fontWeight="bold" color="primary">จัดการสนามกีฬา</Typography>

                {courtData.length > 0 ? (
                    courtData.map((courtGroup, typeIndex) => (
                        <Box key={typeIndex} className={styles.typeSection}>
                            <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                                ประเภทกีฬา: {courtGroup.type}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                                เจ้าของสนาม: {courtGroup.username}
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
                                                    {["No.", "Field", "Price", "Time", "Actions"].map((head, index) => (
                                                        <TableCell key={index} className={styles.tableHeadCell}>{head}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {building.fields.map((field, fieldIndex) => (
                                                    <TableRow key={fieldIndex} className={styles.tableRow}>
                                                        <TableCell align="center">{buildingIndex + 1}.{fieldIndex + 1}</TableCell>
                                                        <TableCell align="center">{field.id}</TableCell>
                                                        <TableCell align="center">{field.price}</TableCell>
                                                        <TableCell align="center">{field.open} - {field.close}</TableCell>
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
