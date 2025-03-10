"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Search.css";
import TopBar_User from "@components/Topbar_User";
import { useRouter } from "next/navigation";
import provinces from "../provinces";

function SearchPages() {
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 📌 ฟังก์ชันดึงข้อมูลจากเซิร์ฟเวอร์
  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData ? tokenData.token : null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      console.log("❌ Token is missing or expired.");
      setError("Token is missing or expired. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("✅ Token is valid:", token);
    const fetchBuildings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4005/api/buildings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Buildings data received:", res.data);

        // 🔹 กรองข้อมูลให้เหลือเฉพาะ Type "Archer"
        const archerBuildings = res.data.filter((item) => item.Type === "Carracing");
        
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

  // 📌 ฟิลเตอร์ตามจังหวัดและคำค้นหา
  const filteredBuildings = buildings.filter(
    (building) =>
      (selectedProvince === "" || building.location === selectedProvince) &&
      building.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <TopBar_User />
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
                    <div className="place-details">
                      <img
                        src={building.image}
                        alt={building.name}
                        className="place-image"
                      />
                      <h3 className="place-name">{building.name}</h3>
                    </div>
                                       
                    <div>
                      <button
                        className="book-button"
                        onClick={() => router.push("/booking/bookingcarracing")}
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
    </div>
  );
}

export default SearchPages;
