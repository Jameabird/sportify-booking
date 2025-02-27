import React from "react";

const Coupon = ({ coupon, onSelect, totalBookings }) => {
  const isEligible = totalBookings >= coupon.sale;
  const discountText = coupon.free.includes("%")
    ? `ลด ${coupon.free}`
    : `ฟรี ${coupon.free} ครั้ง`;

  return (
    <div
      className={`coupon-card ${isEligible ? "eligible" : "not-eligible"}`}
      onClick={() => isEligible && onSelect(coupon)}
    >
      <h3>{coupon.name}</h3>
      <p>{coupon.description}</p>
      <p className="discount-text">{discountText}</p>
      <p className="condition">เมื่อจองครบ {coupon.sale} ครั้ง</p>
    </div>
  );
};

export default Coupon;
