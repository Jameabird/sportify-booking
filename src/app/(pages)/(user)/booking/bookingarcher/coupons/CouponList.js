import React from "react";

const CouponList = ({ promotions, onSelect, onClose }) => {
  return (
    <>
      {/* ✅ Backdrop (พื้นหลังเบลอ) */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* ✅ Popup คูปอง */}
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>เลือกคูปอง</h2>

        <div className="coupon-list">
          {promotions.map((coupon) => {
            const isNumberOnly = /^[0-9]+$/.test(coupon.free);
            const freeText = isNumberOnly ? `${coupon.free} ครั้ง` : coupon.free;

            return (
              <div
                key={coupon._id}
                className={`coupon-card ${coupon.canUse ? "" : "disabled"}`}
                onClick={() => onSelect(coupon)} 
              >
                <h3>{coupon.name}</h3>
                <p>{coupon.description}</p>
                <p>ส่วนลด: {freeText}</p>
                <p>📅 เริ่ม: {coupon.startdate}</p>
                <p>⏳ หมดอายุ: {coupon.enddate || "ไม่ระบุ"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CouponList;
