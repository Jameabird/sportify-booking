"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { promotion } from "@app/(pages)/admin/promotion/Promotion";
import "@app/(pages)/admin/promotion/CssPromotion.css";
import { Search } from "lucide-react";
const TopBar_Admin = dynamic(() => import("@components/Topbar_Admin"), { ssr: false });

const HistoryPageAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [promotionsData, setPromotionsData] = useState(promotion); 
  const [newPromotions, setNewPromotions] = useState({
    id: "",
    name: "",
    day: "",
    time: "",
    email: "",
    location: "",
    price: "",
    status: "refund",
  });
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  useEffect(() => {
    setPromotionsData(promotion);
  }, []);

  const filteredUsers = promotionsData.filter((promotion) =>
    promotion.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleAddUser = () => {
    const newId = promotionsData.length + 1;
    setPromotionsData([
      ...promotionsData,
      { ...newPromotions, id: newId }
    ]);
    setNewPromotions({
      id: "",
      name: "",
      day: "",
      time: "",
      email: "",
      location: "",
      price: "",
      status: "refund",
    });
    setShowModal(false); // Close modal after adding user
  };

  return (
    <>
      <TopBar_Admin textColor={"blue"} />
      <div className="background-page">
        <div className="filter-and-search">
        <div>
        <button onClick={() => setShowModal(true)} className="flex-row-button">
          + Add Promotion
        </button>            
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
                  <th>Description</th>
                  <th>Status</th>
                  <th>start date</th>
                  <th>end date</th>
                  <th>actions</th>                  
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                {filteredUsers.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-blue-300">
                    <td>{promotion.name}</td>
                    <td>{promotion.day}</td>
                    <td>{promotion.time}</td>
                    <td>{promotion.email}</td>
                    <td>{promotion.location}</td>
                    <td>{promotion.price}</td>
                    <td>{promotion.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Promotion</h3>
              <input
                type="text"
                placeholder="Name"
                value={newPromotions.name}
                onChange={(e) => setNewPromotions({ ...newPromotions, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Day"
                value={newPromotions.day}
                onChange={(e) => setNewPromotions({ ...newPromotions, day: e.target.value })}
              />
              <input
                type="text"
                placeholder="Time"
                value={newPromotions.time}
                onChange={(e) => setNewPromotions({ ...newPromotions, time: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newPromotions.email}
                onChange={(e) => setNewPromotions({ ...newPromotions, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                value={newPromotions.location}
                onChange={(e) => setNewPromotions({ ...newPromotions, location: e.target.value })}
              />
              <input
                type="text"
                placeholder="Price"
                value={newPromotions.price}
                onChange={(e) => setNewPromotions({ ...newPromotions, price: e.target.value })}
              />
              <select
                value={newPromotions.status}
                onChange={(e) => setNewPromotions({ ...newPromotions, status: e.target.value })}
              >
                <option value="refund">Refund</option>
                <option value="reserve">Reserve</option>
                <option value="cancel">Cancel</option>
              </select>
              <div className="modal-buttons">
                <button onClick={handleAddUser}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPageAdmin;
