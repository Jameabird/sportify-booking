import React from "react";
import "./DeletePopup.css";

const DeletePopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-popup-overlay">
      <div className="delete-popup-container">
        <div>
          <img
            src="/delete-icon.png" // ใส่ path รูปไอคอน
            alt="Delete Icon"
            className="delete-popup-icon"
          />
        </div>
        <h3>Are you sure you want to delete?</h3>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button className="delete-popup-save-btn" onClick={onConfirm}>
            Save
          </button>
          <button className="delete-popup-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
