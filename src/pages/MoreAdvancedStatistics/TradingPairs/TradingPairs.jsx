// src/TradingPairs.js
import React, { useState, useRef, useEffect } from 'react';
import './TradingPairs.scss';
import { Button, DatePicker } from 'antd';
import LineChart from './Charts/LineChart';
import CalendarIcon from '../../../assets/icons/calendar.svg';

const TradingPairs = () => {
    const [calendarVisible, setCalendarVisible] = useState(false);
    const calendarRef = useRef(null);

    // Handle click outside to close the calendar
    const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
            setCalendarVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='trading_pairs'>
            <div className='header'>
                <h2 className='page_header'>Trading Pairs</h2>
                <div className='date_box' ref={calendarRef}>
                    <img src={CalendarIcon} alt='Calendar Icon' onClick={() => setCalendarVisible(!calendarVisible)} />
                    <p onClick={() => setCalendarVisible(!calendarVisible)}>
                    <DatePicker 
                                onChange={(date) => {
                                    console.log(date); // Handle date selection if needed
                                    setCalendarVisible(false); // Close calendar on date selection
                                }} 
                                format='YYYY-MM-DD' 
                            />
                    </p>
                     
                </div>
            </div>

            <div className='trading_pairs_top'>
                <div>
                    <h4 className='title'>Most Profitable Pairs</h4>
                    <p className='value'>USD / USD</p>
                </div>

                <div>
                    <h4 className='title'>Most Profitable Pairs</h4>
                    <p className='value'>USD / USD</p>
                </div>
            </div>

            <div className='trading_pairs_content'>
                <h2 className='page_header'>Traders Misc Data</h2>
                <div className='box_wrapper'>
                    <ChartBox />
                    <ChartBox />
                    <ChartBox />
                    <ChartBox />
                </div>
            </div>
        </div>
    );
};

const ChartBox = () => {
    const [activeTab, setActiveTab] = useState("D");

    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    return (
        <div className='chart_box_wrapper'>
            <div className='header'>
                <h4>Avg Payout Amount</h4>
                <div className="filter_button_wrapper">
                    <Button
                        className={activeTab === "D" ? "active" : ""}
                        onClick={() => handleTabChange("D")}
                    >
                        D
                    </Button>
                    <Button
                        className={activeTab === "W" ? "active" : ""}
                        onClick={() => handleTabChange("W")}
                    >
                        W
                    </Button>
                    <Button
                        className={activeTab === "M" ? "active" : ""}
                        onClick={() => handleTabChange("M")}
                    >
                        M
                    </Button>
                    <Button
                        className={activeTab === "Y" ? "active" : ""}
                        onClick={() => handleTabChange("Y")}
                    >
                        Y
                    </Button>
                </div>
            </div>
            <div className='chart_info'>
                <h4>$4251.24</h4>
                <p>$(+5.2%)</p>
            </div>

            <div className='chart_wrapper'>
                <LineChart period={activeTab} />
            </div>
        </div>
    );
};

export default TradingPairs;
