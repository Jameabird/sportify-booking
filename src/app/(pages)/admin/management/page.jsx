"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // ✅ ใช้ axios
import { Trash2, Plus } from "lucide-react";
import TopBar_Admin from "../../components/Topbar_Admin";

export default function AccountPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ ดึงข้อมูล owners จาก API
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        // ตรวจสอบว่า token มีหรือไม่
        const tokenData = JSON.parse(localStorage.getItem("token"));
        const token = tokenData ? tokenData.token : null;

        if (!token || Date.now() > tokenData?.expirationTime) {
          console.log("❌ Token is missing or expired.");
          setError("Token is missing or expired. Please log in again.");
          setLoading(false);
          return;
        } else {
          console.log("✅ Token is valid:", token);

          // ส่งคำขอ GET ไปยัง API
          const { data } = await axios.get("http://localhost:5000/api/owners", {
            headers: { Authorization: `Bearer ${token}` },
          });

          // ตั้งค่าข้อมูลที่ได้จาก API ไปที่ state
          setAccounts(data);
        }
      } catch (err) {
        // จัดการข้อผิดพลาดจากการส่งคำขอ (axios) หรือการตรวจสอบ token
        const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred.";
        setError(errorMessage);
      } finally {
        // เมื่อเสร็จสิ้นการทำงานทั้งหมด ปิดการโหลด
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  // ✅ ฟังก์ชันลบ Owner
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this owner?")) return;

    try {
      // ตรวจสอบว่า token มีหรือไม่
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const token = tokenData ? tokenData.token : null;

      if (!token || Date.now() > tokenData?.expirationTime) {
        console.log("❌ Token is missing or expired.");
        setError("Token is missing or expired. Please log in again.");
        setLoading(false);
        return;
      } else {
        console.log("✅ Token is valid:", token);

        // ส่งคำขอ DELETE ไปยัง API
        await axios.delete(`http://localhost:5000/api/owners/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // อัปเดต state โดยการกรอง owner ที่ถูกลบออก
        setAccounts(accounts.filter((acc) => acc._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
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
              onClick={() => router.push("/admin/management/add")}
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

        {/* แสดง Loading หรือ Error */}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* ตารางแสดงข้อมูลบัญชีผู้ใช้ */}
        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm text-gray-600">Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm text-gray-600">Email</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm text-gray-600">Phone</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm text-gray-600">Role</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts
                  .filter((acc) => acc.username.toLowerCase().includes(search.toLowerCase()))
                  .map((acc) => (
                    <tr key={acc._id} className="text-center hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.username}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.email}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.phoneNumber || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{acc.role}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <button
                          onClick={() => handleDelete(acc._id)}
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
        )}
      </div>
    </>
  );
}
