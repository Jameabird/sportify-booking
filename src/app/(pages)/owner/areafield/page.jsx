"use client";
import { useRouter } from "next/navigation";
import { useState , useEffect } from "react";
import TopBar_Owner from '@components/Topbar_Owner';

const places = [
  { id: 1, name: "Better Club Pattaya", image: "/ที่ 6.jpg" },
  { id: 2, name: "Greatness Club Pattaya", image: "/ที่ 2.jpg" },
  { id: 3, name: "Base Chonburi", image: "/ที่ 3.jpg" },
  { id: 4, name: "TT Club Pattaya", image: "/ที่ 4.jpg" },
  { id: 5, name: "GT Club Pattaya", image: "/ที่ 5.jpg" },
];

const PlacesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter(); // Ensure useRouter is inside the component

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlaceClick = (id) => {
    router.push(`/owner/areafield/field.management`); 
  };

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก Local Storage หรือ API (กรณีใช้ JWT หรือ Session)
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

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

        {/* Places Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden shadow-sm ${
                selectedId === place.id ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => handlePlaceClick(place.id)} // Handle the click event
            >
              <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
              <div className="bg-blue-200 p-2 text-center font-bold">{place.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlacesPage;
