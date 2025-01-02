"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./ChooseField.css";
import TopBar_User from "@components/Topbar_User";

const ChooseField = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const router = useRouter(); // ใช้ useRouter
  const fields = new Set([
    "Badminton",
    "Football",
    "Basketball",
    "Golf",
    "Swimming pool",
    "Volleyball",
    "Table Tennis",
    "Hiking",
    "Ice Skate"
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFieldSelection = field => {
    setSelectedField(field);
    if (isClient) {
      router.push("/search");
    }
  };

  if (!isClient) {
    return null;
  }

  const backgroundStyle = {
    backgroundImage: "url('/gym_bg2.jpg')",
    backgroundColor: "rgba(70, 80, 100, 0.7)",
    backgroundBlendMode: "multiply",
    opacity: 0.9,
    zIndex: -1
  };

  return (
    <div
     className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
      style={{
        backgroundImage: "url('/gym_bg2.jpg')",
        backgroundColor: "rgba(70, 80, 100, 0.7)",
        backgroundBlendMode: "multiply",
        opacity: 0.9,
        zIndex: -1
      }}
    >
      <TopBar_User textColor={"white"}/>
      <div className="choose-field-container">
        <h1 className="title">CHOOSE FIELD</h1>
        <div className="fields">
          {Array.from(fields).map((field, index) =>
            <button
              key={index}
              className="field-button"
              onClick={() => handleFieldSelection(field)}
            >
              {field}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseField;
