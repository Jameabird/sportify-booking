"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import CouponList from "./CouponList";
import CouponDetail from "./CouponDetail";
import "./CssCoupons.css";



const CouponsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [price, setPrice] = useState(1000);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData?.token || null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      setError("Token is missing or expired. Please log in again.");
      return;
    }

    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5005/api/promotions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPromotions(res.data);
      } catch (error) {
        setError("Failed to load promotions");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <>
      <div className="container">
        {/* ✅ แสดงราคาก่อน/หลังใช้คูปอง */}
       
        <h1>คูปอง</h1>

        {/* ✅ ปุ่มเลือกคูปอง */}
        <div className="coupon-select-box">
          <button
            className="coupon-button"
            onClick={() => setShowCoupons(true)}
          >
            🎫 เลือกคูปอง
          </button>
        </div>
        <div className="summary-box">
         
          {discountedPrice !== null ? (
            <div className="discount-box">
              <h2>รวมทั้งสิ้น : {discountedPrice} บาท</h2>
              <button
                className="cancel-btn"
                onClick={() => setDiscountedPrice(null)}
              >
                ❌ ยกเลิกคูปอง
              </button>
            </div>
          ) : (
            <div className="discount-box">
              <p>🔹 ยังไม่มีการใช้คูปอง</p>
              <button
                className="cancel-btn"
                onClick={() => setDiscountedPrice(null)}
                disabled
              >
                ❌ ยกเลิกคูปอง
              </button>
            </div>
          )}
        </div>

        {/* ✅ Popup รายการคูปอง */}
        {showCoupons && !selectedCoupon && (
          <CouponList
            promotions={promotions}
            onSelect={(coupon) => {
              setSelectedCoupon(coupon);
              setShowCoupons(false); 
            }}
            onClose={() => setShowCoupons(false)}
          />
        )}

        {/* ✅ Popup รายละเอียดคูปอง */}
        {selectedCoupon && (
          <CouponDetail
            selectedCoupon={selectedCoupon}
            onClose={() => {
              setSelectedCoupon(null);
              setShowCoupons(true); 
            }}
            price={price}
            onApply={(newPrice) => {
              setDiscountedPrice(newPrice);
              setSelectedCoupon(null);
              setShowCoupons(false); 
            }}
          />
        )}
      </div>
    </>
  );
};

export default CouponsPage;
