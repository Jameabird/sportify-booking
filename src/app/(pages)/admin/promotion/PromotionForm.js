import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "@app/(pages)/admin/promotion/CssPromotion.css";

const PromotionForm = ({ newPromotions, setNewPromotions, handleCancel }) => {
  const [selectedDate, setSelectedDate] = useState(
    newPromotions?.startdate ? new Date(newPromotions.startdate) : null
  );
  const [endDate, setEndDate] = useState(null);
  const [noEndDate, setNoEndDate] = useState(false);
  const [isCheckedAmount, setIsCheckedAmount] = useState(false);
  const [isCheckedPercentage, setIsCheckedPercentage] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState(10);

  useEffect(() => {
    setSelectedDate(
      newPromotions.startdate ? new Date(newPromotions.startdate) : null
    );
    setEndDate(newPromotions.enddate ? new Date(newPromotions.enddate) : null);
  }, [newPromotions]);

  const toggleAmountCheckbox = () => {
    setIsCheckedAmount(!isCheckedAmount);
    if (!isCheckedAmount) setIsCheckedPercentage(false);
  };

  const togglePercentageCheckbox = () => {
    setIsCheckedPercentage(!isCheckedPercentage);
    if (!isCheckedPercentage) setIsCheckedAmount(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/promotions",
        {
          name: newPromotions.name,
          description: newPromotions.description,
          status: "online",
          startdate: newPromotions.startdate,
          enddate: noEndDate ? null : newPromotions.enddate,
          sale: newPromotions.sale || 0,
          free: newPromotions.free || "0",
        }
      );

      console.log(response.data);
      alert("เพิ่มโปรโมชั่นสำเร็จ!");
      handleCancel();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{"Add Promotion"}</h3>
        <div className="container">
          <label>ชื่อ:</label>
          <input
            type="text"
            placeholder="Name..."
            value={newPromotions.name}
            onChange={(e) =>
              setNewPromotions({ ...newPromotions, name: e.target.value })
            }
          />
        </div>
        <div className="container">
          <label>รายละเอียด:</label>
          <input
            type="text"
            placeholder="Description..."
            value={newPromotions.description}
            onChange={(e) =>
              setNewPromotions({
                ...newPromotions,
                description: e.target.value,
              })
            }
          />
        </div>
        <label className="container">วันเริ่มต้น:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setNewPromotions({
              ...newPromotions,
              startdate: date ? date.toISOString().split("T")[0] : "",
            });
          }}
          placeholderText="mm/dd/yyyy"
          dateFormat="MM/dd/yyyy"
          className="datepicker-input"
          calendarClassName="custom-calendar"
          minDate={new Date()} 
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="custom-header flex justify-between items-center p-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="navigation-button"
              >
                &#8249;
              </button>
              <span className="current-month">
                {date.toLocaleString("default", { month: "long" })}{" "}
                {date.getFullYear()}
              </span>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="navigation-button"
              >
                &#8250;
              </button>
            </div>
          )}
          dayClassName={(date) => {
            if (date.toDateString() === new Date().toDateString()) {
              return "today-day"; 
            }
            return date > new Date() ? "text-gray-400" : "";
          }}
        />

        <label className="container">วันสิ้นสุด:</label>
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setNewPromotions({
                ...newPromotions,
                enddate: date ? date.toISOString().split("T")[0] : "",
              });
            }}
            dateFormat="MM/dd/yyyy"
            disabled={noEndDate}
            className={`datepicker-input ${
              noEndDate ? "bg-gray-300" : "bg-white"
            }`}
            placeholderText="mm/dd/yyyy"
            calendarClassName="custom-calendar"
            minDate={new Date()} 
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="custom-header flex justify-between items-center p-2">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className="navigation-button"
                >
                  &#8249;
                </button>
                <span className="current-month">
                  {date.toLocaleString("default", { month: "long" })}{" "}
                  {date.getFullYear()}
                </span>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className="navigation-button"
                >
                  &#8250;
                </button>
              </div>
            )}
            dayClassName={(date) => {
              if (date.toDateString() === new Date().toDateString()) {
                return "today-day";
              }
              return date > new Date() ? "text-gray-400" : ""; 
            }}
          />

          <input
            type="checkbox"
            checked={noEndDate}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setNoEndDate(isChecked);
              setNewPromotions({
                ...newPromotions,
                enddate: isChecked ? null : newPromotions.enddate,
              });
            }}
          />

          <label htmlFor="noEndDate"> ไม่มีกำหนด</label>
        </div>
        <div className="container">
          <label>จำนวนการจอง:</label>
          <input
            type="text"
            value={newPromotions.sale}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^\d*$/.test(inputValue)) {
                setNewPromotions({ ...newPromotions, sale: inputValue });
              }
            }}
          />
          <p> /ครั้ง</p>
        </div>

        <label className="container">ประเภทส่วนลด</label>
        <div className="checkbox-container" onClick={toggleAmountCheckbox}>
          <input
            type="checkbox"
            checked={isCheckedAmount}
            onChange={toggleAmountCheckbox}
          />
          <label>โปรโมชั่นแบบเลือกจำนวน</label>
        </div>

        {isCheckedAmount && (
          <div className="container">
            <label>ส่วนลด:</label>
            <input
              type="text"
              value={newPromotions.free}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setNewPromotions({ ...newPromotions, free: inputValue });
                }
              }}
            />
            <p> /ครั้ง</p>
          </div>
        )}

        <div className="checkbox-container" onClick={togglePercentageCheckbox}>
          <input
            type="checkbox"
            checked={isCheckedPercentage}
            onChange={togglePercentageCheckbox}
          />
          <label>โปรโมชั่นแบบเลือกเปอร์เซ็นต์</label>
        </div>

        {isCheckedPercentage && (
          <div className="percentage-selector">
            <label>เลือกเปอร์เซ็นต์:</label>
            <select
              value={selectedPercentage}
              onChange={(e) => {
                const percent = Number(e.target.value);
                setSelectedPercentage(percent);
                setNewPromotions({ ...newPromotions, free: `${percent}%` });
              }}
            >
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((percent) => (
                <option key={percent} value={percent}>
                  {percent}%
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>{"Save"}</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;
