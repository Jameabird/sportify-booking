"use client"; // ใช้สำหรับ Next.js 13+
import React from "react";
import styles from "./SuccessPage.module.css"; // ไฟล์ CSS Module

const SuccessPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <img src="/images/check-circle.png" alt="Success" />
      </div>
      <h1 className={styles.title}>บันทึกสำเร็จ</h1>
      <p className={styles.message}>
        ระบบกำลังคืนเงินให้คุณ <br />
        อาจใช้เวลา 2 - 3 วัน
      </p>
      <button className={styles.button}>Next</button>
    </div>
  );
};

export default SuccessPage;
