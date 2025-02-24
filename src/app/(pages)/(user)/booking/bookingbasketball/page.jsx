"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import TopBar_User from "@components/Topbar_User";
import './popup.css';
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

  const [isClient, setIsClient] = useState(false);
      const [showQRPopup, setShowQRPopup] = useState(false);
      const [showImagePopup, setShowImagePopup] = useState(false);  // เพิ่มการประกาศ showImagePopup
      const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที (เวลาเป็นวินาที)
      const [uploadedImage, setUploadedImage] = useState(null); // สำหรับจัดการการอัปโหลดรูปภาพ
  
      useEffect(() => {
              setIsClient(true);
          }, []);
      
          useEffect(() => {
              if (timeLeft <= 0) return;
      
              const timer = setInterval(() => {
                  setTimeLeft(prevTime => prevTime - 1);
              }, 1000); // ลดเวลาทุก 1 วินาที
      
              return () => clearInterval(timer); // คอยลบ interval เมื่อ component หยุดทำงาน
          }, [timeLeft]);
      
          const formatTime = (seconds) => {
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
          };
      
          const handleConfirm = () => {
              setShowQRPopup(true); // เปิด Popup แสดง QR Code
          };
      
          const handleImagePopup = () => {
              setShowQRPopup(false);
              setShowImagePopup(true);
          };
      
          const handleFileUpload = (e) => {
              const file = e.target.files[0];
              if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                      setUploadedImage(reader.result); // ตั้งค่าภาพที่อัปโหลด
                  };
                  reader.readAsDataURL(file); // อ่านไฟล์เป็น URL
              }
          };

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
          <div className="col-span-1 col-start-6 ">
                    
                                <div className="popup-container">
                                  <Popup
                                    trigger={<button className="trigger-button" style={{
                                      backgroundColor: 'blue',
                                      color: 'white',
                                      border: 'none',
                                      padding: '10px 20px',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      width: '100%',
                                      
                                    }}>Booking</button>}
                                    modal
                                    nested
                                  >
                                    {close => (
                                      <div className="modal">
                                        <div className="header">รายละเอียดการจอง</div>
                                        <div className="content">
                                          <div className="booking-details">
                                            <p><span>สถานที่:</span><span>Arena Pattaya</span></p>
                                            <p><span>วันที่:</span><span>xx/xx/xx</span></p>
                                            <p><span>เวลา:</span><span>xx : xx - xx : xx</span></p>
                                            <p><span>ราคารวม:</span><span>฿360.00</span></p>
                                          </div>
                                        </div>
                                        <div className="actions">
                                          <button
                                            className="confirm-button"
                                            onClick={() => {
                                              handleConfirm();
                                              close(); // ปิด Popup แรก
                                            }}
                                          >
                                            ยืนยัน
                                          </button>
                                          <button className="cancel-button" onClick={close}>
                                            ยกเลิก
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Popup>
                    
                                  {/* Popup สำหรับแสดง QR Code */}
                                  <Popup
                                    open={showQRPopup}
                                    modal
                                    nested
                                    onClose={() => setShowQRPopup(false)} // ปิด Popup QR Code
                                  >
                                    <div className="modal">
                                      <div className="header"></div>
                                      <div className="content">
                                        <div style={{ position: 'relative' }}>
                                          <img
                                            src="/myqr.png"
                                            alt="QR Code"
                                            className="qr-image"
                                            style={{ width: '250px', height: '250px' }}
                                          />
                                          {/* ข้อความที่แสดง */}
                                          <p className="qr-description">
                                            Arena Pattaya co.ltd<br />฿360.00
                                          </p>
                                          <div className="qr-price">
                                            <div>ชำระเงินภายใน</div>
                                            <span>{formatTime(timeLeft)}</span>
                                          </div>
                                        </div>
                                        <div className="actions">
                                          <button
                                            className="confirm-button"
                                            onClick={handleImagePopup} // เปิด Popup สำหรับอัปโหลดรูปภาพ
                                          >
                                            ยืนยัน
                                          </button>
                                          <button
                                            className="cancel-button"
                                            onClick={() => setShowQRPopup(false)}
                                          >
                                            ยกเลิก
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </Popup>
                    
                                  {/* Popup สำหรับอัปโหลดรูปภาพ */}
                                  <Popup open={showImagePopup} modal nested onClose={() => setShowImagePopup(false)}>
                                    <div className="modal">
                                      <div className="header">แนบหลักฐานการชำระเงิน</div>
                                      <div className="content">
                                        <input type="file" accept="image/*" onChange={handleFileUpload} />
                                        {uploadedImage && (
                                          <div className="uploaded-image-container">
                                            <img
                                              src={uploadedImage}
                                              alt="Uploaded"
                                              style={{
                                                maxWidth: "200px",
                                                maxHeight: "200px",
                                                borderRadius: "10px",
                                              }}
                                            />
                                            <p className="image-caption">กรุณาเลือก วัน/เวลา ที่ชำระ</p>
                                            {/* Container สำหรับ วัน เดือน ปี */}
                                            <div
                                              className="date-picker-container"
                                              style={{
                                                display: "flex",
                                                gap: "10px", // ระยะห่างระหว่าง dropdown
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "10px",
                                              }}
                                            >
                                              {/* Dropdown สำหรับวัน */}
                                              <select
                                                id="day"
                                                className="date-select"
                                                defaultValue=""
                                                style={{
                                                  padding: "5px",
                                                  borderRadius: "5px",
                                                  border: "1px solid #ccc",
                                                }}
                                              >
                                                <option value="" disabled>
                                                  วัน
                                                </option>
                                                {Array.from({ length: 31 }, (_, i) => (
                                                  <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                  </option>
                                                ))}
                                              </select>
                    
                                              {/* Dropdown สำหรับเดือน */}
                                              <select
                                                id="month"
                                                className="date-select"
                                                defaultValue=""
                                                style={{
                                                  padding: "5px",
                                                  borderRadius: "5px",
                                                  border: "1px solid #ccc",
                                                }}
                                              >
                                                <option value="" disabled>
                                                  เดือน
                                                </option>
                                                {[
                                                  "มกราคม",
                                                  "กุมภาพันธ์",
                                                  "มีนาคม",
                                                  "เมษายน",
                                                  "พฤษภาคม",
                                                  "มิถุนายน",
                                                  "กรกฎาคม",
                                                  "สิงหาคม",
                                                  "กันยายน",
                                                  "ตุลาคม",
                                                  "พฤศจิกายน",
                                                  "ธันวาคม",
                                                ].map((month, i) => (
                                                  <option key={i + 1} value={i + 1}>
                                                    {month}
                                                  </option>
                                                ))}
                                              </select>
                    
                                              {/* Dropdown สำหรับปี */}
                                              <select
                                                id="year"
                                                className="date-select"
                                                defaultValue=""
                                                style={{
                                                  padding: "5px",
                                                  borderRadius: "5px",
                                                  border: "1px solid #ccc",
                                                }}
                                              >
                                                <option value="" disabled>
                                                  ปี
                                                </option>
                                                {Array.from({ length: 10 }, (_, i) => {
                                                  const year = new Date().getFullYear() - i;
                                                  return (
                                                    <option key={year} value={year}>
                                                      {year}
                                                    </option>
                                                  );
                                                })}
                                              </select>
                                            </div>
                    
                                            {/* ส่วนของเวลา */}
                                            <div
                                              className="time-picker-container"
                                              style={{
                                                marginTop: "10px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "10px",
                                              }}
                                            >
                                              <label htmlFor="time" style={{ marginRight: "10px" }}>
                                                เวลา:
                                              </label>
                                              <input
                                                type="time"
                                                id="time"
                                                style={{
                                                  padding: "5px",
                                                  borderRadius: "5px",
                                                  border: "1px solid #ccc",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="actions">
                                        <button
                                          className="confirm-button"
                                          onClick={() => setShowImagePopup(false)}
                                        >
                                          ยืนยัน
                                        </button>
                                        <button
                                          className="cancel-button"
                                          onClick={() => setShowImagePopup(false)}
                                        >
                                          ยกเลิก
                                        </button>
                                      </div>
                                    </div>
                                  </Popup>
                    
                                </div>
                                
                              </div>
                              <div className="col-span-1 col-end-8">
                                  <Button
                                    sx={{ backgroundColor: "red", color: "white", width: "100%" ,height : "100%"}}
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
