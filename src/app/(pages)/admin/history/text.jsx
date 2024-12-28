"use client";

import React, { useState, useMemo } from "react";
import TopBar_Admin from "@components/Topbar_Admin";
import styled from "styled-components"; /* npm install styled-components */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react"; /* npm install @nextui-org/react */

/*--------------Background --------------------*/
const Background = styled.div`
  background-image: url("/gym_bg2.jpg");
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  color: white;
`;
/*-----------End Background --------------------*/

/*-------------Icon In Dropdown -----------------------*/
export const TableIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M7.37 22h9.25a4.87 4.87 0 0 0 4.87-4.87V8.37a4.87 4.87 0 0 0-4.87-4.87H7.37A4.87 4.87 0 0 0 2.5 8.37v8.75c0 2.7 2.18 4.88 4.87 4.88Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M8.29 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM15.71 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM12 14.75h-1.69V13c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H7c-.41 0-.75.34-.75.75s.34.75.75.75h1.81V18c0 .41.34.75.75.75s.75-.34.75-.75v-1.75H12c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"
        fill="currentColor"
      />
    </svg>
  );
};
/*------------- End Dropdown -------------------*/

/*------------- Main Component ------------------*/
const HistoryPageAdmin = () => {
  {
    /*-------------- Const Drop down--------------------*/
  }
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Selected"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace("_", " "),
    [selectedKeys]
  );

  {
    /*--------------End Const Drop down--------------------*/
  }

  return (
    <>
      <Background />
      <ContentWrapper>
        <TopBar_Admin textColor={"white"} /> 
        {/*-------------------------- Title ------------------------------- */}
         <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
            paddingRight: "12rem",
            textTransform: "uppercase",
            fontSize: "50px",
            fontWeight: "bold",
            color: " rgb(255, 255, 255)",

            WebkitTextStroke: "1px rgb(83, 83, 83)",
          }}>
            <h1>history {selectedValue || "Select"}</h1>
         </div>


        {/*-------------------------- Dropdown------------------------------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
            paddingRight: "12rem",
          }}
        >
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="capitalize"
                color="primary"
                startContent={<TableIcon />}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: "#424242",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 16px",
                }}
              >
                {selectedValue || "Select"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              onSelectionChange={setSelectedKeys}
              style={{
                backgroundColor: "#909090",
               
                color: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px #b1b1b1",
                width: "200px",
                padding: "10px",
                fontSize: "16px",
                position: "absolute",
                zIndex: "10",
              }}
            >
              <DropdownItem key="reserved">Reserved</DropdownItem>
              <DropdownItem key="cancel">Cancel</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {/*-------------------------- End Dropdown------------------------------- */}
      </ContentWrapper>
    </>
  );
};

export default HistoryPageAdmin;
