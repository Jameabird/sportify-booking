import React, { useState } from "react";
import "./BuildingPopup.css";

const BuildingPopup = ({ onClose, onSave }) => {
  const [buildingName, setBuildingName] = useState("");

  const handleSave = () => {
    onSave(buildingName); 
    onClose(); 
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>อาคาร :</h3>
        <input
          type="text"
          placeholder="กรอกชื่ออาคาร"
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
          className="popup-input"
        />
        <button className="popup-save-btn" onClick={handleSave}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default BuildingPopup;
