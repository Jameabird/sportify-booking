"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { promotion } from "@/app/(pages)/admin/promotion/Promotion";
import "@app/(pages)/admin/promotion/CssPromotion.css";
import { Edit, Trash, Search } from "lucide-react";
import DatePicker from "react-datepicker";

const TopBar_Admin = dynamic(() => import("@components/Topbar_Admin"), {
  ssr: false,
});

const HistoryPageAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [promotionsData, setPromotionsData] = useState(promotion);
  const [newPromotions, setNewPromotions] = useState({
    name: "",
    description: "",
    status: "",
    startdate: "",
    enddate: "",
    amount: "",
    usage: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setPromotionsData(promotion);
  }, []);

  const filteredUsers = promotionsData.filter((promotion) =>
    promotion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const adjustScrollBar = () => {
      const tblContent = document.querySelector(".tbl-content");
      const tblHeader = document.querySelector(".tbl-header");
      if (tblContent && tblHeader) {
        const scrollWidth = tblContent.offsetWidth - tblContent.scrollWidth;
        tblHeader.style.paddingRight = `${scrollWidth}px`;
      }
    };

    adjustScrollBar();
    window.addEventListener("resize", adjustScrollBar);

    return () => window.removeEventListener("resize", adjustScrollBar);
  }, []);

  const handleCancel = () => {
    setShowModal(false);
    setNewPromotions({
      id: "",
      name: "",
      description: "",
      status: "",
      startdate: "",
      enddate: "",
      sale: "",
      free: "",
    });
    setIsEditMode(false);
  };

  const handleAddUser = () => {
    const newId = promotionsData.length + 1;
    setPromotionsData([
      ...promotionsData,
      { ...newPromotions, id: newId, number: newId },
    ]);
    setNewPromotions({
      id: "",
      name: "",
      description: "",
      status: "",
      startdate: "",
      enddate: "",
      sale: "",
      free: "",
    });
    setShowModal(false);
  };
  const handleEdit = (id) => {
    const promotionToEdit = promotionsData.find((promo) => promo.id === id);
    setNewPromotions(promotionToEdit);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updatedPromotions = promotionsData.map((promotion) =>
      promotion.id === newPromotions.id
        ? { ...promotion, ...newPromotions }
        : promotion
    );
    setPromotionsData(updatedPromotions);
    setShowModal(false);
    setIsEditMode(false);
    setNewPromotions({
      id: "",
      name: "",
      description: "",
      status: "",
      startdate: "",
      enddate: "",
      sale: "",
      free: "",
    });
  };

  const handleDelete = (id) => {
    const filteredData = promotionsData.filter(
      (promotion) => promotion.id !== id
    );
    setPromotionsData(filteredData);
  };

  const [selectedDate, setSelectedDate] = useState(
    newPromotions?.startdate ? new Date(newPromotions.startdate) : null
  );

  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const [isCheckedAmount, setIsCheckedAmount] = useState(false);
  const [isCheckedPercentage, setIsCheckedPercentage] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState(10); // ค่าเริ่มต้น 10%

  // ฟังก์ชันสลับการเลือก
  const toggleAmountCheckbox = () => {
    setIsCheckedAmount(!isCheckedAmount);
    if (!isCheckedAmount) setIsCheckedPercentage(false); // ปิดอีกอัน
  };

  const togglePercentageCheckbox = () => {
    setIsCheckedPercentage(!isCheckedPercentage);
    if (!isCheckedPercentage) setIsCheckedAmount(false); // ปิดอีกอัน
  };

  const [endDate, setEndDate] = useState(null); // เปลี่ยนชื่อ selectedDate -> endDate
  const [noEndDate, setNoEndDate] = useState(false);

  return (
    <>
      <TopBar_Admin textColor={"black"} />
      <div className="background-page">
        <div className="filter-and-search">
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="flex-row-button"
            >
              + Add Promotion
            </button>
          </div>
          <div className="SearchBox flex items-center gap-2">
            <label htmlFor="search">Search name: </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter name..."
                className="search-input pl-10 border border-gray-300 rounded-md py-2 px-3 text-center "
              />
            </div>
          </div>
        </div>
        <section>
          <div className="tbl-header">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>number</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>sale</th>
                  <th>Free</th>
                  <th>start date</th>
                  <th>end date</th>
                  <th>actions</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                {filteredUsers.map((promotion, index) => (
                  <tr key={promotion.id} className="hover:bg-blue-300">
                    <td>{index + 1}</td>
                    <td>{promotion.name}</td>
                    <td>{promotion.description}</td>
                    <td>{promotion.status}</td>
                    <td>{promotion.sale}</td>
                    <td>{promotion.free}</td>
                    <td>{promotion.startdate}</td>
                    <td>{promotion.enddate}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(promotion.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{isEditMode ? "Edit Promotion" : "Add Promotion"}</h3>
              <div className="container">
                <label>ชื่อ:</label>
                <input
                  type="text"
                  placeholder="Name......"
                  value={newPromotions.name}
                  onChange={(e) =>
                    setNewPromotions({ ...newPromotions, name: e.target.value })
                  }
                />
              </div>
              <div className="container">
                <label>รายละเอียด: </label>
                <input
                  type="text"
                  placeholder="Description......"
                  value={newPromotions.description}
                  onChange={(e) =>
                    setNewPromotions({
                      ...newPromotions,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              
              <label className="container">วันเริ่มต้น: </label>
              <div className="datepicker-container">
                <DatePicker
                  selected={selectedDate}
                  value={newPromotions.startdate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setNewPromotions({
                      ...newPromotions,
                      startdate: date ? date.toISOString().split("T")[0] : "", // แปลงเป็น YYYY-MM-DD
                    });
                  }}
                  placeholderText="mm/dd/yyyy"
                  dateFormat="MM/dd/yyyy"
                  className="datepicker-input"
                  calendarClassName="custom-calendar"
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="custom-header">
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
                />
              </div>

              <label className="container">วันสิ้นสุด: </label>
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={endDate}
                  value={newPromotions.enddate || ""} // ถ้า null หรือ undefined ให้แสดงเป็นค่าว่าง
                  onChange={(date) => {
                    setEndDate(date);
                    setNewPromotions({
                      ...newPromotions,
                      enddate: date ? date.toISOString().split("T")[0] : "", // แปลงเป็น string หรือให้ว่างถ้า null
                    });
                  }}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  calendarClassName="custom-calendar"
                  disabled={noEndDate}
                  className={`datepicker-input transition-colors ${
                    noEndDate
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="custom-header">
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
                />
                <input
                  type="checkbox"
                  id="noEndDate"
                  checked={noEndDate}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setNoEndDate(isChecked);

                    setEndDate(isChecked ? null : endDate);

                    setNewPromotions({
                      ...newPromotions,
                      enddate: isChecked ? "null" : newPromotions.enddate, // ถ้าติ๊กช่องนี้ ให้ enddate เป็น ""
                    });
                  }}
                />

                <label htmlFor="noEndDate"> ไม่มีกำหนด</label>
              </div>
              <label className="container">จำนวนครั้งที่จองสนาม</label>
              <div>
                <div className="container">
                  <label>จำนวน: </label>
                  <input
                    type="text"
                    value={newPromotions.sale}
                    className="inputnumber"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setNewPromotions({
                          ...newPromotions,
                          sale: value === "" ? 0 : Number(value),
                        });
                      }
                    }}
                  />

                  <p> /ครั้ง</p>
                </div>
              </div>
              <label className="container">ประเภทส่วนลด</label>

              <div
                className={`checkbox-container ${
                  isCheckedAmount ? "" : "disabled"
                }`}
                onClick={toggleCheckbox}
              >
                <input
                  type="checkbox"
                  id="promo-amount-checkbox"
                  checked={isCheckedAmount}
                  onChange={toggleAmountCheckbox}
                />
                <label htmlFor="promo-amount-checkbox">
                  โปรโมชั่นแบบเลือกจำนวน
                </label>
              </div>

              {isCheckedAmount && (
                <div className="flex-container">
                  <div className="container">
                    <label>ส่วนลด: </label>
                    <input
                      type="text"
                      value={newPromotions.free}
                      className="inputnumber"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setNewPromotions({
                            ...newPromotions,
                            free: value === "" ? 0 : Number(value),
                          });
                        }
                      }}
                    />
                    <p> /ครั้ง</p>
                  </div>
                </div>
              )}

              {/* ✅ โปรโมชั่นแบบเลือกเปอร์เซ็นต์ */}
              <div
                className={`checkbox-container ${
                  isCheckedPercentage ? "" : "disabled"
                }`}
              >
                <input
                  type="checkbox"
                  id="promo-percentage-checkbox"
                  checked={isCheckedPercentage}
                  onChange={togglePercentageCheckbox}
                />
                <label htmlFor="promo-percentage-checkbox">
                  โปรโมชั่นแบบเลือกเปอร์เซ็นต์
                </label>
              </div>

              {isCheckedPercentage && (
                <div className="percentage-selector">
                  <label>เลือกเปอร์เซ็นต์: </label>
                  <select
                    value={selectedPercentage ?? newPromotions.free ?? ""}
                    onChange={(e) => {
                      const percent = Number(e.target.value);
                      setSelectedPercentage(percent);
                      setNewPromotions((prevPromotions) => ({
                        ...prevPromotions,
                        free: `${percent}%`, // บันทึกเป็นตัวเลข
                      }));
                    }}
                    className="select-box"
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
                <button onClick={isEditMode ? handleUpdate : handleAddUser}>
                  {isEditMode ? "Update" : "Save"}
                </button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPageAdmin;
