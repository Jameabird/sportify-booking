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
        const response = await axios.get("http://localhost:5011/api/bookings/current", {
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
    if (!Userid) return; // ✅ Ensures we only fetch when Userid is set

    const fetchBuildings = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/buildings`, {
          params: { userId: Userid }, // ✅ Pass userId as a query param
        });

        const userBuildings = response.data.filter((building) => building.userid === Userid); // ✅ Extra safety check
        setBuildings(userBuildings);
        console.log("✅ Buildings fetched:", userBuildings);
      } catch (error) {
        console.error("❌ Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, [Userid]); // ✅ Runs only when `Userid` updates

  const handlePlaceClick = (id) => {
    router.push(`/owner/areafield/field.management?buildingId=${id}`);
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
                onClick={() => handlePlaceClick(building._id)}
              >
                <img src={building.image} alt={building.name} className="w-full h-40 object-cover" />
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
