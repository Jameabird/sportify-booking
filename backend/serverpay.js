const express = require("express");
const puppeteer = require("puppeteer");
const validator = require("validator");
const cors = require("cors");

const app = express();
const port = 5010;

// ให้เซิร์ฟเวอร์รองรับ CORS
app.use(cors());

// หมายเลขโทรศัพท์ของผู้รับ
const receiverPhoneNumber = "0992519140";

// ฟังก์ชั่นตรวจสอบลิงก์และประมวลผลข้อมูล
async function processGiftLink(url) {
  console.log("\nเริ่มตรวจสอบลิงก์: ", url);

  if (!validator.isURL(url)) {
    console.log("URL ไม่ถูกต้อง");
    return { success: false, message: "URL ไม่ถูกต้อง" };
  }

  const voucherStandardLinkCheck = "https://gift.truemoney.com/campaign/?v=";
  if (!url.includes(voucherStandardLinkCheck)) {
    console.log("ลิ้งค์ไม่ถูกต้อง ต้องเป็นซองของขวัญจาก TrueWallet");
    return { success: false, message: "ลิ้งค์ไม่ถูกต้อง ต้องเป็นซองของขวัญจาก TrueWallet" };
  }

  console.log("ลิงก์ถูกต้อง เริ่มการประมวลผล");

  try {
    const browser = await puppeteer.launch({ headless: false });
    console.log("เปิดบราวเซอร์");

    const page = await browser.newPage();
    console.log("เปิดหน้าเว็บใหม่");

    await page.goto(url, { waitUntil: "networkidle2" });
    console.log(`ไปที่ URL: ${url}`);

    // ดึงรหัสของคูปองจาก URL
    const truewalletGiftVoucherCode = url.split(voucherStandardLinkCheck)[1];
    console.log(`รหัสคูปองที่ดึงมา: ${truewalletGiftVoucherCode}`);

    const verifyUrl = `https://gift.truemoney.com/campaign/vouchers/${truewalletGiftVoucherCode}/verify?mobile=${receiverPhoneNumber}`;
    console.log(`กำลังตรวจสอบคูปองที่: ${verifyUrl}`);
    
    await page.goto(verifyUrl, { waitUntil: "networkidle2" });
    console.log(`ไปที่ URL: ${verifyUrl}`);

    const jsonResponse = await page.evaluate(() => document.body.innerText);
    const data = JSON.parse(jsonResponse);
    console.log("ข้อมูลการตรวจสอบคูปอง:\n", data);

    // การรับซองสำเร็จ
    const redeemUrl = `https://gift.truemoney.com/campaign/vouchers/${truewalletGiftVoucherCode}/redeem`;
    const redeemData = { mobile: receiverPhoneNumber, voucher_hash: truewalletGiftVoucherCode };

    // ส่งข้อมูล redeem ไปยัง URL
    await page.evaluate(async (url, data) => {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }, redeemUrl, redeemData);

    console.log(`รับซองสำเร็จที่เบอร์ ${receiverPhoneNumber}`);

    await browser.close();
    console.log("ปิดบราวเซอร์แล้ว");

    return {
      success: true,
      amount: data.data.voucher.amount_baht,
    };
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error.message);
    return { success: false, message: "เกิดข้อผิดพลาดในการเช็ค URL" };
  }
}

// API Endpoint สำหรับเช็ค URL
app.get("/api/validate-voucher", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "กรุณากรอก URL" });
  }

  console.log(`ได้รับการร้องขอให้ตรวจสอบ URL: ${url}`);

  const result = await processGiftLink(url);
  res.json(result);
});

// เริ่มเซิร์ฟเวอร์ที่พอร์ต 5010
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
