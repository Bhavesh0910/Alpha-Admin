import {Button, DatePicker, Select} from "antd";
import React, {useState} from "react";
import "./Billing.scss";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import notVerifiedIcon from "../../../assets/icons/notverified_red_circleIcon.svg";
import verifiedIcon from "../../../assets/icons/verified_green_circleIcon.svg";
import {useNavigate} from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {useSelector} from "react-redux";
const {Option} = Select;
const {RangePicker} = DatePicker;
const Billing = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [isExpandable, setIsExpandable] = useState(true);
  const {idToken, searchDates} = useSelector((state) => state.auth);
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
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (text) => (
        <span>
          <img
            src={text === "not_verified" ? notVerifiedIcon : verifiedIcon}
            alt="verified"
            style={{width: 20, height: 20, marginLeft: "13px"}}
          />
        </span>
      ),
    },
    {
      title: "Billing Method",
      dataIndex: "billingMethod",
      key: "billingMethod",
    },
    {
      title: "Billing Type",
      dataIndex: "billingType",
      key: "billingType",
      render: (text) => <Button className="standard_button profit_share_btn">Profit Share</Button>,
    },
  ];

  const dummyData = [
    {
      key: "1",
      emailId: "tanya.hill@example.com",
      accountNumber: "2798",
      date: "4/4/18",
      verified: "not_verified",
      billingMethod: "ACH",
      billingType: "Profit Share",

      description: {
        sr_No: 1,
        Date: "4/4/18",
        account_number: 2798,
        Amount: "$3250",
        account_Type: "",
        billing_Method: "RISE",
        billing_Type: "Profit Share",
        Status: "approved",
      },
    },
  ];

  function updateDateRange(dates) {
    // setDates(dates.map((date) => date.format("YYYY-MM-DD")));
  }

  return (
    <div className="billing_container">
      <div className="header_wrapper">
        <div className="heading_box">
          <h3>Billing</h3>{" "}
          <RangePicker
            placeholder={dates}
            onChange={updateDateRange}
          />
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
              <img
                src={searchIcon}
                alt="searchIcon"
              />
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
      <AntTable
        isExpandable={isExpandable}
        data={dummyData}
        columns={columns}
        expandedRowRender={expandedRowRender}
      />
    </div>
  );
};

export default Billing;

const expandedRowRender = (record) => (
  <div className="expandable_description">
    <div className="description_box">
      <label className="label">Sr No: </label>
      <p className="value">{record.description.sr_No}</p>
    </div>
    <div className="description_box">
      <label className="label">Date: </label>
      <p className="value">{record.description.Date}</p>
    </div>
    <div className="description_box">
      <label className="label">Account Number: </label>
      <p className="value">{record.description.account_number}</p>
    </div>
    <div className="description_box">
      <label className="label">Amount: </label>
      <p className="value">{record.description.Amount}</p>
    </div>
    <div className="description_box">
      <label className="label">Account Type: </label>
      <p className="value">{record.description.account_Type}</p>
    </div>
    <div className="description_box">
      <label className="label">Billing Method: </label>
      <p className="value">{record.description.billing_Method}</p>
    </div>
    <div className="description_box">
      <label className="label">Billing Type: </label>
      <p className="value profit_share_btn standard_button">{record.description.billing_Type}</p>
    </div>
    <div className="description_box">
      <label className="label">Status: </label>
      <p
        className={`status_indicator ${
          record.description.Status === "approved" ? "approved" : record.description.Status === "in_progress" ? "in_progress" : record.description.Status === "in_progress" ? "in_review" : ""
        }`}
      >
        {record.description.Status}
      </p>
    </div>
  </div>
);
