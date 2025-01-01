"use client";
import { Box, IconButton, useTheme, styled, Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const TopBar_Admin = (props) => {
  const currentPath = usePathname();
  console.log("currentPath", currentPath);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)", // สีโปร่งใส
        backdropFilter: "blur(7px)", // เบลอพื้นหลัง
        WebkitBackdropFilter: "blur(7px)", // Safari
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)"
        
      }}
    >
      <Box
        component="div"
        display="flex"
        // bgcolor={"red"}
        borderRadius="3px"
      >
        <div className="text-3xl font-bold flex pl-10">
          <div style={{color:props.textColor}}>SPORTIFY</div>
          <div className="pl-2 text-orange-500">BOOKING</div>
        </div>
      </Box>
      <Box display="flex">
        <Link href="/admin">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              color: currentPath === "/admin" ? "orange":props.textColor,
              cursor: "pointer" ,
              "&:hover": {
                    color: "#868dfb ",
                  },
            }}
          >
            <div className="font-bold text-xl">
              Home
              </div>
          </Box>
        </Link>
        <Link href="/admin/category">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              cursor: "pointer" ,
              color: currentPath === "/admin/category" ? "orange" : props.textColor,
              //WebkitTextStroke: "px black",
              "&:hover": {
                color: "#868dfb ",
              },
            }}
          >
            <div className="font-bold text-xl">Category</div>
          </Box>
        </Link>
        <Link href="/admin/history">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              cursor: "pointer",
              color: currentPath === "/admin/history" ? "orange" : props.textColor,
              "&:hover": {
                color: "#868dfb ",
              },
            }}
          >
            <div className="font-bold text-xl">History</div>
          </Box>
        </Link>
        {/* <Link href="/">
          <Box
            sx={{
              padding: "0 10px",
              paddingTop: "4px",
              cursor: "pointer",
              paddingRight: "50px",
              color: currentPath === "/admin" ? "orange" : props.textColor,
              "&:hover": {
                color: "#868dfb ",
              },
            }}
          >
            <div className="font-bold text-xl">Admin</div>
          </Box>
        </Link> */}
        <Box sx={{ padding: "0 3px" }}>
          <Button variant="contained" color="primary">
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default TopBar_Admin;
