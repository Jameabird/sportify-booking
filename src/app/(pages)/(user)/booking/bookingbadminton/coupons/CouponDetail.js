import React, { useState } from "react";

const CouponDetail = ({ selectedCoupon, onClose, price, onApply }) => {
  const [finalPrice, setFinalPrice] = useState(null);

  if (!selectedCoupon) return null;

  const isNumberOnly = /^[0-9]+$/.test(selectedCoupon.free);

  const applyCoupon = () => {
    let newPrice;
    if (isNumberOnly) {
      newPrice = 0;
    } else {
      const discountPercent = parseFloat(selectedCoupon.free.replace("%", ""));
      newPrice = price - (price * discountPercent) / 100;
    }
    setFinalPrice(newPrice.toFixed(2));
    onApply(newPrice);
  };

  return (
    <>
      {/* ✅ Backdrop (พื้นหลังเบลอ) */}
      <div className="modal-backdrop" onClick={onClose}></div>

      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>รายละเอียดคูปอง</h2>
        <p>
          <strong>ชื่อ:</strong> {selectedCoupon.name}
        </p>
        <p>
          <strong>คำอธิบาย:</strong> {selectedCoupon.description}
        </p>
        <p>
          <strong>ส่วนลด:</strong> {selectedCoupon.free}
        </p>
        <p>
          <strong>📅 เริ่ม:</strong> {selectedCoupon.startdate}
        </p>
        <p>
          <strong>⏳ หมดอายุ:</strong> {selectedCoupon.enddate || "ไม่ระบุ"}
        </p>

        <button className="apply-btn" onClick={applyCoupon}>
          ใช้คูปอง
        </button>

        
      </div>
    </>
  );
};

export default CouponDetail;
