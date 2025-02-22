"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "@app/(pages)/admin/promotion/CssPromotion.css";

import { usePromotion } from "@/app/(pages)/admin/promotion/Promotion";
import PromotionTable from "@/app/(pages)/admin/promotion/PromotionTable";
import PromotionForm from "@/app/(pages)/admin/promotion/PromotionForm"; 

const TopBar_Admin = dynamic(() => import("@components/Topbar_Admin"), {
  ssr: false,
});

const PromotionPageAdmin = () => {
  const {
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
  } = usePromotion();

  return (
    <>
      <TopBar_Admin textColor="black" />
      <button className="flex-row-button" onClick={() => setShowModal(true)}>+ Add Promotion</button>
      <PromotionTable promotions={promotionsData} handleEdit={handleEdit} handleDelete={handleDelete} />  
      {showModal && (
        <PromotionForm
          newPromotions={newPromotions}
          setNewPromotions={setNewPromotions}
          isEditMode={isEditMode}
          handleUpdate={handleUpdate}
          handleAddUser={handleAddPromotion}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default PromotionPageAdmin;
