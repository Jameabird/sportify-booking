"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  TextField, MenuItem 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; // Import necessary icons
import TopBar_Owner from "@components/Topbar_Owner"; // Import TopBar_Owner

const courtsData = [
  { id: 1, name: "Court 1", type: "สนามแบดมินตัน", open: "08:00", close: "20:00" },
  { id: 2, name: "Court 2", type: "สนามแบดมินตัน", open: "08:00", close: "20:00" },
  { id: 3, name: "Court 3", type: "สนามแบดมินตัน", open: "08:00", close: "20:00" },
  { id: 4, name: "Court 4", type: "สนามแบดมินตัน", open: "08:00", close: "20:00" },
  { id: 5, name: "Court 5", type: "สนามแบดมินตัน", open: "08:00", close: "20:00" },
  { id: 6, name: "Court 6", type: "สนามแบดมินตัน", open: "08:00", close: "20:00" },
];

export default function CourtList() {
  const router = useRouter();

  const [courts, setCourts] = useState(courtsData); // ใช้ State เก็บข้อมูลสนาม
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [editCourt, setEditCourt] = useState({ id: "", name: "", type: "", open: "", close: "" });

  // เปิด Popup ยืนยันการลบ
  const handleClickOpenDelete = (court) => {
    setSelectedCourt(court);
    setOpenDelete(true);
  };

  // ปิด Popup ยืนยันการลบ
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedCourt(null);
  };

  // ลบสนาม
  const handleDelete = () => {
    setCourts(courts.filter(court => court.id !== selectedCourt.id));
    handleCloseDelete();
  };

  // เปิด Popup แก้ไข
  const handleClickOpenEdit = (court) => {
    setEditCourt(court);
    setOpenEdit(true);
  };

  // ปิด Popup แก้ไข
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  // อัปเดตค่าฟิลด์ที่แก้ไข
  const handleChange = (e) => {
    setEditCourt({ ...editCourt, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    setCourts(courts.map(court => (court.id === editCourt.id ? editCourt : court)));
    handleCloseEdit();
    alert('บันทึกข้อมูลสนามเรียบร้อยแล้ว');  // เพิ่ม alert หลังจากบันทึกข้อมูล
  };  

    // ฟังก์ชั่นที่เรียกใช้งานเมื่อคลิกปุ่ม "เพิ่มคอร์ด"
    const handleAddCourtClick = () => {
      // ใช้ router.push เพื่อเปลี่ยนเส้นทางไปยังหน้าใหม่
      router.push('/owner/areafield/field.management/manage.chords/add.chords');
    };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ✅ เพิ่ม TopBar_Owner */}
      <TopBar_Owner />

      <div className="max-w-5xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">รายการสนามแบดมินตัน</h1>
          {/* ✅ เพิ่มปุ่ม "เพิ่มคอร์ด" */}
          <Button variant="contained" color="primary" onClick={handleAddCourtClick}>
            เพิ่มคอร์ด
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">Court Name</th>
                <th className="p-3 text-left">ประเภทสนาม</th>
                <th className="p-3 text-left">Open</th>
                <th className="p-3 text-left">Close</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court, index) => (
                <tr key={court.id} className="border-b transition hover:bg-blue-100">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{court.name}</td>
                  <td className="p-3 text-gray-700">{court.type}</td>
                  <td className="p-3">{court.open}</td>
                  <td className="p-3">{court.close}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    {/* ปุ่มลบ */}
                    <IconButton color="error" onClick={() => handleClickOpenDelete(court)}>
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Popup ยืนยันการลบ */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบข้อมูลสนามกีฬา {selectedCourt?.name} ใช่หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">ยกเลิก</Button>
          <Button onClick={handleDelete} color="error">ลบ</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
