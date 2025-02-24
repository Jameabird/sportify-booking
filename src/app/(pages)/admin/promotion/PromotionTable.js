import React, { useEffect, useState } from "react";
import { Edit, Trash, Save, XCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@app/(pages)/admin/promotion/CssPromotion.css";

const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});


  useEffect(() => {
    fetch("http://localhost:5001/api/promotions")
      .then((res) => res.json())
      .then((data) => setPromotions(data))
      .catch((err) => console.error("Error fetching promotions:", err));
  }, []);

  const handleEdit = (promo) => {
    setEditingId(promo._id);
    setEditedData({ ...promo });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/promotions/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedData),
        }
      );

      if (res.ok) {
        setPromotions((prev) =>
          prev.map((promo) => (promo._id === editingId ? editedData : promo))
        );
        setEditingId(null); 
        window.location.reload(); 
      } else {
        console.error("Failed to update promotion");
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบโปรโมชั่นนี้ใช่หรือไม่?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/promotions/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setPromotions((prev) => prev.filter((promo) => promo._id !== id));
          window.location.reload(); 
        } else {
          console.error("Failed to delete");
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
      }
    }
  };

  return (
    <div>
      <div className="tbl-header">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Sale</th>
              <th>Free</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="tbl-content">
        <table>
          <tbody>
            {promotions.map((promo, index) => (
              <tr key={promo._id}>
                <td>{index + 1}</td>
                <td>
                  {editingId === promo._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    promo.name
                  )}
                </td>
                <td>
                  {editingId === promo._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editedData.description}
                      onChange={handleChange}
                    />
                  ) : (
                    promo.description
                  )}
                </td>
                <td>
                  <span
                    className={
                      promo.status === "online"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {promo.status}
                  </span>
                </td>

                <td>
                  {editingId === promo._id ? (
                    <input
                      type="number"
                      name="sale"
                      value={editedData.sale}
                      onChange={handleChange}
                    />
                  ) : (
                    promo.sale
                  )}
                </td>
                <td>
                  {editingId === promo._id ? (
                    <input
                      type="number"
                      name="free"
                      value={editedData.free}
                      onChange={handleChange}
                    />
                  ) : (
                    promo.free
                  )}
                </td>
                <td>
                  {editingId === promo._id ? (
                    <DatePicker
                      selected={
                        editedData.startdate
                          ? new Date(editedData.startdate)
                          : null
                      }
                      onChange={(date) =>
                        setEditedData((prev) => ({
                          ...prev,
                          startdate: date
                            ? date.toISOString().split("T")[0]
                            : null,
                        }))
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="Select Start Date"
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
                  ) : promo.startdate ? (
                    new Date(promo.startdate).toLocaleDateString()
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {editingId === promo._id ? (
                    <>
                      <DatePicker
                        selected={
                          editedData.enddate
                            ? new Date(editedData.enddate)
                            : null
                        }
                        onChange={(date) =>
                          setEditedData((prev) => ({
                            ...prev,
                            enddate: date
                              ? date.toISOString().split("T")[0]
                              : null,
                          }))
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="No End Date"
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
                              {date.toLocaleString("default", {
                                month: "long",
                              })}{" "}
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
                          if (
                            date.toDateString() === new Date().toDateString()
                          ) {
                            return "today-day";
                          }
                          return date > new Date() ? "text-gray-400" : ""; 
                        }}
                      />
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          checked={editedData.enddate === null}
                          onChange={() =>
                            setEditedData((prev) => ({
                              ...prev,
                              enddate: prev.enddate ? null : null, 
                            }))
                          }
                        />
                        <label htmlFor="noEndDate"> ไม่มีกำหนด</label>
                      </div>
                    </>
                  ) : promo.enddate ? (
                    new Date(promo.enddate).toLocaleDateString()
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {editingId === promo._id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 ml-2"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(promo)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash size={20} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionTable;
