"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CouponList from "./CouponList";
import CouponDetail from "./CouponDetail";
import "./CssCoupons.css";

const CouponsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [couponCounts, setCouponCounts] = useState({}); // ✅ เก็บข้อมูลการจอง
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ ตั้งค่าเริ่มต้นเป็น true
  const [showCoupons, setShowCoupons] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [price, setPrice] = useState(1000);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [bookingType, setBookingType] = useState("archer");

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData?.token || null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      setError("Token is missing or expired. Please log in again.");
      return;
    }

    const fetchPromotions = async () => {
      setLoading(true); // ✅ เริ่มโหลดข้อมูล
      try {
        const res = await axios.get("http://localhost:4002/api/promotions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPromotions(res.data.promotions);
        setCouponCounts(res.data.couponCounts); // ✅ เก็บจำนวนการจองแต่ละประเภท
      } catch (error) {
        setError("Failed to load promotions");
      } finally {
        setLoading(false); // ✅ โหลดเสร็จ
      }
    };

    fetchPromotions();
  }, []);

  // ✅ เช็คว่าสามารถใช้คูปองได้หรือไม่
  const canUseCoupon = !loading && couponCounts[bookingType] && couponCounts[bookingType] > 0;

  return (
    <>
      <div className="container">
        <p>รวมทั้งสิ้น : {price} บาท</p>
        <p>Type : {bookingType}</p>
        <h1>คูปอง</h1>

        {/* ✅ แสดงจำนวนการจองแต่ละประเภท */}
        <div className="coupon-counts-box">
          <h2>📌 จำนวนการจองที่มี:</h2>
          <ul>
            {Object.entries(couponCounts).map(([type, count]) => (
              <li key={type}>
                <strong>{type}</strong>: {count} ครั้ง
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ ปุ่มเลือกคูปอง */}
        <div className="coupon-select-box">
          <button
            className="coupon-button"
            onClick={() => setShowCoupons(true)}
            disabled={!canUseCoupon}
            style={{
              backgroundColor: canUseCoupon ? "#28a745" : "#ccc",
              cursor: canUseCoupon ? "pointer" : "not-allowed",
            }}
          >
            🎫 เลือกคูปอง
          </button>

          {/* ✅ แสดงข้อความแจ้งเตือนที่เหมาะสม */}
          {loading ? (
            <p style={{ color: "blue", marginTop: "5px" }}>⏳ กำลังโหลด...</p>
          ) : (
            !canUseCoupon && (
              <p style={{ color: "red", marginTop: "5px" }}>
                ❌ ไม่สามารถใช้คูปองได้ (ไม่มีการจอง {bookingType})
              </p>
            )
          )}
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
