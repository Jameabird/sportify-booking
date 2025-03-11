"use client";
import React, { useState, useEffect } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import { useRouter } from "next/navigation";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";

const AdminPaidTable = () => {
  const [rows, setRows] = useState([]);
  const [checkedRows, setCheckedRows] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [name,setName] = useState("");

  const [selectedImage, setSelectedImage] = useState(null); // Store selected image for popup
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/bookings-old")
      .then((response) => {
        const filteredData = response.data
          .filter((row) => row.status === "reserve")
          .map((row) => ({
            ...row,
            location: row.name || "N/A", // กำหนดค่าเริ่มต้นเป็น "N/A" ถ้าไม่มีข้อมูล
          }));
        setRows(filteredData);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);
  

  const handleDeleteClick = (id) => {
    setRowToDelete(id);
    setShowConfirm(true);
  };

  useEffect(() => {
    setCheckedRows(new Set());
  }, [rows]);

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:5002/api/bookings/${rowToDelete}`)
      .then(() => {
        setRows(rows.filter((row) => row._id !== rowToDelete));
        setShowConfirm(false);
        setRowToDelete(null);
      })
      .catch((error) => console.error("Error deleting booking:", error));
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setRowToDelete(null);
  };

  const handleArrowClick = () => {
    router.push("/admin/");
  };

  const handleCheckboxChange = (id) => {
    setCheckedRows((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
  };

  const handleSave = () => {
    if (checkedRows.size === 0) {
      alert("Please select at least one booking to confirm.");
      return;
    }

    const selectedRowsData = rows
  .filter((row) => checkedRows.has(row._id))
  .map(({ _id, name, price, timepaid, day, location }) => ({
    name,
    day: day || "",
    timepaid: timepaid || "",
    status: "Confirmed",
    image: "",
    price: Number(price),
    location: location || "N/A", // ส่งค่า location ไปด้วย
    id: _id,
  }));
    console.log("📌 Data to Save:", selectedRowsData);
    axios
      .post("http://localhost:5003/api/confirm", selectedRowsData)
      .then(() => {
        alert("Confirmed bookings saved successfully!");

        const deletePromises = Array.from(checkedRows).map((id) =>
          axios.delete(`http://localhost:5002/api/bookings/${id}`)
        );

        return Promise.all(deletePromises);
      })
      .then(() => {
        setRows((prevRows) => prevRows.filter((row) => !checkedRows.has(row._id)));
        setCheckedRows(new Set());
      })
      .catch((error) => console.error("❌ Error saving or deleting:", error));
  };

  return (
    <>
      <TopBar_Admin textColor={"black"} />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button
            className="p-4 text-black font-bold rounded-full text-3xl"
            onClick={handleArrowClick}
          >
            &lt;
          </button>
          <h1 className="text-2xl font-semibold flex-grow">
            Confirm payment
          </h1>
        </div>
        <div className="shadow bg-white p-4 rounded">
          <h2 className="text-xl mb-4">Table Paid</h2>
          <table className="table-auto w-full border-collapse border border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2"> </th>
                <th className="p-2">Day</th>
                <th className="p-2">Name</th>
                <th className="p-2">Location</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Receipt</th>
                <th className="p-2">Price</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-gray-300">
                  <td className="p-2">
                    <Checkbox
                      checked={checkedRows.has(row._id)}
                      onChange={() => handleCheckboxChange(row._id)}
                    />
                  </td>
                  <td className="p-2">{row.day}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.location}</td>
                  <td className="p-2">{row.timepaid}</td>
                  <td
                    className={`p-2 font-medium ${
                      row.status === "confirmed" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {row.status}
                  </td>
                  <td className="p-2">
                    {row.image ? (
                      <img
                        src={row.image.startsWith("data:image") ? row.image : `data:image/png;base64,${row.image}`}
                        alt="Receipt"
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() => setSelectedImage(row.image.startsWith("data:image") ? row.image : `data:image/png;base64,${row.image}`)}
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-2">{row.price} Baht</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeleteClick(row._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end p-4">
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Are you sure you want to delete this row?
              </h3>
              <div className="flex justify-between items-center">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  onClick={handleConfirmDelete}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                  onClick={handleCancelDelete}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Popup Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative">
              <img src={selectedImage} alt="Full Receipt" className="max-w-full max-h-screen" />
              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                ❌
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPaidTable;
