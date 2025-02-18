"use client";
import { useState, useEffect } from "react";
import "@app/(pages)/admin/promotion/CssPromotion.css";

const initialPromotion = {
  id: "",
  name: "",
  description: "",
  status: "",
  startdate: "",
  enddate: "",
  sale: "",
  free: "",
};

export const usePromotion = () => {
  const [promotionsData, setPromotionsData] = useState([]);
  const [newPromotions, setNewPromotions] = useState(initialPromotion);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // ดึงข้อมูล promotions (สมมติเป็นค่าเริ่มต้น)
    setPromotionsData([
      { id: 1, name: "New Year Sale", description: "50% off", status: "Active", startdate: "2024-01-01", enddate: "2024-01-31", sale: "10", free: "5" },
    ]);
  }, []);

  const handleAddPromotion = () => {
    setPromotionsData([...promotionsData, { ...newPromotions, id: promotionsData.length + 1 }]);
    handleCancel();
  };

  const handleEdit = (id) => {
    const promo = promotionsData.find((p) => p.id === id);
    setNewPromotions(promo);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = () => {
    setPromotionsData(promotionsData.map((p) => (p.id === newPromotions.id ? { ...newPromotions } : p)));
    handleCancel();
  };

  const handleDelete = (id) => {
    setPromotionsData(promotionsData.filter((p) => p.id !== id));
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewPromotions(initialPromotion);
    setIsEditMode(false);
  };

  return {
    promotionsData,
    newPromotions,
    setNewPromotions,
    showModal,
    setShowModal,
    isEditMode,
    handleAddPromotion,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleCancel,
  };
};
