// src/app/(pages)/admin/promotion/PromotionModal.js
import React from "react";
import DatePicker from "react-datepicker";
import "@app/(pages)/admin/promotion/CssPromotion.css";

const PromotionModal = ({ newPromotions, setNewPromotions, showModal, handleCancel, isEditMode, handleAddPromotion, handleUpdate }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEditMode ? "Edit Promotion" : "Add Promotion"}</h3>
        <input type="text" value={newPromotions.name} onChange={(e) => setNewPromotions({ ...newPromotions, name: e.target.value })} />
        <input type="text" value={newPromotions.description} onChange={(e) => setNewPromotions({ ...newPromotions, description: e.target.value })} />
        <DatePicker selected={newPromotions.startdate ? new Date(newPromotions.startdate) : null} onChange={(date) => setNewPromotions({ ...newPromotions, startdate: date.toISOString().split("T")[0] })} />
        <button onClick={isEditMode ? handleUpdate : handleAddPromotion}>{isEditMode ? "Update" : "Save"}</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default PromotionModal;
