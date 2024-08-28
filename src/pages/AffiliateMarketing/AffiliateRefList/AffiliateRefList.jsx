import React, { useEffect, useMemo, useState } from "react";
import "./AffiliateRefList.scss";
import { DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";

import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import LineChart from "./LineChart";

const { Option } = Select;
const { RangePicker } = DatePicker;

const AffiliateRefList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const dispatch = useDispatch();

    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [dates, setDates] = useState();


    const handleSearch = (value) => {
        setPageNo(1);
        setPageSize(20);
        setSearchText(value);
    };

    const handleTabChange = (value) => {
        setPageNo(1);
        setActiveTab(value);
    };

    const handleCategoryChange = (value) => {
        setPageNo(1);
        setCategory(value);
    };

    function triggerChange(page, updatedPageSize) {
        setPageNo(page);
        setPageSize(updatedPageSize);
    }

    function updateDateRange(dates) {
        setPageNo(1);
        if (dates) {
            setDates(dates.map((date) => date.format("DD MMM YYYY")));
        } else {
            setDates(null);
        }
    }

    const rangePresets = [
        { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
        { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
        { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
        { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
        { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
    ];

    const chartData = {
        categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan'],
        series: [
            {
                name: "Approved Amount",
                data: [4000, 3000, 2000, 2780, 1890, 2390, 3490]
            }
        ]
    };

    const [isModalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => {
        setModalVisible(true);
    };
    return (
        <div className="affreflist_container">
            <div className="header_wrapper">

            </div>
            <div className="table_header_filter">
                <div className="header_left">
                    <div className="search_box_wrapper">

                        <input
                            placeholder="Search..."
                            className="search_input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(e.target.value);
                                }
                            }}
                        />
                        <div
                            className="searchImg"
                            onClick={() => handleSearch(search)}
                        >
                            <img
                                src={searchIcon}
                                alt="searchIcon"
                            />
                        </div>
                    </div>
                    <div className="header_middle">
                        <div className="filter_buttons">
                            <Button
                                className={activeTab === "all" ? "active" : ""}
                                onClick={() => handleTabChange("all")}
                            >
                                All
                            </Button>
                            <Button
                                className={activeTab === "paid" ? "active" : ""}
                                onClick={() => handleTabChange("paid")}
                            >
                                Paid
                            </Button>
                            <Button
                                className={activeTab === "unpaid" ? "active" : ""}
                                onClick={() => handleTabChange("unpaid")}
                            >
                                Unpaid
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="header_bottom">
                <RangePicker
                    // placeholder={dates}
                    //  defaultValue={defaultDates}
                    onChange={updateDateRange}
                    autoFocus
                    presets={rangePresets}
                />
                <div className="export_btn">
                    <Button onClick={handleCloseModal}>
                        <img
                            src={exportBtnIcon}
                            alt="export_btn_icon"
                        />
                        Export
                    </Button>
                    <Link
                        to={"/AffiliateRefLists/AffiliateRefLists-export-history"}
                        style={{ color: "white" }}
                    >
                        View Export History
                    </Link>
                </div>
            </div>

            <div className="pushleads">
                <div className="chart_wrapper">
                    <h3 className="chart_title">
                        Pushleads
                    </h3>
                    <LineChart data={chartData} />
                </div>
            </div>

        </div>
    );
};

export default AffiliateRefList;
