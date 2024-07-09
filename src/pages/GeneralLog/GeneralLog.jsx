import { Select } from "antd";
import "./GeneralLog.scss";
import React, { useState } from "react";
import searchIcon from "../../assets/icons/searchIcon.svg";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
const { Option } = Select;
const GeneralLog = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
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
      title: "Admin Email ID",
      dataIndex: "adminEmailId",
      key: "adminEmailId",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "georgia.young@example.com",
      category: "user-blocked",
      event: "Success",
      reference: "Vestibulum eu quam nec neque pellent",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
      date: "5/30/14",
    },
  ];

  return (
    <div className="generalLog_container">
      <div className="header_wrapper">
        <h3> General Log</h3>
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

export default GeneralLog;
