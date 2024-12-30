import React, { useState } from 'react';
import './style.css';

export function User2() {
    const [profileImage, setProfileImage] = useState(null);
    const [selectedBank, setSelectedBank] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleBankChange = (e) => {
        setSelectedBank(e.target.value);
    };

    const handleSave = () => {
        alert('Profile saved successfully!');
    };

    return (
        <div className="form">
            <div className="profile-image-container">
                <img
                    src={profileImage || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="profile-image"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                />
            </div>
            <div className="field">
                <div>Name</div>
                <div><input type="text" /></div>
            </div>
            <div className="field">
                <div>Email</div>
                <div><input type="email" /></div>
            </div>
            <div className="field">
                <div>Phone</div>
                <div><input type="tel" /></div>
            </div>
            <div className="field">
                <div>Bank</div>
                <div className="bank-container">
                    <input
                        type="text"
                        className="bank-input"
                    />
                    <select value={selectedBank} onChange={handleBankChange} className="bank-select">
                        <option value="">Access Bank</option>
                        <option value="bankA">ธนาคาร A</option>
                        <option value="bankB">ธนาคาร B</option>
                        <option value="bankC">ธนาคาร C</option>
                        <option value="bankD">ธนาคาร D</option>
                    </select>
                </div>
            </div>
            <div className="buttons">
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
}