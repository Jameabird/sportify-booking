"use client";

import React, { useState } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import styled from "styled-components"; /* npm install styled-components */
import { users } from "@app/(pages)/admin/history/Users";
import "@app/(pages)/admin/history/CssHistory.css";
import { useRadio } from "@nextui-org/react";

/*--------------Background --------------------*/
const Background = styled.div`
  background-image: url("/gym_bg2.jpg");
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;  /* ใช้ min-height แทน height */
  z-index: -1;
`;


const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  color: white;
`;
/*-----------End Background --------------------*/

/*------------- Main Component ------------------*/
const HistoryPageAdmin = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredByStatus =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

  const filteredUsers = filteredByStatus.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Background />
      <ContentWrapper>
        <TopBar_Admin textColor={"white"} />

        <h1>History</h1>

        <div className="filter-and-search">
          {/* -------------------------- Filter by Status ------------ */}
          <div className="DropDown">
            <label htmlFor="status" className="flex-filter">
              Status :
            </label>
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
          {/* ------------------------End Filter by Status ------------ */}

          {/*------------------ Search by Name------------------------- */}
          <div className="SearchBox">
            <label htmlFor="search" className="flex-search">
              Search name :
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name..."
              className="search-input"
            />
          </div>
          {/*------------------ Search by Name------------------------- */}
        </div>

        {/*-------------------------- Table ------------------------------- */}
        <div className="table-container flex-center">
          <table>
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
          {/*-------------------------- End Table ------------------------------- */}
        </div>
      </ContentWrapper>
    </>
  );
};

export default HistoryPageAdmin;
