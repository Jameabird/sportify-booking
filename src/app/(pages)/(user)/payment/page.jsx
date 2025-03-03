"use client";
import React, { useState } from "react";
import axios from "axios";  // นำเข้า axios
import "./page.css";

const PaymentPage = () => {
  const [voucherUrl, setVoucherUrl] = useState("");
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVoucherChange = (e) => {
    setVoucherUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!voucherUrl) {
      setError("กรุณากรอก URL");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5010/api/validate-voucher`, {
        params: { url: voucherUrl },  // ส่ง URL ผ่าน query params
      });

      if (response.data.success) {
        setAmount(response.data.amount);
      } else {
        setError(response.data.message || "ไม่สามารถตรวจสอบได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>True Wallet Gift Voucher Redemption</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <label htmlFor="voucher-url">Enter Voucher URL:</label>
        <input
          type="text"
          id="voucher-url"
          value={voucherUrl}
          onChange={handleVoucherChange}
          placeholder="Enter True Wallet gift link"
          className="voucher-input"
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Redeem Voucher"}
        </button>
      </form>

      {/* แสดงข้อความเมื่อเกิดข้อผิดพลาด */}
      {error && <div className="error-message">{error}</div>}

      {/* แสดงข้อมูลจำนวนเงินจากคูปอง */}
      {amount !== null && !error && (
        <div className="voucher-info">
          <p>Voucher Amount: {amount} Baht</p>
        </div>
      )}

      {/* เพิ่มข้อความแจ้งเตือนเมื่อไม่มีข้อมูล */}
      {amount === null && !error && !loading && (
        <div className="info-message">
          <p>กรุณากรอก URL เพื่อเช็คจำนวนเงินจากคูปอง</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
