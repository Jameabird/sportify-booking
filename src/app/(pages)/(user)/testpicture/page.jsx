"use client";
import { useState } from "react";
import axios from "axios";

const UploadBooking = () => {
  const [bookingData, setBookingData] = useState({
    name: "",
    user:"name",
    role:"user",
    day: "",
    time: "",
    location: "",
    field:"",
    status:"reserve",
    price:"350",
    datepaid:"2025-03-30T17:00:00.000+00:00",
    timepaid:"14:56",
    type: "",
    building: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBookingData({ ...bookingData, image: reader.result });
        setPreview(reader.result); // แสดงภาพก่อนอัปโหลด
      };
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5002/api/bookings", bookingData);
      alert("จองสำเร็จ!");
      console.log(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการจอง", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">อัปโหลดการจองพร้อมรูป</h2>
      <input type="text" name="name" placeholder="ชื่อ" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="price" placeholder="price" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="role" placeholder="role" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="date" name="day" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="time" placeholder="เวลา" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="location" placeholder="สถานที่" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="type" placeholder="ประเภท" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="field" placeholder="สนาม" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="text" name="building" placeholder="อาคาร" onChange={handleInputChange} className="border p-2 m-2" />
      <input type="file" onChange={handleFileChange} className="border p-2 m-2" />
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 mt-2 rounded-lg" />}
      <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"> จอง </button>
    </div>
  );
};

export default UploadBooking;
