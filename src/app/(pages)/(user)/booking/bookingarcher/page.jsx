"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TopBar_User from "@components/Topbar_User";

const ArcherBooking = () => {
  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  // ✅ Fetch Data from API and Filter Type "Archer"
  useEffect(() => {
    axios
      .get("http://localhost:5005/api/buildings") // ✅ Ensure correct API route
      .then((response) => {
        console.log("API Response:", response.data);

        let archerData = response.data;

        // ✅ Handle API returning an array
        if (Array.isArray(response.data)) {
          archerData = response.data.find((item) => item.Type === "Archer");
        }

        if (archerData && archerData.Type === "Archer") {
          setData(archerData.Building);
          setSelectedBuilding(Object.keys(archerData.Building)[0]); // Auto-select first building
        } else {
          console.error("⚠️ No Archer data found.");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
      });
  }, []);

  // Function to handle checkbox selection
  const handleCheckboxChange = (field) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ✅ Clear only checkboxes (keep date & building selection)
  const handleClear = () => {
    setSelectedCheckboxes({}); // Clears all checkboxes but keeps other selections
  };

  // ✅ Handle Booking Button Click
  const handleBooking = () => {
    const selectedCourts = Object.keys(selectedCheckboxes).filter(
      (field) => selectedCheckboxes[field]
    );

    if (!selectedDate) {
      alert("❌ Please select a date.");
      return;
    }
    if (!selectedBuilding) {
      alert("❌ Please select a building.");
      return;
    }
    if (selectedCourts.length === 0) {
      alert("❌ Please select at least one court.");
      return;
    }

    console.log("✅ Booking confirmed:");
    console.log("📅 Date:", selectedDate);
    console.log("🏢 Building:", selectedBuilding);
    console.log("🎯 Courts:", selectedCourts);
    
    alert("✅ Booking successful!");
  };

  return (
    <div className="w-full">
      {/* Top Navigation */}
      <TopBar_User textColor={"black"} />

      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-center h-[300px] flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/assets/Archer/Archer1.png')",
          backgroundBlendMode: "multiply",
          opacity: 0.9,
        }}
      >
        <h1 className="text-4xl font-bold shadow-lg">Archer Booking</h1>
      </div>

      {/* Booking Controls */}
      <div className="max-w-5xl mx-auto mt-5 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {/* Date Input */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />

          {/* Building Dropdown */}
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {Object.keys(data).map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Booking Table */}
      <div className="max-w-5xl mx-auto mt-5">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-300 text-black">
              <th className="p-2">Select</th>
              <th className="p-2">Court</th>
              <th className="p-2">Price</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {data[selectedBuilding] &&
              Object.entries(data[selectedBuilding]).map(([field, details]) => (
                <tr key={field} className="border-b text-center">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selectedCheckboxes[field]} // Bind checkbox to state
                      onChange={() => handleCheckboxChange(field)}
                      disabled={!details.Booking}
                    />
                  </td>
                  <td className="p-2">{field}</td>
                  <td className="p-2">{details.Price}</td>
                  <td className="p-2">{details.Time}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-5">
        <button
          onClick={handleBooking} // ✅ Booking button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md"
        >
          Booking
        </button>
        <button
          onClick={handleClear} // ✅ Clear button
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ArcherBooking;
