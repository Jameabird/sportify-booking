import React, { useState } from "react";
import "./detailpopup.css";

const detailpopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (fieldName && status && price) {
      alert(`Field Name: ${fieldName}, Status: ${status}, Price: ${price} Baht/Hr.`);
      setShowPopup(false); 
    } else {
      alert("Please fill in all the fields.");
    }
  };

  return (
    <div className="admin-popup-container">
      <button className="open-popup-button" onClick={() => setShowPopup(true)}>
        Add Field
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add New Field</h2>
            <div className="form-group">
              <label htmlFor="fieldName">Name :</label>
              <input
                type="text"
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status :</label>
              <div className="status-options">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Available"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Available
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Unavailable"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Unavailable
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price :</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span>Baht/Hr.</span>
            </div>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default detailpopup;
