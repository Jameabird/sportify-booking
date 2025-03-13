"use client";
import React, { useState } from "react";
import "./Search.css";
import places from "./places";
import TopBar from "@components/Topbar";
import { useRouter } from "next/navigation";
import { Snackbar } from "@mui/material"; // นำเข้า Snackbar
import { Alert } from "@mui/material"; // นำเข้า Alert

function SearchPages() {
  const [search, setSearch] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // สถานะในการเปิด/ปิด Snackbar
  const router = useRouter();

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (placeName) => {
    // แสดง snackbar ก่อนที่จะไปที่หน้า login
    setOpenSnackbar(true);
    sessionStorage.setItem("booking_place", placeName);
    setTimeout(() => {
      router.push("/login"); // ไปที่หน้า login หลังจากแสดง snackbar
    }, 2000); // รอ 2 วินาที
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <TopBar />
      <div className="container">
        <h2 className="header">Your location: Sriracha</h2>
        <div className="main-content">
          <div className="left-column">
            <div className="map-container">
              <img
                src="https://www.prachachat.net/wp-content/uploads/2023/08/Google-Maps.png"
                alt="Map Preview"
              />
            </div>
            <input
              type="text"
              className="search-bar"
              placeholder="Text search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="right-column">
            <div className="place-list">
              {filteredPlaces.map((place, index) =>
                <div className="place-card" key={index}>
                  <div className="place-details">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="place-image"
                    />
                   <div className="place-details">                     
                      <h3 className="place-name">
                        <strong>🏠 Sports Venue: </strong> 
                        {building.name}</h3>
                      <p className="place-details-description">
                      <strong>📍 Location: </strong>
                        {building.details}
                      </p>
                      <p >
                      <strong>🗺️  Link location: </strong>
                        <a
                          href={building.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="place-link"
                        >                           
                          {building.link}
                        </a>
                      </p>
                    </div>
                  </div>
                  <button className="book-button" onClick={() => handleBook(place.name)}>Book</button>
                </div>
              )}
            </div>
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
          โปรคสมัครเข้าใช้งาน/เข้าสู่ระบบการจองสนามกีฬา
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SearchPages;
