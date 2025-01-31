"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@components/Topbar";
import { Box, Button } from "@mui/material";
import { mockBuilding, mockDataCourt, mockCourt } from "./mockdata";
import Header from "@components/Header";
import Image from "next/image";
import badminton_img from "@assets/badminton.png";
import { data } from "autoprefixer";

const Booking = () => {
  const [currentBuilding, setCurrentBuilding] = useState("Building1");
  const [currentCourt, setCurrentCourt] = useState("Court1");
  const [courtNames, setCourtNames] = useState([]);
  const [CourtData, setCourtData] = useState([]);
  const [SelectCourt, setSelectCourt] = useState("ALL");
  const placeName = sessionStorage.getItem("booking_place");

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

  // console.table(CourtData);

  return (
    <div className="absolute top-0 left-0 h-full w-full bg-cover bg-center">
      <TopBar textColor={"black"} />
      <main className="container m-10">
        <div className="grid grid-rows-auto gap-2">
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <Header title="Booking" textColor={"black"} />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex justify-center items-center">
              <Box
                sx={{
                  // backgroundColor: "#e8e6e6",
                  backgroundColor: "#f2f0f0",
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div className="m-3">
                  <Image
                    src={badminton_img}
                    alt="Loading"
                    style={{
                      width: "450px",
                      height: "300px",
                      objectFit: "contain"
                    }}
                  />
                </div>
              </Box>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 pt-8">
            <div>
              <div className="text-xl pt-1 col-span-1 font-bold text-black">
                Date :
              </div>
            </div>
          </div>
          <div className="grid grid-cols-9 gap-2 pt-8">
            <div className="text-xl pt-1 col-span-1 font-bold text-black">
              Building Name :
            </div>
            <div className="col-span-8 grid grid-cols-12 gap-4 ">
              {mockBuilding.map((data, index) =>
                <div key={index} className="col-span-1">
                  <Button
                    variant="contained"
                    // color= {currentBuilding === data ? "success" :"#bdbdbd"}
                    disabled={!data.booking}
                    sx={{
                      fontSize: "14px",
                      borderRadius: "10px",
                      backgroundColor:
                        data.booking && currentBuilding === data.name
                          ? "primary"
                          : data.booking && currentBuilding !== data.name
                            ? "success.main"
                            : "#bdbdbd"
                    }}
                    onClick={() => handleClickedBuilding(data)}
                  >
                    {data.name}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {courtNames.length > 0 &&
            <div className="grid grid-cols-10 gap-2 pt-8">
              <div className="text-xl pt-1 col-span-1 font-bold text-black">
                Court Name :
              </div>
              <div className="col-span-8 grid grid-cols-12 gap-4 ">
                {courtNames.map((data, index) =>
                  <div key={index} className="col-span-1">
                    <Button
                      variant="contained"
                      disabled={!data.booking}
                      sx={{
                        fontSize: "14px",
                        borderRadius: "10px",
                        backgroundColor:
                          data.booking && currentCourt === data.name
                            ? "primary"
                            : data.booking && currentCourt !== data.name
                              ? "success.main"
                              : "#bdbdbd"
                      }}
                      onClick={() => handleClickedCourt(data)}
                    >
                      {data.name}
                    </Button>
                  </div>
                )}
              </div>
            </div>}
        </div>
      </main>
    </div>
  );
};

export default Booking;
