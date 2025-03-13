"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Search.css";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import provinces from "../provinces";
import { Snackbar, Alert } from "@mui/material";

function SearchPages() {
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4010/api/buildings");
        console.log("✅ Buildings data received:", res.data);

        const archerBuildings = res.data.filter(
          (item) => item.Type === "Archer"
        );

        setBuildings(archerBuildings);
      } catch (error) {
        console.error(
          "🚨 Error fetching buildings:",
          error.response?.data || error.message
        );
        setError(error.response?.data?.message || "Failed to load buildings");
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000); // เปลี่ยนหน้าไป /login หลังจาก snackbar หายไป
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const filteredBuildings = buildings.filter(
    (building) =>
      (selectedProvince === "" || building.location === selectedProvince) &&
      building.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <TopBar />
      <div className="container">
        <div className="main-content">
          <div className="left-column">
            <div className="map-container">
              <img
                src="https://www.prachachat.net/wp-content/uploads/2023/08/Google-Maps.png"
                alt="Map Preview"
              />
            </div>

            <select
              className="province-dropdown"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">All Provinces</option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div className="right-column">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <div className="place-list">
                {filteredBuildings.map((building, index) => (
                  <div className="place-card" key={index}>
                    <img
                      src={building.image}
                      alt={building.name}
                      className="place-image"
                    />
                    <div className="place-details">                     
                      <h3 className="place-name">{building.name}</h3>
                      <p className="place-details-description">
                        {building.details}
                      </p>
                      <p className="place-link">
                        <a
                          href={building.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {building.link}
                        </a>
                      </p>
                    </div>

                    <div>
                      <button
                        className="book-button"
                        onClick={handleOpenSnackbar}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Snackbar for message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // จะหายไปหลังจาก 2 วินาที
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          โปรดสมัครเข้าใช้งาน/เข้าสู่ระบบการจองสนามกีฬา
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SearchPages;
