"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import TopBar_User from "@components/Topbar_User";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  TextField,
  TablePagination,
  TableSortLabel,
  Checkbox
} from "@mui/material";
import { mockBuilding, mockDataCourt, mockCourt } from "./mockdata";
import Header from "@components/Header";
import Image from "next/image";
import badminton_img from "@assets/badminton/badminton.png";
import { data } from "autoprefixer";
import { Dropdown, DatePicker, Space } from "antd";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { Tab } from "bootstrap";

const Booking = () => {
  const [buildingNames, setBuildingNames] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState("Building1");
  const [currentCourt, setCurrentCourt] = useState("Field1");
  const [courtNames, setCourtNames] = useState([]);
  const [CourtData, setCourtData] = useState([]);
  const placeName = sessionStorage.getItem("booking_place");
  const SportType = sessionStorage.getItem("SportType");
  const [selectedDate, setSelectedDate] = useState(null);
  const [getSearch, setSearch] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const Table_BoxStyles = props => ({
    styletablehead: {
      // border: "1px solid #F2F0F0",
      backgroundColor: "#C0E0FF"
    },
    styletablebody: {
      // border: "1px solid #F2F0F0",
      backgroundColor: props.rowIndex % 2 === 1 ? "#E6EFFA" : "#FFF"
    }
  });

  const sortedData = CourtData.sort((a, b) => {
    if (orderBy) {
      // Handle CHECK_STATUS sorting
      // if (orderBy === "CHECK_STATUS") {
      //   const statusA = a.Last_Checked === null ? "No Check" : "Checked";
      //   const statusB = b.Last_Checked === null ? "No Check" : "Checked";
      //   return order === "asc"
      //     ? (statusA < statusB ? -1 : 1)
      //     : (statusA > statusB ? -1 : 1);
      // }

      // Handle other column sorting
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleChangePage = () => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = () => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSortRequest = column => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  useEffect(() => {
    if (mockBuilding.length > 0) {
      setBuildingNames(mockBuilding);
    }
  }, []);

  useEffect(
    () => {
      if (getSearch) {
        setCourtData([]);
        setCourtNames([]);
        const current = mockBuilding.find(
          building => building.name === currentBuilding
        );

        if (current && !current.booking) {
          const nextAvailable = mockBuilding.find(building => building.booking);

          if (nextAvailable) {
            setCurrentBuilding(nextAvailable.name);
          }
        }

        // Filter ข้อมูลจาก currentBuilding
        if (currentCourt === "ALL") {
          const filteredCoortData = mockDataCourt.filter(
            item => item.building === currentBuilding
          );
          setCourtData(filteredCoortData);
        } else {
          const filteredCoortData = mockDataCourt.filter(
            item =>
              item.building === currentBuilding && item.name === currentCourt
          );
          setCourtData(filteredCoortData);
        }

        const filteredCoortName = mockCourt.filter(
          item => item.building === currentBuilding
        );

        setCourtNames(filteredCoortName);
        // console.log(filteredCoortName);
        setSearch(false);
      }
    },
    [currentBuilding, getSearch]
  );

  useEffect(
    () => {
      if (courtNames.length > 0) {
        const current = courtNames.find(court => court.name === currentCourt);

        if (current && !current.booking) {
          const nextAvailable = courtNames.find(court => court.booking);

          if (nextAvailable) {
            setCurrentCourt(nextAvailable.name);
          }
        }
      }
    },
    [courtNames]
  );

  const changeDate = date => {
    // console.log(date);
    setSelectedDate(dayjs(date).format("DD-MM-YYYY"));
  };

  const itemsBuilding = buildingNames.map((val, index) => ({
    key: (index + 1).toString(),
    onClick: () => setCurrentBuilding(val.name),
    label: val.name,
    icon: <MapsHomeWorkIcon />,
    disabled: !val.booking
  }));

  const itemsCourt = courtNames.map((val, index) => ({
    key: (index + 1).toString(),
    onClick: () => setCurrentCourt(val.name),
    label: val.name,
    icon: <SportsTennisIcon />,
    disabled: !val.booking
  }));

  // console.log(CourtData);
  // console.log(courtNames);

  const columns = ["Select", "Court", "Price", "Time"];

  const router = useRouter();

  const handleBookingClick = () => {
    router.push("/Payment");
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full bg-cover bg-center">
      <TopBar_User textColor={"black"} />
      <Box
        sx={{
          height: "550px"
        }}
      >
        <div
          className="absolute w-full bg-cover bg-center"
          style={{
            // backgroundColor: "#a2d8f5",
            backgroundImage: "url('/assets/Basketball/Basketball.jpg')",
            backgroundColor: "rgba(70, 80, 100, 0.3)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
            height: "550px",
            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
          }}
        >
          <main className="container">
            <div className="pt-3 pl-5 h-40">
              {/* <div className="font-medium text-white">
              {`Home > ${SportType} > ${placeName} > Booking`}
            </div> */}
              <div
                className="grid grid-rows-auto gap-2 align-center justify-center items-center"
                style={{ paddingTop: "100px" }}
              >
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 text-center">
                    <div
                      className="font-bold text-white text-4xl"
                      style={{
                        // textShadow: "2px 2px 4px #000000"
                        textShadow:
                          "0 0 5px rgb(244, 216, 3),0 0 7px rgb(244, 216, 3)"
                      }}
                    >
                      {`${placeName} `}
                    </div>
                    <div
                      className="font-bold text-white text-2xl"
                      style={{
                        // textShadow: "2px 2px 4px #000000"
                        textShadow: "0 0 5px #03e9f4,0 0 7px #03e9f4"
                      }}
                    >
                      {`${SportType} Booking`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div />
          </main>
        </div>
      </Box>
      {/* Main Content */}
      <div className="grid grid-rows-auto gap-2 pt-10">
        <div className="grid grid-cols-12 gap-2">
          {/* Search */}
          <div className="col-start-4 col-span-4">
            <Box
              sx={{
                // border: "1px solid black",
                borderRadius: "30px",
                padding: "5px",
                backgroundColor: "white",
                display: "flex",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div className="pl-2 py-1">
                <Space direction="vertical">
                  <DatePicker
                    style={{ border: "none" }}
                    onChange={changeDate}
                  />
                </Space>
              </div>
              <div className="pl-3 text-2xl font-light">|</div>
              <div className="pl-3 pt-2.5 text-sm">
                <Dropdown menu={{ items: itemsBuilding }}>
                  <Space>
                    {currentBuilding}
                    <div className="pl-20 text-xs">
                      <DownOutlined />
                    </div>
                  </Space>
                </Dropdown>
              </div>
              <div className="pl-3 text-2xl font-light">|</div>
              <div className="pl-3 pt-2.5 text-sm">
                <Dropdown menu={{ items: itemsCourt }}>
                  <Space>
                    {currentCourt}
                    <div className="pl-20 text-xs">
                      <DownOutlined />
                    </div>
                  </Space>
                </Dropdown>
              </div>
            </Box>
          </div>

          <div className="col-span-1 pl-3 pt-1">
            <Button
              sx={{
                backgroundColor: "#051f2e",
                borderRadius: "30px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2f6380"
                },
                textTransform: "none"
              }}
              onClick={() => setSearch(true)}
            >
              <div className="px-4 py-1 font-semibold">Search</div>
            </Button>
          </div>
          {/*End Search */}
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="m-12 col-span-12">
            <Box
              sx={{
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                borderRadius: "8px"
              }}
            >
              <TableContainer
                className="pt-1"
                sx={{
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px"
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  className="py-1 px-1"
                >
                  <TableHead>
                    <TableRow>
                      {columns.map((column, index) =>
                        <TableCell
                          key={index}
                          align="center"
                          // style={{ minWidth: 20 }}
                          colSpan={column === "Select" ? 1 : 2}
                          sx={{
                            // border: "1px solid #000",
                            borderTopRightRadius: column === "Time" && "10px",
                            borderTopLeftRadius: column === "Select" && "10px",
                            // borderRight: column !== "Time" && "1px solid #000",
                            // borderLeft:
                            //   column === "Select" ? "1px solid #000" : "0px",
                            // borderBottom: "1px solid #000",
                            // backgroundColor: "#C0E0FF",
                            fontWeight: "bold",
                            fontSize: "16px",
                            paddingLeft: "40px",
                            backgroundColor: "#C0E0FF"
                          }}
                        >
                          <TableSortLabel
                            active={orderBy === column}
                            direction={orderBy === column ? order : "asc"}
                            onClick={() => handleSortRequest(column)}
                          >
                            {column}
                          </TableSortLabel>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, rowIndex) => {
                        const Table_Styles = Table_BoxStyles({
                          rowIndex: rowIndex // Pass rowIndex here
                        });

                        const lastIndex = columns.length;

                        return (
                          <TableRow key={rowIndex}>
                            {columns.map(
                              (column, colIndex) =>
                                column === "Select"
                                  ? <TableCell
                                    key={colIndex}
                                    align="center"
                                    // colSpan={2}
                                    sx={{
                                      ...Table_Styles.styletablebody,
                                      "&.MuiTableCell-root": {
                                        padding: 0.65,
                                        margin: 0
                                      }
                                      // borderLeft: "1px solid #000",
                                      // borderBottom:
                                      //   rowIndex === lastIndex &&
                                      //   "1px solid #000"
                                    }}
                                  >
                                    <div className="text-base font-bold">
                                      <Checkbox
                                        disabled={!row.booking}
                                      // checked={selectedDataBaking.includes(
                                      //   rowIndex
                                      // )}
                                      // onChange={() =>
                                      //   handleRowSelectBaking(
                                      //     rowIndex,
                                      //     row
                                      //   )} // Handle row selection
                                      // sx={{
                                      //   color: selectedDataBaking.includes(
                                      //     rowIndex
                                      //   )
                                      //     ? "#1FAB89"
                                      //     : "grey",
                                      //   "&.Mui-checked": {
                                      //     color: "#1FAB89"
                                      //   }
                                      // }}
                                      />
                                    </div>
                                  </TableCell>
                                  : column === "Court"
                                    ? <TableCell
                                      key={colIndex}
                                      align="center"
                                      colSpan={2}
                                      sx={{
                                        ...Table_Styles.styletablebody,
                                        "&.MuiTableCell-root": {
                                          padding: 0.65,
                                          margin: 0
                                        }
                                        // borderBottom:
                                        //   rowIndex === lastIndex &&
                                        //   "1px solid #000"
                                      }}
                                    >
                                      {row.name}
                                    </TableCell>
                                    : column === "Price"
                                      ? <TableCell
                                        key={colIndex}
                                        align="center"
                                        colSpan={2}
                                        sx={{
                                          ...Table_Styles.styletablebody,
                                          "&.MuiTableCell-root": {
                                            padding: 0.65,
                                            margin: 0
                                          }
                                          // borderBottom:
                                          //   rowIndex === lastIndex &&
                                          //   "1px solid #000"
                                        }}
                                      >
                                        {row.price}
                                      </TableCell>
                                      : <TableCell
                                        key={colIndex}
                                        align="center"
                                        colSpan={2}
                                        sx={{
                                          ...Table_Styles.styletablebody,
                                          "&.MuiTableCell-root": {
                                            padding: 0.65,
                                            margin: 0
                                          }
                                          // borderRight: "1px solid #000",
                                          // borderBottom:
                                          //   rowIndex === lastIndex &&
                                          //   "1px solid #000"
                                        }}
                                      >
                                        {row.time}
                                      </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                <div className="grid grid-cols-12 pt-1">
                  <Box className="col-span-4 col-start-9">
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      component="div"
                      count={CourtData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </div>
              </TableContainer>
            </Box>
          </div>
          <div className="col-span-1 col-start-6">
            {/* <Button sx={{ backgroundColor: "green", color: "white", width: "100%" }}>
              Booking
            </Button> */}
            <Popup
              trigger={
                <Button
                  className="trigger-button"
                  sx={{ backgroundColor: "green", color: "white", width: "100%" }}
                >
                  BOOKING
                </Button>
              }
              position="right center"
              modal
              nested
            >
              {(close) => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> รายละเอียดการจอง </div>
                  <ul>
                    <li className="section">
                      <h2>สถานที่</h2>
                    </li>
                    <li className="section">
                      <h2>วันที่</h2>
                    </li>
                    <li className="section">
                      <h2>เวลา</h2>
                    </li>
                    <li className="section">
                      <h2>ราคารวม</h2>
                    </li>
                    <li className="section">QR CODE</li>
                  </ul>
                  <div>
                    <Button
                      sx={{ backgroundColor: "green", color: "black", width: "25%" }}
                      onClick={handleBookingClick} // เพิ่มฟังก์ชันเปลี่ยนเส้นทางที่นี่
                    >
                      Booking
                    </Button>
                    <Button
                      sx={{ backgroundColor: "red", color: "black", width: "25%" }}
                      onClick={close}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div className="col-span-1 col-start-7">
            <Button
              sx={{ backgroundColor: "red", color: "white", width: "100%" }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
