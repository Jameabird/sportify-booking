"use client";

import React, { useState } from "react";
import detailpopup from "./AdminPopup"; 

const UpdateField = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupVisible(true); 
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); 
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>จัดการสนามกีฬา</h1>
      <button
        onClick={handleOpenPopup}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        เพิ่มสนาม
      </button>

      {isPopupVisible && <AdminPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default updatefield;
