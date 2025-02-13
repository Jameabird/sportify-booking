"use client";
import React, { useState } from 'react';
import TopBar_Admin from '@components/Topbar_Admin';
import { useRouter } from "next/navigation";

const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children }) => <div className="p-4">{children}</div>;

const Input = ({ type, placeholder, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border rounded px-2 py-1 ${className}`}
  />
);

const Table = ({ children }) => (
  <table className="table-auto w-full border-collapse border border-gray-300">
    {children}
  </table>
);

const TableHeader = ({ children }) => <thead className="bg-gray-200">{children}</thead>;

const TableRow = ({ children }) => <tr className="border-b border-gray-300">{children}</tr>;

const TableHead = ({ children }) => <th className="p-2 text-left">{children}</th>;

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableCell = ({ children }) => <td className="p-2 border border-gray-300">{children}</td>;

const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" {...props}>
    {children}
  </button>
);



const TrashIcon = ({ onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-red-500"
    onClick={onClick}
  >
    <path d="M9 3V2.25A1.25 1.25 0 0 1 10.25 1h3.5A1.25 1.25 0 0 1 15 2.25V3h5.25a.75.75 0 0 1 0 1.5h-.978l-.922 15.205A2.25 2.25 0 0 1 16.104 22H7.896a2.25 2.25 0 0 1-2.246-2.295L4.728 4.5H3.75a.75.75 0 0 1 0-1.5H9Zm-2.772 16.435A.75.75 0 0 0 6.896 20.5h8.208a.75.75 0 0 0 .75-.706L16.775 4.5H7.225l-.997 14.935ZM10.25 7.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75Zm4.5.75a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0V8Z" />
  </svg>
);

const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM5 5h14v14H5V5zm2 12l3-4 2 3 3-4 4 5H7z" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.3284 11.0001V13.0001L7.50011 13.0001L10.7426 16.2426L9.32842 17.6568L3.67157 12L9.32842 6.34314L10.7426 7.75735L7.49988 11.0001L20.3284 11.0001Z"
      fill="currentColor"
    />
  </svg>
);

const AdminPaidTable = () => {
  const [rows, setRows] = useState([
    { id: 1, name: 'Ann Culhane', date: '24/12/2567', time: '24/12/2567 13.00u', status: 'Paid', price: '27,000' },
    { id: 2, name: 'Ahmad Rosser', date: '24/12/2567', time: '24/12/2567 13.00u', status: 'Paid', price: '27,000' },
    { id: 3, name: 'Zain Calzoni', date: '24/12/2567', time: '24/12/2567 13.00u', status: 'Paid', price: '27,000' },
  ]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const handleDeleteClick = (id) => {
    setRowToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setRows(rows.filter((row) => row.id !== rowToDelete));
    setShowConfirm(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setRowToDelete(null);
  };

  const handleImageIconClick = () => {
    setShowImagePopup(true);
  };

  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
  };

  const router = useRouter();

  // Function to handle the click on the arrow icon
  const handleArrowClick = () => {
    router.push("/admin/areacomfirm"); // Route to /admin/area
  };

  return (
    <>
      <TopBar_Admin textColor={"black"} />
      <div className="p-6">
        <div className="flex items-center mb-4">
        <button
            className="p-4  text-black font-bold rounded-full text-3xl"
            
          >
            <span className="text-3xl" onClick={handleArrowClick}>&lt;</span>
          </button>
          <h1 className="text-2xl font-semibold flex-grow">Better Club Pattaya</h1>
        </div>
        <Card className="shadow">
          <CardContent>
            <h2 className="text-xl mb-4">Table Paid</h2>
            <div className='mt-4 flex justify-end'>
            <Input type="text" placeholder="Search name..." className="w-1/3 " />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Time/Day in Transfer Receipt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transfer Receipt</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      <span className="text-green-500 font-medium">{row.status}</span>
                    </TableCell>
                    <TableCell>
                      <Button className="p-2" onClick={handleImageIconClick}>
                        <ImageIcon />
                      </Button>
                    </TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>
                      <Button className="p-2">
                        <TrashIcon onClick={() => handleDeleteClick(row.id)} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end">
          <Button className="bg-blue-600 text-white px-4 py-1 text-lg rounded-lg hover:bg-blue-700 transition duration-300">Save</Button>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this row?</h3>
              <div className="flex justify-between items-center">
                <Button className="bg-blue-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg transition duration-300" onClick={handleConfirmDelete}>Yes</Button>
                <Button className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-2 rounded-lg transition duration-300" onClick={handleCancelDelete}>No</Button>
              </div>
            </div>
          </div>
        )}

        {showImagePopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-96">
              <button
                className="absolute top-2 right-2 text-gray-600"
                onClick={handleCloseImagePopup}
              >
                X
              </button>
              <img src="/mybill.jpg" alt="popup content" className="w-full h-auto" />
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminPaidTable;

