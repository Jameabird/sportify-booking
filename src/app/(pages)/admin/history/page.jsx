"use client";

import React, { useState, useMemo } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import styled from "styled-components"; /* npm install styled-components */
import { users } from "@app/(pages)/admin/history/Users";
import "@app/(pages)/admin/history/CssHistory.css";

/*--------------Background --------------------*/
const Background = styled.div`
  background-image: url("/gym_bg2.jpg");
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  /*---------------------- Table ------------------------- */
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

  /*----------------- End Table ------------------------- */
  return (
    <>
      <Background />
      <ContentWrapper>
        <TopBar_Admin textColor={"white"} />
        {/*-------------------------- Table ------------------------------- */}

        <h1>History Table</h1>
        <div className="DropDown">
          <label htmlFor="status">Filter by Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-row-button"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="vacation">Vacation</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table-auto">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Team</th>
                <th>Status</th>
                <th>Age</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-300">
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.team}</td>
                  <td>{user.status}</td>
                  <td>{user.age}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*-------------------------- End Table ------------------------------- */}
      </ContentWrapper>
    </>
  );
};

export default HistoryPageAdmin;
