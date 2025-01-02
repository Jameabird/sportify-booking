"use client";
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation"; // Import useRouter

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Manage email state
  const [password, setPassword] = useState(""); // Manage password state
  const router = useRouter(); // Get router object to navigate
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle login form submission
  const handleLogin = () => {
    // Here, you can add your authentication logic (e.g., verify credentials)
    // For now, we'll just assume login is successful
    // Simulating a successful login and then redirecting to Home page
    router.push("/home"); // Navigate to the Home page
  };

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto" }}>
        {/* พื้นหลังเลเยอร์ */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/gym_bg2.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.7)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            zIndex: -1,
          }}
        />
        <div className="relative h-full w-full">
          {/* Grid สำหรับ TopBar */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <TopBar textColor={"white"} />
            </div>
            {/* กล่องสำหรับ Login */}
            <div className="col-span-12 flex justify-center items-center">
              <Box
                sx={{
                  width: "400px",
                  padding: "24px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                  textAlign: "center",
                }}
              >
                <h2 style={{ marginBottom: "16px", color: "rgba(70, 80, 100, 0.9)" }}>
                  Welcome Back!
                </h2>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"} // เปลี่ยน type ตาม state
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ textAlign: "right", marginBottom: "16px" }}>
                  <a
                    href="/forget_password/main"
                    style={{
                      color: "#f57c00",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    Forget Password?
                  </a>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    backgroundColor: "#f57c00",
                    "&:hover": {
                      backgroundColor: "#ff9800",
                    },
                  }}
                  onClick={handleLogin} // Handle login button click
                >
                  Login
                </Button>
                <Box
                  sx={{
                    marginTop: "16px",
                    color: "rgba(70, 80, 100, 0.9)",
                  }}
                >
                  <p>
                    Don't have an account?{" "}
                    <a href="/register" style={{ color: "#f57c00", textDecoration: "none" }}>
                      Sign up
                    </a>
                  </p>
                </Box>
              </Box>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
