"use client";
import React, { useState, useEffect } from "react";
import TopBar_Owner from '@components/Topbar_Owner';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import DraftsIcon from "@mui/icons-material/Drafts";

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [open, setOpen] = useState(false);

    // ข้อความตัวอย่าง
    useEffect(() => {
        const sampleMessages = [
            {
                id: 1,
                sender: "Admin",
                subject: "Booking Confirmed ✅",
                content: "Your booking has been confirmed for tomorrow at 5 PM.",
                isRead: false,
                timestamp: "2024-02-20 14:30",
            },
            {
                id: 2,
                sender: "User123",
                subject: "Request for Refund 💸",
                content: "Can I get a refund for my last booking?",
                isRead: true,
                timestamp: "2024-02-19 11:45",
            },
            {
                id: 3,
                sender: "System",
                subject: "🚧 Maintenance Notice",
                content: "The system will be under maintenance tonight from 12 AM to 3 AM.",
                isRead: false,
                timestamp: "2024-02-18 09:10",
            },
        ];
        setMessages(sampleMessages);
    }, []);

    // เปิดหน้าต่างอ่านข้อความ
    const handleOpenMessage = (message) => {
        setSelectedMessage({ ...message, isRead: true });
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message.id ? { ...msg, isRead: true } : msg
            )
        );
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <TopBar_Owner textColor={"black"} />

            {/* กล่องหลักของ Inbox */}
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#ffffff", // Change this line for a white background
                    padding: 4,
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        maxWidth: 900,
                        margin: "0 auto",
                        padding: 4,
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "#1e40af", textAlign: "center" }}
                    >
                        📥 Inbox
                    </Typography>

                    {/* แสดงข้อความทั้งหมด */}
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                        {messages.map((message) => (
                            <React.Fragment key={message.id}>
                                <ListItem
                                    button
                                    onClick={() => handleOpenMessage(message)}
                                    sx={{
                                        backgroundColor: message.isRead ? "#f0f4ff" : "#e3f2fd",
                                        borderRadius: 2,
                                        marginBottom: 1,
                                        transition: "0.3s",
                                        boxShadow: message.isRead
                                            ? "none"
                                            : "0 4px 12px rgba(0,0,0,0.1)",
                                        "&:hover": {
                                            transform: "scale(1.02)",
                                            backgroundColor: "#dbeafe",
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            color="error"
                                            variant="dot"
                                            invisible={message.isRead}
                                        >
                                            <Avatar
                                                sx={{
                                                    backgroundColor: message.isRead
                                                        ? "#90caf9"
                                                        : "#1e40af",
                                                }}
                                            >
                                                {message.isRead ? <DraftsIcon /> : <MailIcon />}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={message.isRead ? "normal" : "bold"}
                                                color={message.isRead ? "text.secondary" : "#1e40af"}
                                            >
                                                {message.subject}
                                            </Typography>
                                        }
                                        secondary={`From: ${message.sender} • ${message.timestamp}`}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>

                    {/* Dialog สำหรับเปิดอ่านข้อความ */}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="body1" gutterBottom>
                                {selectedMessage?.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Sent by {selectedMessage?.sender} on {selectedMessage?.timestamp}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Box>
        </>
    );
};

export default Inbox;
