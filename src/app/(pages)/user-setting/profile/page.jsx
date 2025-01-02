"use client";

import React from "react";
import { Box, Avatar, TextField, Button, IconButton, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function Profile() {
 const user = {
   name: "Jennie Lee",
   email: "SE@gmail.com",
   phone: "0123456789",
   bankAccount: "1234567890",
   bankName: "SCB",
 };

 return (
   <Box
     display="flex"
     flexDirection="column"
     height="100vh"
     width="100vw"
     sx={{
       backgroundColor: "#f4f4f4",
     }}
   >
     {/* Top Bar */}
     <Box
 display="flex"
 justifyContent="space-between"
 alignItems="center"
 width="100%"
 p={2}
 sx={{
   backgroundColor: "#d3d3d3",
   borderBottom: "1px solid #ccc",
   position: "fixed",
   top: 0,
   left: 0,
   zIndex: 10,
 }}
>
 {/* โลโก้ */}
 <Typography
   variant="h6"
   sx={{
     fontWeight: "bold",
     textTransform: "uppercase",
     letterSpacing: 1,
   }}
 >
   Training<span style={{ color: "#003366" }}>Studio</span>
 </Typography>

 {/* ปุ่มทั้งหมดชิดขวา */}
 <Box display="flex" justifyContent="flex-end" alignItems="center" gap={3}>
   {["HOME", "CATEGORY", "ADMIN", "HISTORY"].map((item) => (
     <Typography
       key={item}
       sx={{
         fontSize: "14px", // ขนาดของข้อความ
         fontWeight: "500",
         cursor: "pointer",
         color: "#555", // สีข้อความ
         "&:hover": { color: "#000" }, // สีเมื่อ Hover
       }}
     >
       {item}
     </Typography>
   ))}
   <Avatar
     sx={{ bgcolor: "#555", cursor: "pointer" }}
     src="/default-profile.png"
     alt="User"
   />
 </Box>
</Box>

     {/* Main Content */}
     <Box
       display="flex"
       flexDirection="column"
       alignItems="center"
       justifyContent="center"
       flexGrow={1}
       width="100%"
       height="100%"
       sx={{
         paddingTop: "80px",
       }}
     >
       <Box
         display="flex"
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
         width="100%"
         maxWidth="400px"
         sx={{
           backgroundColor: "#fff",
           borderRadius: "8px",
           padding: "20px",
           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
         }}
       >
         {/* Profile Picture */}
         <Box position="relative" textAlign="center" mb={2}>
           <Avatar
             src="/default-profile.png"
             alt="Profile Picture"
             sx={{
               width: "100px",
               height: "100px",
               border: "2px solid #ddd",
               margin: "0 auto",
             }}
           />
           <IconButton
             color="primary"
             sx={{
               position: "absolute",
               bottom: 0,
               right: "calc(50% - 20px)",
               backgroundColor: "#fff",
               boxShadow: 1,
               border: "1px solid #ddd",
             }}
           >
             <CameraAltIcon />
           </IconButton>
         </Box>

         <Typography
           variant="h6"
           sx={{ fontWeight: "bold", marginBottom: "20px" }}
         >
           Edit Profile
         </Typography>

         {/* Form */}
         <Box width="100%" display="flex" flexDirection="column" gap={2}>
           {[
             { label: "Name", value: user.name },
             { label: "Email", value: user.email },
             { label: "Phone", value: user.phone },
           ].map((field, idx) => (
             <TextField
               key={idx}
               label={field.label}
               fullWidth
               value={field.value}
               disabled
               InputProps={{ sx: { fontSize: "14px" } }}
               InputLabelProps={{ sx: { fontSize: "14px" } }}
             />
           ))}

           <Box display="flex" gap={2}>
             <TextField
               label="Bank Account"
               fullWidth
               value={user.bankAccount}
               disabled
               InputProps={{ sx: { fontSize: "14px" } }}
               InputLabelProps={{ sx: { fontSize: "14px" } }}
             />
             <TextField
               label="Bank Name"
               value={user.bankName}
               disabled
               sx={{ width: "100px" }}
               InputProps={{ sx: { fontSize: "14px" } }}
               InputLabelProps={{ sx: { fontSize: "14px" } }}
             />
           </Box>

           {/* Buttons */}
           <Box display="flex" justifyContent="space-between" mt={2}>
             <Button
               variant="contained"
               color="success"
               sx={{ fontSize: "12px", width: "48%" }}
             >
               Change Password
             </Button>
             <Button
               variant="contained"
               color="error"
               sx={{ fontSize: "12px", width: "48%" }}
             >
               Edit
             </Button>
           </Box>
         </Box>
       </Box>
     </Box>
   </Box>
 );
}