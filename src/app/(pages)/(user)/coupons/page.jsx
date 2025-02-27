"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "./CssCoupons.css";
import coupons from "./datacoupons";

const TopBar_User = dynamic(() => import("@components/Topbar_User"), {
  ssr: false,
});

const CouponsPage = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [usersCoupons, setUsersCoupons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false); // ✅ ซ่อนคูปองจนกว่าจะกดปุ่ม
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const token = tokenData?.token || null;

    if (!token || Date.now() > tokenData?.expirationTime) {
      setError("Token is missing or expired. Please log in again.");
      return;
    }

    const fetchUserCoupons = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4001/api/coupons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsersCoupons(res.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCoupons();
  }, []);

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDetail(true);
  };

  const applyCoupon = () => {
    if (!selectedCoupon) return;

    let newDiscount = 0;
    if (selectedCoupon.free.includes("%")) {
      newDiscount =
        totalBookings * 100 * (parseFloat(selectedCoupon.free) / 100);
    } else {
      newDiscount = parseFloat(selectedCoupon.free) * 100;
    }

    setDiscount(newDiscount);
    setShowDetail(false);
    setShowCoupons(false); // ✅ ปิดหน้าคูปองหลังจากเลือกแล้ว
  };

  return (
    <>
      <TopBar_User textColor={"black"} />
      <div className="container">
        <h1>คูปอง</h1>

        {/* ✅ ปุ่มเลือกคูปอง */}
        <div className="coupon-select-box">
          <button
            className="coupon-button"
            onClick={() => setShowCoupons(true)}
          >
              🎫  เลือกคูปอง
          </button>
        </div>

        {/* ✅ แสดงหน้าคูปองเฉพาะเมื่อกดปุ่ม */}
        {showCoupons && !showDetail && (
  <div className="coupons-container">
    {/* ✅ ปรับการตั้งค่าปิด Popup */}
    <button className="close-btn" onClick={() => setShowCoupons(false)}>
      ✖
    </button>

    {[...coupons, ...usersCoupons]
      .filter((coupon) => coupon.status === "online")
      .map((coupon, index) => (
        <div
          key={coupon._id || `coupon-${index}`}
          className="coupon-card"
          onClick={() => handleSelectCoupon(coupon)}
        >
          <h3>{coupon.name}</h3>
          <p>{coupon.description}</p>
          <p>ส่วนลด: {coupon.free}</p>
        </div>
      ))}
  </div>
)}

        {showDetail && selectedCoupon && (
          <div className="coupon-detail">
            <h2>{selectedCoupon.name}</h2>
            <p>{selectedCoupon.description}</p>
            <p>
              เริ่ม:{" "}
              {selectedCoupon.startdate
                ? new Date(
                    selectedCoupon.startdate?.$date || selectedCoupon.startdate
                  ).toLocaleDateString()
                : "ไม่ระบุ"}
            </p>

            <p>
              หมดอายุ:{" "}
              {selectedCoupon.enddate
                ? new Date(
                    selectedCoupon.enddate?.$date || selectedCoupon.enddate
                  ).toLocaleDateString()
                : "ไม่มีกำหนด"}
            </p>

            <p>ส่วนลด: {selectedCoupon.free}</p>
            <button className="apply-btn" onClick={applyCoupon}>
              ใช้คูปองนี้
            </button>
            <button className="back-btn" onClick={() => setShowDetail(false)}>
              ย้อนกลับ
            </button>
          </div>
        )}

        {/* ✅ แสดงราคารวมที่อัปเดตเมื่อใช้คูปอง */}
        <div className="summary-box">
          <p>รวมทั้งสิ้น</p>
          <h2>฿{Math.max(0, totalBookings * 100 - discount).toFixed(2)}</h2>
        </div>
      </div>
    </>
  );
};

export default CouponsPage;
