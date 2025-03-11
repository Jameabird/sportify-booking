"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./ChooseField.css";
import TopBar from "@components/Topbar";
import {
  FaBowlingBall,
  FaBaseballBall,
  FaBasketballBall,
  FaFutbol,
  FaGolfBall,
  FaHockeyPuck,
  FaTableTennis,
  FaVolleyballBall,
  FaRunning,
} from "react-icons/fa";
import { MdSportsTennis, MdSportsMotorsports } from "react-icons/md";
import { GiBoxingGlove, GiWaterPolo, GiIceSkate } from "react-icons/gi";

// กำหนดชื่อกีฬาและไอคอน
const sports = [
  { name: "Archer", icon: FaRunning },
  { name: "Badminton", icon: MdSportsTennis },
  { name: "Baseball", icon: FaBaseballBall },
  { name: "Basketball", icon: FaBasketballBall },
  { name: "Bowling", icon: FaBowlingBall },
  { name: "Car racing", icon: MdSportsMotorsports },
  { name: "Football", icon: FaFutbol },
  { name: "Futsal", icon: FaFutbol },
  { name: "Golf", icon: FaGolfBall },
  { name: "Hockey", icon: FaHockeyPuck },
  { name: "Ice skating", icon: GiIceSkate },
  { name: "Ice Hockey", icon: FaHockeyPuck },
  { name: "Rugby", icon: FaFutbol },
  { name: "Table tennis", icon: FaTableTennis },
  { name: "Tennis", icon: MdSportsTennis },
  { name: "Thai Boxing", icon: GiBoxingGlove },
  { name: "Waterpool", icon: GiWaterPolo },
  { name: "Volleyball", icon: FaVolleyballBall },
];

const ChooseField = () => {
  const [selectedField, setSelectedField] = useState(null);
  const router = useRouter();

  const handleFieldSelection = (field) => {
    setSelectedField(field);
    sessionStorage.setItem("SportType", field);
    router.push(`/Spectator/search/${encodeURIComponent(field)}`);
  };

  return (
    <div
      className="background"
     
    >
      <TopBar textColor={"white"} />
      <div className="choose-field-container">
        <h1 className="title">CHOOSE FIELD</h1>
        <div className="fields">
          {sports.map((sport, index) => (
            <button
              key={index}
              className="field-button"
              onClick={() => handleFieldSelection(sport.name)}
            >
              <sport.icon className="icon" /> {/* เรียกใช้งานไอคอน */}
              {sport.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseField;
