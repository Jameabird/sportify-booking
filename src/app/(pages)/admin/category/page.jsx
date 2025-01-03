"use client";
import React,{useState,useEffect} from "react";
import { useRouter } from "next/navigation";
import "./ChooseFields.css";
import TopBar_Admin from "@components/Topbar_Admin";

const category_page_admin = () => { 
    const [isClient, setIsClient] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [customFields, setCustomFields] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter(); // ใช้ useRouter
    const fields = [
      "Badminton",
      "Football",
      "Basketball",
      "Golf",
      "Swimming pool",
      "Volleyball",
      "Table Tennis",
      "Hiking",
      "Ice Skate"
    ];

    const dropdownOptions = ["Gymnastics", "Muay Thai", "Bowling"];
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    const handleFieldSelection = field => {
      setSelectedField(field);
      if (isClient) {
        router.push("/search");
      }
    };

    const handleAddCategory = () => {
        setShowDropdown(!showDropdown); 
      };
  
    const handleSelectCategory = (newField) => {
        if (!customFields.includes(newField)) {
          setCustomFields([...customFields, newField]);
        }
        setShowDropdown(false);
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

        <TopBar_Admin textColor={"white"} />
        <div className="choose-field-container">
          <h1 className="title">CHOOSE FIELD</h1>
          <div className="fields">
             
          <button
            className="add-category-button"
            onClick={handleAddCategory}
          > เพิ่มหมวดหมู่ </button>

            {showDropdown && (
            <div className="dropdown">
              {dropdownOptions.map((option, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelectCategory(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

            {fields.map((field, index) => (
            <button
              key={index}
              className="field-button"
              onClick={() => handleFieldSelection(field)}
            >
              {field}
            </button>
          ))}

            {customFields.map((field, index) => (
              <button
                key={fields.length + index}
                className="field-button"
                onClick={() => handleFieldSelection(field)}
              >
                {field}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
}
export default category_page_admin;