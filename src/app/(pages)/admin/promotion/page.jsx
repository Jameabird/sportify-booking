"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { promotion } from "@app/(pages)/admin/promotion/Promotion";
import "@app/(pages)/admin/promotion/CssPromotion.css";
import { Edit, Trash, Search } from "lucide-react";
const TopBar_Admin = dynamic(() => import("@components/Topbar_Admin"), {
  ssr: false,
});

const HistoryPageAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [promotionsData, setPromotionsData] = useState(promotion);
  const [newPromotions, setNewPromotions] = useState({    
    name:"",
    description:"",
    status:"",
    startdate:"",
    enddate:"",
    amount:"",
    usage:"", 
  });
  const [showModal, setShowModal] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleCancel = () => {
    setShowModal(false); 
    setNewPromotions({
      id: "",
      name:"",
      description:"",
      status:"",
      startdate:"",
      enddate:"",
      amount:"",
      usage:"",   
    }); 
    setIsEditMode(false); 
  };

  const handleAddUser = () => {
    const newId = promotionsData.length + 1;
    setPromotionsData([
      ...promotionsData,
      { ...newPromotions, id: newId, number: newId } 
    ]);
    setNewPromotions({
      id: "",
      name:"",
      description:"",
      status:"",
      startdate:"",
      enddate:"",
      amount:"",
      usage:"",   
    });
    setShowModal(false);
  };
  const handleEdit = (id) => {
    const promotionToEdit = promotionsData.find(promo => promo.id === id);
    setNewPromotions(promotionToEdit);
    setIsEditMode(true); 
    setShowModal(true);
  };
  
  const handleUpdate = () => {
    const updatedPromotions = promotionsData.map(promotion => 
      promotion.id === newPromotions.id ? { ...promotion, ...newPromotions } : promotion
    );
    setPromotionsData(updatedPromotions); 
    setShowModal(false); 
    setIsEditMode(false); 
    setNewPromotions({
      id: "",
      name:"",
      description:"",
      status:"",
      startdate:"",
      enddate:"",
      amount:"",
      usage:"",   
    });
  };

  const handleDelete = (id) => {
    const filteredData = promotionsData.filter(promotion => promotion.id !== id);
    setPromotionsData(filteredData); 
  };

  return (
    <>
      <TopBar_Admin textColor={"black"} />
      <div className="background-page">
        <div className="filter-and-search">
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="flex-row-button"
            >
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
                  <th>number</th>
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
                {filteredUsers.map((promotion, index) => (
                  <tr key={promotion.id} className="hover:bg-blue-300">
                    <td>{index + 1}</td>
                    <td>{promotion.name}</td>
                    <td>{promotion.description}</td>
                    <td>{promotion.status}</td>
                    <td>{promotion.startdate}</td>
                    <td>{promotion.enddate}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(promotion.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{isEditMode ? "Edit Promotion" : "Add Promotion"}</h3>
              <input
                type="text"
                placeholder="Name"
                value={newPromotions.name}
                onChange={(e) =>
                  setNewPromotions({ ...newPromotions, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={newPromotions.description}
                onChange={(e) =>
                  setNewPromotions({ ...newPromotions, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Status"
                value={newPromotions.status}
                onChange={(e) =>
                  setNewPromotions({ ...newPromotions, status: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Start date"
                value={newPromotions.startdate}
                onChange={(e) =>
                  setNewPromotions({ ...newPromotions, startdate: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="End date"
                value={newPromotions.enddate}
                onChange={(e) =>
                  setNewPromotions({
                    ...newPromotions,
                    location: e.target.value,
                  })
                }
              />              
              <input
                type="text"
                placeholder="Discount Amount"
                value={newPromotions.amount}
                onChange={(e) =>
                  setNewPromotions({ ...newPromotions, amount: e.target.value })
                }
              />
               <input
                type="text"
                placeholder="Usage Limit"
                value={newPromotions.usage}
                onChange={(e) =>
                  setNewPromotions({ ...newPromotions, usage: e.target.value })
                }
              />                
              <div className="modal-buttons">
              <button onClick={isEditMode ? handleUpdate : handleAddUser}>
                  {isEditMode ? "Update" : "Save"}
                </button>
                <button onClick={handleCancel}>Cancel</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPageAdmin;
