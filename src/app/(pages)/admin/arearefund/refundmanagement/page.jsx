"use client";
import React, { useState } from 'react';
import TopBar_Admin from '@components/Topbar_Admin';
import { useRouter } from "next/navigation";

const AdminPaidTable = () => {
  const router = useRouter(); // Move it inside the component
  const [rows, setRows] = useState([
    {
      id: 1,
      name: 'userA AAA',
      date: '01/01/25',
      time: '01/01/2525 13.00 น.',
      status: 'Pending review',
      price: 150,
      paymentDetails: {
        id: 1,
        datePaid: 'Jul 24, 2024',
        customer: 'John Doe',
        paymentMethod: 'transfer money through bank account',
        bankNumber: '123456789',
        status: 'Pending review'
      }
    },
    {
      id: 2,
      name: 'userB BBB',
      date: '01/01/25',
      time: '01/01/2525 13.30 น.',
      status: 'Pending review',
      price: 250,
      paymentDetails: {
        id: 2,
        datePaid: 'Jul 25, 2024',
        customer: 'Jane Doe',
        paymentMethod: 'credit card',
        bankNumber: '987654321',
        status: 'Pending review'
      }
    }
  ]);

  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [showManagePopup, setShowManagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleArrowClick = () => {
    router.push("/admin/arearefund"); // Route to /admin/area
  };

  const handleReceiptClick = (image) => {
    setSelectedImage(image);
    setShowReceiptPopup(true);
  };

  const handleManageClick = (image, details, rowId) => {
    setSelectedImage(image);
    setPaymentDetails(details);
    setSelectedRowId(rowId);
    setShowManagePopup(true);
  };

  const handleCloseReceiptPopup = () => {
    setShowReceiptPopup(false);
    setSelectedImage(null);
  };

  const handleCloseManagePopup = () => {
    setShowManagePopup(false);
    setSelectedImage(null);
    setPaymentDetails(null);
    setSelectedRowId(null);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleRefund = () => {
    setRows(rows.map(row =>
      row.id === selectedRowId
        ? {
          ...row,
          status: 'Refunded',
          className: 'bg-green-500 rounded-full',
          paymentDetails: {
            ...row.paymentDetails,
            status: 'อนุมัติแล้ว'  // เปลี่ยนสถานะของ paymentDetails
          }
        }
        : row
    ));

    handleCloseManagePopup();
  };

  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6">
        <div className="flex items-center">
          
          <button
            className="p-4  text-black font-bold rounded-full text-3xl"
            
          >
            <span className="text-3xl" onClick={handleArrowClick}>&lt;</span>
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-4">Refund Management</h1>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search Name"
            className="border border-black rounded justify-item-center px-3 py-2 w-1/3 shadow-sm"
          />
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300 mt-4 text-center shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Name</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Receipt</th>
              <th className="p-3">Amount</th>
              <th className="p-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-300 hover:bg-gray-100 transition">
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.time}</td>
                <td className="p-3">{row.status}</td>
                <td className="p-3">
                  <img
                    src="/mybill.jpg"
                    className="w-12 h-12 cursor-pointer rounded-lg shadow"
                    onClick={() => handleReceiptClick('/mybill.jpg')}
                  />
                </td>
                <td className="p-3">{row.price}</td>
                <td className="p-3 flex justify-center gap-2">
                  {row.paymentDetails.status === 'อนุมัติแล้ว' ? (
                    <span className="text-green-600">อนุมัติ</span>
                  ) : (
                    <>
                      <img
                        src="/myqr.png"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => handleManageClick('/myqr.png', row.paymentDetails, row.id)}
                      />
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-2 bg-red-500 text-white rounded shadow hover:bg-red-700 transition">
                        🗑
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className='bg-blue-500 text-white rounded px-6 py-3 text-xl mx-auto mt-3 block'>
          Save
        </button>

        {showReceiptPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img src={selectedImage} className="w-80 max-w-xs h-auto mx-auto rounded-lg shadow-lg" />
              <button className="bg-red-600 text-white px-4 py-2 mt-4 rounded-lg shadow hover:bg-red-700" onClick={handleCloseReceiptPopup}>Close</button>
            </div>
          </div>
        )}

        {showManagePopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-2">Payment details</h2>
              <img src={selectedImage} className="w-80 max-w-xs h-auto mx-auto rounded-lg shadow-lg" />
              <div className="mt-4 text-left">
                <p><strong>Date Paid:</strong> {paymentDetails.datePaid}</p>
                <p><strong>Customer:</strong> {paymentDetails.customer}</p>
                <p><strong>Payment method:</strong> {paymentDetails.paymentMethod}</p>
                <p><strong>Bank number:</strong> {paymentDetails.bankNumber}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700" onClick={handleCloseManagePopup}>Close</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700" onClick={handleRefund}>Refund Payment</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPaidTable;
