"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TopBar_Admin from "@components/Topbar_Admin";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Eye, EyeOff } from "lucide-react";

export default function AddAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    bank: "",
    accountNumber: "",
    role: "Owner",
  });

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    if (!tokenData || !tokenData.token || Date.now() > tokenData.expirationTime) {
      console.log("❌ Token is missing or expired.");
      setSnackbarMessage("Token is missing or expired. Please log in again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    console.log("✅ Token is valid:", tokenData.token);
    setToken(tokenData.token);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!token) {
      setSnackbarMessage("Token is missing or expired. Please log in again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5011/api/owners",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Owner created:", res.data);

      setSnackbarMessage("Account saved successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setDialogMessage("The account has been added successfully.");
      setDialogSeverity("success");
      setOpenDialog(true);
    } catch (error) {
      console.error("🚨 Error creating owner:", error.response?.data || error.message);
      setSnackbarMessage(error.response?.data?.error || "Failed to create account");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    router.push("/admin/management");
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}>
        <TopBar_Admin />

        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl mt-12">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Add New Account</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-lg font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-lg font-medium text-gray-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-600">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-600">Account</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-600">Bank</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกธนาคาร</option>
                <option value="PromptPay">PromptPay</option>
                <option value="BAAC">เพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)</option>
                <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                <option value="KBank">กสิกรไทย (KBank)</option>
                <option value="Krungthai">กรุงไทย (Krungthai)</option>
                <option value="TTB">ทีทีบี (TTB)</option>
                <option value="BBL">กรุงเทพ (BBL)</option>
                <option value="Krungsri">กรุงศรีอยุธยา (Krungsri)</option>
                <option value="Thanachart">ธนชาต (Thanachart)</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-600">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-600">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-600">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                readOnly
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg w-1/2 mr-2 hover:bg-blue-700 transition ease-in-out"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => router.push("/admin/management")}
              className="bg-red-600 text-white px-5 py-3 rounded-lg w-1/2 hover:bg-red-700 transition ease-in-out"
            >
              Cancel
            </button>
          </div>
        </div>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogSeverity === "success" ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color={dialogSeverity === "success" ? "primary" : "error"} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
