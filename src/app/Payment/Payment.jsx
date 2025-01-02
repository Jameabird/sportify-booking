"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import TopBar from "@components/Topbar";
import "@app/globals.css";

export default function Payment() {
  const [amount, setAmount] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    // Logic สำหรับการชำระเงิน (อาจเชื่อมต่อ API)
    console.log("Processing Payment", { amount, cardNumber, expiryDate, cvv });
    alert("Payment successful!");
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
          {/* TopBar */}
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <TopBar textColor={"white"} />
            </div>
          </div>

          {/* Payment Form */}
          <Box
            sx={{
              maxWidth: "600px",
              margin: "50px auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              padding: "30px",
            }}
          >
            <Typography variant="h4" textAlign="center" gutterBottom>
              Payment Gateway
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <TextField
                label="Card Number"
                variant="outlined"
                fullWidth
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />

              <Box display="flex" gap={2}>
                <TextField
                  label="Expiry Date (MM/YY)"
                  variant="outlined"
                  fullWidth
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                <TextField
                  label="CVV"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}
