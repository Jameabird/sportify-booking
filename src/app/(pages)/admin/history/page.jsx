"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components"; /* npm install styled-components */
import { users } from "@app/(pages)/admin/history/Users";
import "@app/(pages)/admin/history/CssHistory.css";
import { Search } from "lucide-react";
const TopBar_Admin = dynamic(() => import("@components/Topbar_Admin"), {
  ssr: false,
});

const HistoryPageAdmin = () => {
  const [statusFilter, setStatusFilter] = useState("refund");
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    setUsersData(users);
  }, []);

  const filteredByStatus =
    statusFilter === "all"
      ? usersData
      : usersData.filter((user) => user.status === statusFilter);

  const filteredUsers = filteredByStatus.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <TopBar_Admin textColor={"blue"} />
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
              <option value="refund">Refund</option>
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-300">
                    <td>{user.name}</td>
                    <td>{user.day}</td>
                    <td>{user.time}</td>
                    <td>{user.email}</td>
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

export default HistoryPageAdmin;
