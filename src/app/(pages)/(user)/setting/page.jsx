"use client";
import React, { useState } from "react";
import TopBar from "@components/Topbar";
import "./setting.css";

const UserSettings = () => {
  const [formData, setFormData] = useState({
    name: "Jennie Lee",
    email: "SE@gmail.com",
    phone: "+66123456789",
    bankAccount: "1112131415",
    bank: "SCB",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy_JmafxKbli9Es5QUvL6d-qIdOd5RmExsvA&s",
  });

  const banks = ["SCB", "KBANK", "KTB", "BBL",""];

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saved data:", formData);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <TopBar />
      <div className="settings-container">
        <h2>Profile Settings</h2>
        <div className="profile-image-container">
          <img
            src={formData.profileImage}
            alt="Profile"
            className="profile-image"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload"
            />
          )}
        </div>
        <form>

          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Bank Account:</label>
            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Bank:</label>
            <select
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              disabled={!isEditing}
            >
            {banks.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
            ))}
            </select>
          </div>

          {isEditing ? (
            <div className="buttons">
              <button type="button" onClick={handleSave} className="save-button"> Save </button>
              <button type="button" onClick={handleCancel} className="cancel-button"> Cancel </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="edit-button"> Edit </button>
          )}
        </form>
        
      </div>
    </div>
  );
};

export default UserSettings;
