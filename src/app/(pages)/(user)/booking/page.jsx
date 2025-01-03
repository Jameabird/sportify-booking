"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@components/Topbar";
import { Box, Button } from "@mui/material";
import { mockBuilding, mockDataCourt, mockCourt } from "./mockdata";
import Header from "@components/Header";
import Image from "next/image";
import badminton_img from "@assets/badminton.png";
import { data } from "autoprefixer";
import { Dropdown, DatePicker, Space } from "antd";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

const Booking = () => {
  const [currentBuilding, setCurrentBuilding] = useState("Building1");
  const [currentCourt, setCurrentCourt] = useState("Court1");
  const [courtNames, setCourtNames] = useState([]);
  const [CourtData, setCourtData] = useState([]);
  const [SelectCourt, setSelectCourt] = useState("ALL");
  const placeName = sessionStorage.getItem("booking_place");
  const SportType = sessionStorage.getItem("SportType");
  const [selectedDate, setSelectedDate] = useState(null);

  // console.log(placeName);

  useEffect(
    () => {
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
      if (SelectCourt === "ALL") {
        const filteredCoortData = mockDataCourt.filter(
          item => item.building === currentBuilding
        );
        setCourtData(filteredCoortData);
      } else {
        const filteredCoortData = mockDataCourt.filter(
          item => item.building === currentBuilding && item.name === SelectCourt
        );
        setCourtData(filteredCoortData);
      }

      const filteredCoortName = mockCourt.filter(
        item => item.building === currentBuilding
      );

      setCourtNames(filteredCoortName);
      // console.log(filteredCoortName);
    },
    [currentBuilding]
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

  const handleClickedBuilding = building => {
    if (building.booking) {
      setCurrentBuilding(building.name);
    }
  };
  const handleClickedCourt = court => {
    if (court.booking) {
      setCurrentCourt(court.name);
    }
  };

  const changeDate = date => {
    console.log(date);
    setSelectedDate(dayjs(date).format("DD-MM-YYYY"));
  };

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      )
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      ),
      disabled: true
    },
    {
      key: "4",
      danger: true,
      label: "a danger item"
    }
  ];

  return (
    <div className="absolute top-0 left-0 h-full w-full bg-cover bg-center">
      <TopBar textColor={"black"} />
      <div style={{ backgroundColor: "#a2d8f5" }}>
        <main className="container">
          <div className="pt-3 pl-5 h-40">
            <div className="font-medium">
              {`Home > ${SportType} > ${placeName} > Booking`}
            </div>
            <div className="grid grid-rows-auto gap-2 pt-7">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-start-4 col-span-5">
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
                      <Dropdown menu={{ items }}>
                        <Space>
                          Select Building
                          <div className="pl-20 text-xs">
                            <DownOutlined />
                          </div>
                        </Space>
                      </Dropdown>
                    </div>
                    <div className="pl-3 text-2xl font-light">|</div>
                    <div className="pl-3 pt-2.5 text-sm">
                      <Dropdown menu={{ items }}>
                        <Space>
                          Select Court
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
                  >
                    <div className="px-4 py-1 font-semibold">Search</div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div />
        </main>
      </div>
      {/* Main Content */}
      <div className="m-6">
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
      </div>
    </div>
  );
};

export default Booking;
