"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "@app/(pages)/owner/history/CssHistory.css";
import axios from "axios"; // ✅ Import axios

import { Search } from "lucide-react";
const TopBar_Owner = dynamic(() => import("@components/Topbar_Owner"), {
  ssr: false,
});

const HistoryPageOwner = () => {
  const [statusFilter, setStatusFilter] = useState("reserve");
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData ? tokenData.token : null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      console.log("Token is missing or expired.");
      setError("Token is missing or expired. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("✅ Token is valid:", token);
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4003/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ User data received:", res.data);
        setUsersData(res.data); 
      } catch (error) {
        console.error(
          "🚨 Error fetching user data:",
          error.response?.data || error.message
        );
        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredByStatus =
    statusFilter === "all"
      ? usersData.filter((user) => user.status !== "refund") 
      : usersData.filter((user) => user.status === statusFilter);

      const collator = new Intl.Collator("th", { numeric: true, sensitivity: "base" });

      const filteredUsers = filteredByStatus
        .filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => collator.compare(a.name, b.name)); 
      
    

  useEffect(() => {
    const adjustScrollBar = () => {
      const tblContent = document.querySelector(".tbl-content");
      const tblHeader = document.querySelector(".tbl-header");
      if (tblContent && tblHeader) {
        const scrollWidth = tblContent.offsetWidth - tblContent.scrollWidth;
        tblHeader.style.paddingRight = `${scrollWidth}px`;
      }
    };

    adjustScrollBar();
    window.addEventListener("resize", adjustScrollBar);

    return () => window.removeEventListener("resize", adjustScrollBar);
  }, []);

  return (
    <>
      <TopBar_Owner textColor={"black"} />
      <div className="background-page">
        <div className="filter-and-search">
          <div className="DropDown">
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-row-button"
            >
              <option value="all">All</option>
              <option value="reserve">Reserve</option>
              <option value="cancel">Cancel</option>
            </select>
          </div>
          <div className="SearchBox flex items-center gap-2">
            <label htmlFor="search">Search name: </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter name..."
                className="search-input pl-10 border border-gray-300 rounded-md py-2 px-3 text-center "
              />
            </div>
          </div>
        </div>

        {/* ✅ แสดง loading หรือ error */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <section>
          <div className="tbl-header">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-blue-300">
                    <td>{user.name}</td>
                    <td>{user.day}</td>
                    <td>{user.time}</td>
                    <td>{user.user?.email || user.owner?.email || "N/A"}</td>
                    <td>{user.location}</td>
                    <td>{user.price}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default HistoryPageOwner;
