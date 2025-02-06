"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar_Admin from "@components/Topbar_Admin";
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function AddAccountPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Owner", // Fix Role to "Owner"
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogSeverity, setDialogSeverity] = useState("success");


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        console.log("Saved Data:", formData);
        // Simulate success or error
        setSnackbarMessage("Account saved successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Show dialog after saving data
        setDialogMessage("The account has been added successfully.");
        setDialogSeverity("success");
        setOpenDialog(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseDialog = () => {
        // Redirect to the /admin/management page when the dialog is closed
        router.push("/admin/management");
    };

    return (
        <>
            <Box display="flex" flexDirection="column" height="100vh" width="100vw" sx={{ backgroundColor: "#f4f4f4", position: "relative" }}>
                {/* Background Box */}
                <Box sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f4f4f4",
                    zIndex: -1, // Keeps the background below the profile section
                }} />
                <TopBar_Admin /> {/* ✅ Added TopBar_Admin */}
                
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        {/* Change title color to black */}
                        <h2 className="text-2xl font-bold text-center text-black mb-4">Add Account</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded-lg text-gray-400"
                                    // Removed the 'disabled' attribute to allow editing
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    readOnly
                                    className="w-full border px-3 py-2 rounded-lg bg-gray-200 text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            {/* Save button in green */}
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg w-1/2 mr-2 hover:bg-green-700"
                            >
                                Save
                            </button>

                            {/* Cancel button in red */}
                            <button
                                onClick={() => router.push("/admin/management")}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg w-1/2 hover:bg-red-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>

            {/* Dialog for success/error */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '12px', // Add rounded corners
                        padding: '20px',
                        maxWidth: '400px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: dialogSeverity === "success" ? '#4caf50' : '#f44336',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    {dialogSeverity === "success" ? (
                        <span style={{ color: '#4caf50' }}>✔</span>
                    ) : (
                        <span style={{ color: '#f44336' }}>❌</span>
                    )}
                    {dialogSeverity === "success" ? "Success" : "Error"}
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <Typography variant="body1" sx={{ fontSize: '16px', color: '#333' }}>
                        {dialogMessage}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', paddingTop: '10px' }}>
                    <Button
                        onClick={handleCloseDialog} // This will trigger the redirect
                        color={dialogSeverity === "success" ? "success" : "error"}
                        variant="contained"
                        sx={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            padding: '8px 20px',
                            textTransform: 'none',
                            borderRadius: '8px',
                            '&:hover': {
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                            },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
