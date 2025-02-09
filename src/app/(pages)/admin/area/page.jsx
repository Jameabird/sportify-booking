"use client";

import { useState } from "react";
import TopBar_Admin from '@components/Topbar_Admin';
const places = [
  { id: 1, name: "Better Club Pattaya", image: "/ที่ 6.jpg" },
  { id: 2, name: "Greatness Club Pattaya", image: "/ที่ 2.jpg" },
  { id: 3, name: "Base Chonburi", image: "/ที่ 3.jpg" },
  { id: 4, name: "TT Club Pattaya", image: "/ที่ 4.jpg" },
  { id: 5, name: "GT Club Pattaya", image: "/ที่ 5.jpg" },
];

export default function PlacesPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <TopBar_Admin textColor={"black"} />
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
            onClick={() => setSelectedId(place.id)}
          >
            <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
            <div className="bg-gray-200 p-2 text-center font-semibold">{place.name}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
