"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ ใช้ useRouter สำหรับเปลี่ยนหน้า
import { Trash2, Plus } from "lucide-react";
import TopBar_Admin from "../../components/Topbar_Admin";

export default function AccountPage() {
  const router = useRouter(); // ✅ ใช้งาน useRouter
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([
    { name: "Owner1", email: "owner_1@gmail.com", phone: "0123456789", role: "Owner" },
    { name: "Owner2", email: "owner_2@gmail.com", phone: "0123456789", role: "Owner" },
    { name: "Owner3", email: "Owner_3@gmail.com", phone: "0123456789", role: "Owner" },
    { name: "Owner4", email: "Owner_4@gmail.com", phone: "0123456789", role: "Owner" },
  ]);

  const handleDelete = (index) => {
    setAccounts(accounts.filter((_, i) => i !== index));
  };

  return (
    <>
      <TopBar_Admin />
      <div className="p-6">
        {/* ปุ่ม Add Account และช่องค้นหา */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-900">Add Account :</span>
            <button
              className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition duration-200"
              onClick={() => router.push("/admin/management/add")} // ✅ นำทางเมื่อกดปุ่ม
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-md">
            <input
              type="text"
              placeholder="Search by Name..."
              className="outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ตารางแสดงข้อมูลบัญชีผู้ใช้ */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm text-gray-600">Name</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm text-gray-600">Email</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm text-gray-600">Phone</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm text-gray-600">Role</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter((acc) => acc.name.toLowerCase().includes(search.toLowerCase()))
                .map((acc, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.name}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.email}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.phone}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.role}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700 transition duration-150"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
