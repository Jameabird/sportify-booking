"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@components/Topbar";
import { Box, Button } from "@mui/material";
import { mockBuilding, mockDataCort } from "./mockdata";

const Booking = () => {
  const [currentBuilding, setCurrentBuilding] = useState("Building1");
  const [CortNames, setCortNames] = useState([]);
  const placeName = sessionStorage.getItem("booking_place");

  useEffect(
    () => {
      setCortNames([]);
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
      const filteredCortData = mockDataCort.filter(
        item => item.building === currentBuilding
      );

      // สร้างผลลัพธ์ของชื่อที่ไม่ซ้ำ
      const uniqueCortNames = filteredCortData
        .map(item => item.name)
        .filter((value, index, self) => self.indexOf(value) === index);

      setCortNames(uniqueCortNames);
    },
    [currentBuilding]
  );

  const handleClickedBuilding = building => {
    setCurrentBuilding(building);
  };

  console.log(CortNames);

  return (
    <div className="app">
      <TopBar />
      <main className="container pt-3 m-3">
        <div className="grid grid-rows-auto gap-2">
          <div className="grid grid-cols-9 gap-2">
            <div className="text-xl pt-1 col-span-1 font-bold">
              Building Name :
            </div>
            <div className="col-span-8 grid grid-cols-12 gap-4 ">
              {mockBuilding.map((data, index) =>
                <div key={index} className="col-span-1">
                  <Button
                    variant="contained"
                    // color= {currentBuilding === data ? "success" :"#bdbdbd"}
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
                    onClick={() => handleClickedBuilding(data.name)}
                  >
                    {data.name}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div>test</div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
