"use client";
import React, { useState } from 'react';
import TopBar_Admin from '@components/Topbar_Admin';
import { useRouter } from "next/navigation";

const AdminPaidTable = () => {
  const [rows, setRows] = useState([
    { 
      id: 1, 
      name: 'userA AAA', 
      date: '01/01/25', 
      time: '01/01/2525 13.00 น.', 
      status: 'Pending review', 
      price: 150, 
      paymentDetails: {
        datePaid: 'Jul 24, 2024',
        customer: 'John Doe',
        paymentMethod: 'transfer money through bank account',
        bankNumber: '123456789'
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
        datePaid: 'Jul 25, 2024',
        customer: 'Jane Doe',
        paymentMethod: 'credit card',
        bankNumber: '987654321'
      }
    },
    { 
      id: 3, 
      name: 'userC CCC', 
      date: '01/01/25', 
      time: '01/01/2525 14.00 น.', 
      status: 'Pending review', 
      price: 300,
      paymentDetails: {
        datePaid: 'Jul 26, 2024',
        customer: 'Chris Smith',
        paymentMethod: 'transfer money through bank account',
        bankNumber: '192837465'
      }
    },
  ]);
  
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleImageIconClick = (image, details) => {
    setSelectedImage(image);
    setPaymentDetails(details);
    setShowImagePopup(true);
  };

  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(null);
    setPaymentDetails(null);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // ฟังก์ชันสำหรับการคืนเงินและเปลี่ยนสถานะ
  const handleRefundPayment = (id) => {
    setRows(rows.map(row => 
      row.id === id ? { 
        ...row, 
        status: 'Refunded', 
        bgColor: 'bg-green-200' // เพิ่ม background color
      } : row
    ));
    setShowImagePopup(false); // ปิด popup หลังจากกดปุ่ม
  };

  return (
    <>
      <TopBar_Admin textColor="black" />
      <div className="p-6">
        <h1 className="text-2xl font-semibold flex items-center">
          <span className="mr-2">⬅️</span> Refund Management
        </h1>
        <div className='mt-4 flex justify-end'>
          <input type="text" placeholder="Search Name" className="border rounded px-2 py-1 w-1/3" />
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4 text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Name</th>
              <th className="p-2">Time</th>
              <th className="p-2">Status</th>
              <th className="p-2">Receipt</th>
              <th className="p-2">Amount</th>
              <th className="p-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={`border-b border-gray-300 ${row.bgColor}`}>
                <td className="p-2">{row.date}</td>
                <td className="p-2">{row.name}</td>
                <td className="p-2">{row.time}</td>
                <td className="p-2">{row.status}</td>
                <td className="p-2">
                  <img 
                    src="/mybill.jpg" 
                    alt="Receipt" 
                    className="w-12 h-12 mx-auto cursor-pointer" 
                    onClick={() => handleImageIconClick('/mybill.jpg', null)} 
                  />
                </td>
                <td className="p-2">{row.price}</td>
                <td className="p-2 flex justify-center gap-2">
                  <img 
                    src="/myqr.png" 
                    className="w-6 h-6 cursor-pointer" 
                    onClick={() => handleImageIconClick('/myqr.png', row.paymentDetails)} 
                  />
                  <button 
                    onClick={() => handleDeleteRow(row.id)} 
                    className="p-2 bg-red-500 text-white rounded">
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {showImagePopup && selectedImage && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-4 rounded-lg shadow-lg">
              <h2 className='flex items-center justify-center my-2'><strong>Payment details</strong></h2>
              <img 
                src={selectedImage} 
                alt="QR Code or Receipt" 
                className="w-100 max-w-xs h-auto mb-4 mx-auto rounded-lg shadow-lg" 
              />
              {paymentDetails ? (
                <div className="mt-4">
                   <p><strong>Date Paid:</strong> {paymentDetails.datePaid}</p>
                  <p><strong>Customer:</strong> {paymentDetails.customer}</p>
                  <p><strong>Payment method:</strong> {paymentDetails.paymentMethod}</p>
                  <p><strong>Bank number:</strong> {paymentDetails.bankNumber}</p>
                </div>
              ) : null}
              <div className="flex justify-center mt-4">
                <button 
                  className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700" 
                  onClick={handleCloseImagePopup}>
                  Close
                </button>
              </div>
              <button 
                  className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700" 
                  onClick={() => handleRefundPayment(paymentDetails ? paymentDetails.id : 0)}>
                  Refund Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPaidTable;
