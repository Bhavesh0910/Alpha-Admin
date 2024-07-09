import { Button, DatePicker, Select } from "antd";
import "./KYC.scss";
import React, { useState } from "react";
import { ReactComponent as DownloadToPC } from "../../../assets/icons/download_to_pc.svg";

import searchIcon from "../../../assets/icons/searchIcon.svg";
import { useNavigate } from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { useSelector } from "react-redux";
const { Option } = Select;
const { RangePicker } = DatePicker;
const KYC = () => {
  const { idToken, searchDates } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [dates, setDates] = useState(searchDates);
  const navigate = useNavigate();
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const columns = [
    {
      title: "Email ID",
      dataIndex: "emailId",
      key: "emailId",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Sumsub Status",
      dataIndex: "sumsubStatus",
      key: "sumsubStatus",
      render: (text) => (
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            backgroundColor: "#28a745",
            color: "#fff",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Admin Review",
      dataIndex: "adminReview",
      key: "adminReview",
      render: (text) => (
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            backgroundColor: "#ffc107",
            color: "#000",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Contract",
      dataIndex: "contract",
      key: "contract",
      render: (text) => (
        <span>
          <DownloadToPC />
        </span>
      ),
    },
  ];

  const dummyData = [
    {
      key: "1",
      emailId: "tanya.hill@example.com",
      accountNumber: "2798",
      date: "4/4/18",
      sumsubStatus: "Approved",
      adminReview: "In Progress",
      country: "UK",
      contract: "icon", // This should be replaced with the actual path or identifier for the contract icon
    },
  ];

  function updateDateRange(dates) {
    // setDates(dates.map((date) => date.format("YYYY-MM-DD")));
  }

  return (
    <div className="kyc_container">
      <div className="header_wrapper">
        <div className="heading_box">
          <h3>KYC</h3>{" "}
          <RangePicker placeholder={dates} onChange={updateDateRange} />
        </div>
        <div className="table_header_filter">
          <div className="search_box_wrapper search_box_wrapper">
            <Select
              className="category_dropdown"
              defaultValue="all"
              onChange={handleCategoryChange}
            >
              <Option value="all">All Categories</Option>
              {/* <Option value="swift">Swift</Option>
              <Option value="wire">Wire</Option> */}
            </Select>
            <input
              placeholder="Search..."
              className="search_input"
              onKeyDown={(e) => handleSearch(e)}
            />
            <div className="searchImg">
              <img src={searchIcon} alt="searchIcon" />
            </div>
          </div>
          <div className="filter_buttons">
            <Button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => handleTabChange("all")}
            >
              All
            </Button>
            <Button
              className={activeTab === "new" ? "active" : ""}
              onClick={() => handleTabChange("new")}
            >
              New
            </Button>
            <Button
              className={activeTab === "approved" ? "active" : ""}
              onClick={() => handleTabChange("approved")}
            >
              Approved
            </Button>
            <Button
              className={activeTab === "rejected" ? "active" : ""}
              onClick={() => handleTabChange("rejected")}
            >
              Rejected
            </Button>
            <Button
              className={activeTab === "in progress" ? "active" : ""}
              onClick={() => handleTabChange("in_progress")}
            >
              In Progress
            </Button>
          </div>
        </div>
      </div>
      <AntTable data={dummyData} columns={columns} />
    </div>
  );
};

export default KYC;
