"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@components/Topbar";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  TextField,
  TablePagination,
  TableSortLabel
} from "@mui/material";
import { mockBuilding, mockDataCourt, mockCourt } from "./mockdata";
import Header from "@components/Header";
import Image from "next/image";
import badminton_img from "@assets/badminton.png";
import { data } from "autoprefixer";
import { Dropdown, DatePicker, Space } from "antd";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";

const Booking = () => {
  const [buildingNames, setBuildingNames] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState("Building1");
  const [currentCourt, setCurrentCourt] = useState("Court1");
  const [courtNames, setCourtNames] = useState([]);
  const [CourtData, setCourtData] = useState([]);
  const placeName = sessionStorage.getItem("booking_place");
  const SportType = sessionStorage.getItem("SportType");
  const [selectedDate, setSelectedDate] = useState(null);
  const [getSearch, setSearch] = useState(true);

  // console.log(placeName);

  useEffect(() => {
    if (mockBuilding.length > 0) {
      setBuildingNames(mockBuilding);
    }
  }, []);

  useEffect(
    () => {
      if (getSearch) {
        setCourtData([]);
        setCourtNames([]);
        const current = mockBuilding.find(
          building => building.name === currentBuilding
        );

        if (current && !current.booking) {
          const nextAvailable = mockBuilding.find(building => building.booking);

          if (nextAvailable) {
            setCurrentBuilding(nextAvailable.name);
          }
        }

        // Filter ข้อมูลจาก currentBuilding
        if (currentCourt === "ALL") {
          const filteredCoortData = mockDataCourt.filter(
            item => item.building === currentBuilding
          );
          setCourtData(filteredCoortData);
        } else {
          const filteredCoortData = mockDataCourt.filter(
            item =>
              item.building === currentBuilding && item.name === currentCourt
          );
          setCourtData(filteredCoortData);
        }

        const filteredCoortName = mockCourt.filter(
          item => item.building === currentBuilding
        );

        setCourtNames(filteredCoortName);
        // console.log(filteredCoortName);
        setSearch(false);
      }
    },
    [currentBuilding, getSearch]
  );

  useEffect(
    () => {
      if (courtNames.length > 0) {
        const current = courtNames.find(court => court.name === currentCourt);

        if (current && !current.booking) {
          const nextAvailable = courtNames.find(court => court.booking);

          if (nextAvailable) {
            setCurrentCourt(nextAvailable.name);
          }
        }
      }
    },
    [courtNames]
  );

  const changeDate = date => {
    // console.log(date);
    setSelectedDate(dayjs(date).format("DD-MM-YYYY"));
  };

  const itemsBuilding = buildingNames.map((val, index) => ({
    key: (index + 1).toString(),
    onClick: () => setCurrentBuilding(val.name),
    label: val.name,
    icon: <MapsHomeWorkIcon />,
    disabled: !val.booking
  }));

  const itemsCourt = courtNames.map((val, index) => ({
    key: (index + 1).toString(),
    onClick: () => setCurrentCourt(val.name),
    label: val.name,
    icon: <SportsTennisIcon />,
    disabled: !val.booking
  }));

  // console.log(CourtData);
  // console.log(courtNames);

  return (
    <div className="absolute top-0 left-0 h-full w-full bg-cover bg-center">
      <TopBar textColor={"black"} />
      <Box
        sx={{
          height: "550px"
        }}
      >
        <div
          className="absolute w-full bg-cover bg-center"
          style={{
            // backgroundColor: "#a2d8f5",
            backgroundImage: "url('/assets/badminton.png')",
            backgroundColor: "rgba(70, 80, 100, 0.3)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            height: "550px"
          }}
        >
          <main className="container">
            <div className="pt-3 pl-5 h-40">
              {/* <div className="font-medium text-white">
              {`Home > ${SportType} > ${placeName} > Booking`}
            </div> */}
              <div
                className="grid grid-rows-auto gap-2 align-center justify-center items-center"
                style={{ paddingTop: "130px" }}
              >
                <div className="grid grid-cols-11 gap-2" />
              </div>
            </div>
            <div />
          </main>
        </div>
        {/* Main Content */}
        <div>
          <div className="col-start-4 col-span-4">
            <Box
              sx={{
                // border: "1px solid black",
                borderRadius: "30px",
                padding: "5px",
                backgroundColor: "white",
                display: "flex",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div className="pl-2 py-1">
                <Space direction="vertical">
                  <DatePicker
                    style={{ border: "none" }}
                    onChange={changeDate}
                  />
                </Space>
              </div>
              <div className="pl-3 text-2xl font-light">|</div>
              <div className="pl-3 pt-2.5 text-sm">
                <Dropdown menu={{ items: itemsBuilding }}>
                  <Space>
                    {currentBuilding}
                    <div className="pl-20 text-xs">
                      <DownOutlined />
                    </div>
                  </Space>
                </Dropdown>
              </div>
              <div className="pl-3 text-2xl font-light">|</div>
              <div className="pl-3 pt-2.5 text-sm">
                <Dropdown menu={{ items: itemsCourt }}>
                  <Space>
                    {currentCourt}
                    <div className="pl-20 text-xs">
                      <DownOutlined />
                    </div>
                  </Space>
                </Dropdown>
              </div>
            </Box>
          </div>

          <div className="col-span-1 pl-3 pt-1">
            <Button
              sx={{
                backgroundColor: "#051f2e",
                borderRadius: "30px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2f6380"
                },
                textTransform: "none"
              }}
              onClick={() => setSearch(true)}
            >
              <div className="px-4 py-1 font-semibold">Search</div>
            </Button>
          </div>
        </div>
      </Box>
      {/* <div className="m-6">
        <div className="flex items-center align-center justify-center">
          <Box
            sx={{
              width: "720px",
              height: "500px"
            }}
          >
            <Image
              src={badminton_img}
              alt="sport_img"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "20px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
              }}
            />
          </Box>
        </div>
        <div className="pt-10">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-start-2 col-span-3">
              <div className="text-3xl font-bold text-black">Court 1</div>
              <div className="text-md font-medium text-black">
                {`${placeName}, ${currentBuilding}, ${SportType}`}
              </div>
            </div>
          </div>
        </div> */}
      {/* Table */}
      {/* <div className="pt-6">Test</div>
      </div> */}
    </div>
  );
};

export default Booking;
