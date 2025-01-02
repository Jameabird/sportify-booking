"use client";
import React from "react";
import TopBar from '../../components/Topbar';
import './booking.css'

const Booking = () => {
    return(
        <div>
            <div className="booking"> 
                <TopBar  />
                <div className="container">
                        <div className="block">Building 1</div>
                        <div className="block">Building 2</div>
                        <div className="block">Building 3</div>
                        <div className="block">Building 4</div>
                </div>
            </div>

        </div>
    );
};

export default Booking;