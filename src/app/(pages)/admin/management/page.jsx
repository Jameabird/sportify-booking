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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">Add Account :</span>
            <button
              className="bg-blue-600 text-white p-2 rounded-full"
              onClick={() => router.push("/admin/management/add")} // ✅ นำทางเมื่อกดปุ่ม
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex items-center border border-gray-300 rounded px-3 py-1">
            <input
              type="text"
              placeholder="Name..."
              className="outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts
              .filter((acc) => acc.name.toLowerCase().includes(search.toLowerCase()))
              .map((acc, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{acc.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{acc.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{acc.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">{acc.role}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button onClick={() => handleDelete(index)} className="text-red-500">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}