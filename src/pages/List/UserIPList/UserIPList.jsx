import { Button, Select } from "antd";
import React, { useState } from "react";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import { useNavigate } from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
const { Option } = Select;
const UserIPList = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "IP/IPs",
      dataIndex: "ips",
      key: "ips",
      render: (text) => (
        <span>
          {text.split(" ").map((ip, index) => (
            <div key={index}>{ip}</div>
          ))}
        </span>
      ),
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => <button>{text}</button>,
    },
  ];

  const dummyData = [
    {
      key: "1",
      name: "Courtney Henry",
      email: "georgia.young@example.com",
      country: "Japan",
      ips: "125.659.4589 254.265.552",
      deviceId: "45785",
      created: "02/07/2024 04:07:43",
      action: "Block",
    },
  ];

  return (
    <div className="list_container">
      <div className="header_wrapper">
        <h3>User IP List</h3>
        <Button
          onClick={() => navigate("user-ip-logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
        <div className="search_box_wrapper">
          <Select
            className="category_dropdown"
            defaultValue="all"
            onChange={handleCategoryChange}
          >
            <Option value="all">All Categories</Option>
            <Option value="swift">Swift</Option>
            <Option value="wire">Wire</Option>
          </Select>
          <input
            placeholder="Search..."
            className="search_input"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="searchImg">
            <img src={searchIcon} alt="searchIcon" />
          </div>
        </div>
      </div>
      <AntTable data={dummyData} columns={columns} />
    </div>
  );
};

export default UserIPList;
