"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import TopBar_Owner from "@components/Topbar_Owner";

const PlacesPage = () => {
  const [search, setSearch] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [Userid, setUserid] = useState(""); // ✅ Store logged-in user's ID
  const router = useRouter();

  // ✅ Fetch Current User ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("token"));
        const token = tokenData?.token;
        if (!token) {
          console.error("❌ No valid token found");
          return;
        }

        console.log("Token being sent:", token);
        const response = await axios.get("http://localhost:5000/api/bookings/current", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          const fetchedUser = response.data[0];
          setUserid(fetchedUser._id); // ✅ Save User ID
          console.log("✅ User fetched:", fetchedUser);
        } else {
          console.error("❌ No user data received");
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch Buildings Only for This User
  useEffect(() => {
    if (!Userid) return;

    const fetchBuildings = async () => {
      try {
        console.log("📌 Fetching buildings for User ID:", Userid, "and Name:", search || "ANY");

        const response = await axios.get(`http://localhost:5005/api/buildings`, {
          params: { userid: Userid, name: search || "" }, // ✅ Use `Userid` & `search` directly
        });

        setBuildings(response.data); // ✅ Use API response directly
        console.log("✅ Buildings fetched:", response.data);
      } catch (error) {
        console.error("❌ Error fetching buildings:", error.response?.data || error.message);
      }
    };

    fetchBuildings();
  }, [Userid, search]); // ✅ Runs when `Userid` OR `search` changes

  // ✅ Delete Function
  const handleDelete = async (id, event) => {
    event.stopPropagation(); // Prevents clicking on the card

    if (!window.confirm("Are you sure you want to delete this building?")) return;

    try {
      console.log(`🗑️ Deleting building ID: ${id}`);
      await axios.delete(`http://localhost:5005/api/buildings/${id}`);

      // ✅ Remove from UI after deletion
      setBuildings((prevBuildings) => prevBuildings.filter((building) => building._id !== id));

      console.log("✅ Building deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting building:", error.response?.data || error.message);
    }
  };

  const handlePlaceClick = (name) => {
    const encodedName = encodeURIComponent(name); // ✅ Encode name safely
    router.push(`/owner/areafield/field.management?name=${encodedName}&userid=${Userid}`);
  };

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar_Owner textColor={"black"} />
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Search Box */}
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md mb-4">
          <input
            type="text"
            placeholder="Text Search"
            className="flex-1 p-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="p-2">🔍</span>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredBuildings.length > 0 ? (
            filteredBuildings.map((building) => (
              <div
                key={building._id}
                className="relative cursor-pointer border-2 rounded-lg overflow-hidden shadow-sm"
                onClick={() => handlePlaceClick(building.name, building.userid)} // ✅ Pass `name` and `userid`
              >
                {/* Delete Button (🗑️) */}
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                  onClick={(event) => handleDelete(building._id, event)}
                >
                  🗑️
                </button>

                {/* Image */}
                <img src={building.image} alt={building.name} className="w-full h-40 object-cover" />

                {/* Building Name */}
                <div className="bg-blue-200 p-2 text-center font-bold">{building.name}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No buildings found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PlacesPage;
