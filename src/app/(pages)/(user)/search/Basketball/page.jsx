"use client";
import React, { useState } from "react";
import "./Search.css";
import places from "./places";
// import TopBar from "../../../components/Topbar";
import TopBar_User from "@components/Topbar_User";
import { useRouter } from "next/navigation";

function SearchPages() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (placeName) => {
    // console.log(placeName);
    sessionStorage.setItem("booking_place", placeName);
    router.push("/booking/bookingbasketball");
  }

  return (
    <div>
      <TopBar_User />
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
                    <h3 className="place-name">
                      {place.name}
                    </h3>
                  </div>
                  <button className="book-button" onClick={() => handleBook(place.name)}>Book</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPages;
