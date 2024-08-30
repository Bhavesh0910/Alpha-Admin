import {Button, DatePicker, Select} from "antd";
import React, {useEffect, useState} from "react";
import {ReactComponent as DownloadToPC} from "../../../assets/icons/download_to_pc.svg";
import "./KYC.scss";

import ReactCountryFlag from "react-country-flag";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {getKycList} from "../../../store/NewReducers/complianceList";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
const {Option} = Select;
const {RangePicker} = DatePicker;
const KYC = () => {
  const lookup = require("country-code-lookup");
  const {idToken, searchDates} = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  // const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [dates, setDates] = useState(null);
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {data, isLoading: accountsLoading, count} = useSelector((state) => state.compliance);

  console.log(data, "data");

  useEffect(() => {
    let query = `?page=${pageNo}&page_size=${pageSize}`;

    if (dates && dates[0] !== null) {
      query += `&start_date=${dates[0]}&end_date=${dates[1]}`;
    }

    if (status && status !== "all") {
      query += `&status=${status}`;
    }

    if (searchText) {
      query += `&search=${searchText}`;
    }

    console.log(query, "query");

    dispatch(getKycList({idToken, query, dispatch}));
  }, [idToken, pageNo, pageSize, dates, status, searchText]);

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const handleTabChange = (key) => {
    setPageNo(1);
    setStatus(key);
  };

  const handleCategoryChange = (value) => {
    setPageNo(1);
    setCategory(value);
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const columns = [
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
      width:50,
    },
    {
      title: "Account Number",
      dataIndex: "user",
      key: "user",
      width:100,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width:100,
    },
    {
      title: "Veriff",
      dataIndex: "admin_status",
      key: "admin_status",
      width:100,
      render: (text) => (
        <div
          className={`sumsubStatus_indicator ${text === "Approved" ? "approved" : text === "Pending" ? "pending" : text === "in_progress" ? "in_progress" : text === "in_review" ? "in_review" : ""}`}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Admin Review",
      dataIndex: "admin_review",
      key: "admin_review",
      width:100,
      render: (text) =>
        text !== null ? (
          <div
            className={`adminStatus_indicator ${text === "Approved" ? "approved" : text === "Pending" ? "pending" : text === "in_progress" ? "in_progress" : text === "in_review" ? "in_review" : ""}`}
          >
            {text}
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width:100,
      render: (country) => {
        console.log(country, "country");
        const countryName = country;
        const countryCode = lookup.byCountry(countryName);
        if (countryCode) {
          return (
            <div className="country_name_wrapper">
              <ReactCountryFlag
                countryCode={countryCode.internet === "UK" ? "GB" : countryCode.internet}
                svg={true}
                aria-label={countryName}
              />
              <span>{countryName}</span>
            </div>
          );
        } else {
          return <span>{"-"}</span>;
        }
      },
    },
    {
      title: "Contract",
      dataIndex: "contract",
      key: "contract",
      width:100,
      render: (text) =>
        text !== null ? (
          <span style={{cursor: "pointer"}}>
            <DownloadToPC />
          </span>
        ) : (
          "-"
        ),
    },
  ];

  const dummyData = [
    {
      key: "1",
      emailId: "tanya.hill@example.com",
      accountNumber: "2798",
      date: "4/4/18",
      sumsubStatus: "approved",
      adminReview: "in_progress",
      country: "United States",
      contract: "icon", // This should be replaced with the actual path or identifier for the contract icon
    },
  ];

  function updateDateRange(dates) {
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates([null, null]);
    }
  }

  return (
    <div className="kyc_container">
      <div className="header_wrapper">
        <div className="heading_box">
          <h3>KYC</h3>{" "}
          <RangePicker
            // placeholder={dates}
            onChange={updateDateRange}
          />
        </div>
        <div className="table_header_filter">
          <div className="search_box_wrapper search_box_wrapper">
      
            <input
              placeholder="Search by Email..."
              className="search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                console.log("e : ", e.key === "Enter");
                if (e.key === "Enter") {
                  console.log("Searching.....");
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
          <div className="filter_buttons">
            <Button
              className={status === "all" ? "active" : ""}
              onClick={() => handleTabChange("all")}
            >
              All
            </Button>
            {/* <Button
              className={status === "new" ? "active" : ""}
              onClick={() => handleTabChange("new")}
            >
              New
            </Button> */}
            <Button
              className={status === "Approved" ? "active" : ""}
              onClick={() => handleTabChange("Approved")}
            >
              Approved
            </Button>
            <Button
              className={status === "Rejected" ? "active" : ""}
              onClick={() => handleTabChange("Rejected")}
            >
              Rejected
            </Button>
            <Button
              className={status === "Pending" ? "active" : ""}
              onClick={() => handleTabChange("Pending")}
            >
              Pending
            </Button>
          </div>
        </div>
      </div>
      {accountsLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={data || []}
          columns={columns}
          totalPages={Math.ceil(count / pageSize)}
          totalItems={count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}
    </div>
  );
};

export default KYC;
