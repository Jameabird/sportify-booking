"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TopBar from "@components/Topbar";
import "@app/globals.css";

const pieData1 = [
  { name: "แบดมินตัน", value: 45 },
  { name: "สระว่ายน้ำ", value: 30 },
  { name: "สนามฟุตบอล", value: 25 },
];

const pieData2 = [
  { name: "เทนนิส", value: 40 },
  { name: "แบดมินตัน", value: 35 },
  { name: "กอล์ฟ", value: 25 },
];

const barData = [
  { name: "January", Income: 65, Expense: 21 },
  { name: "February", Income: 48, Expense: 45 },
  { name: "March", Income: 81, Expense: 19 },
  { name: "April", Income: 96, Expense: 27 },
  { name: "May", Income: 59, Expense: 29 },
  { name: "June", Income: 100, Expense: 47 },
  { name: "July", Income: 100, Expense: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const currentYear = 2025;

const renderCustomLabel = ({ name, percent }) => {
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

export default function Dashboard() {
  return (
    
    <div className="app" style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <main className="content" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <TopBar textColor="black" />
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: "20px" }}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000", textAlign: "center" }}>
                3 อันดับ สนามที่มีคนจองเยอะที่สุดในปี {currentYear}
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderCustomLabel}
                  >
                    {pieData1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000", textAlign: "center" }}>
                3 อันดับ สนามที่มีคนยกเลิกการจองเยอะที่สุดในปี {currentYear}
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData2}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderCustomLabel}
                  >
                    {pieData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ marginTop: "20px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          <Card sx={{ boxShadow: 3, padding: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000", textAlign: "center" }}>
              แสดงยอดเงินเข้าและออกของปี {currentYear}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#8884d8" />
                <Bar dataKey="Expense" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card sx={{ boxShadow: 3, textAlign: "center", padding: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000" }}>
              จำนวนเงินที่เข้าแพลตฟอร์มในปี {currentYear}
            </Typography>
            <Typography variant="h4" color="#000000"  sx={{ mt: 2, fontWeight: "bold", color: "#000000"}}>
              3,500,000 บาท
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#000000" ,mt:"70px" }}>
              คืนเงินให้ลูกค้าจากการยกเลิกการจองในปี {currentYear}
            </Typography>
            <Typography variant="h4" color="#000000"  sx={{fontWeight: "bold",mt: 2}}>
              100,000 บาท
            </Typography>
          </Card>
        </Box>
      </main>
    </div>
  );
}