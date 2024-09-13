import {Button, DatePicker, Dropdown, Form, Input, Menu, Modal, Select} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {ReactComponent as DownloadToPC} from "../../../assets/icons/download_to_pc.svg";
import "./KYC.scss";

import ReactCountryFlag from "react-country-flag";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {getKycList, updateKycStatus} from "../../../store/NewReducers/complianceList";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import {DownOutlined} from "@ant-design/icons";
import {render} from "react-saga";
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

  const [kycUser, setKycUser] = useState(null);
  const [kycModel, setKycModel] = useState(false);
  const [kycUpdatedValue, setKycUpdatedValue] = useState(null);
  const [comment, setComment] = useState(null);

  const {data, isLoading: accountsLoading, refetch, count} = useSelector((state) => state.compliance);

  console.log(data, "data");

  useEffect(() => {
    let query = `?page=${pageNo}&page_size=${pageSize}`;

    if (dates && dates[0] !== null) {
      query += `&start_date=${dates[0]}&end_date=${dates[1]}`;
    }

    if (status && status !== "all") {
      query += `&admin_status=${status}`;
    }

    if (searchText) {
      query += `&search=${searchText}`;
    }

    console.log(query, "query");

    dispatch(getKycList({idToken, query, dispatch}));
  }, [idToken, pageNo, pageSize, dates, status, searchText, refetch]);

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

  const openKycUpdateModel = (updatedValue, record) => {
    setKycModel(true);
    setKycUser(record);
    setKycUpdatedValue(updatedValue);
  };

  const statusMenuKyc = (key, record) => (
    <Menu
      className="menuCard"
      onClick={(e) => openKycUpdateModel(e.key, record)}
    >
      <Menu.Item key="Pending">Pending</Menu.Item>
      <Menu.Item key="Manual Approved">Manual Approved</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
    </Menu>
  );

  function reset() {
    setKycModel(false);
    setKycUser(null);
    setKycUpdatedValue(null);
  }

  function handleUpdateFlag() {
    const formData = new FormData();
    formData.append("status", kycUpdatedValue);
    formData.append("email", kycUser?.email);
    formData.append("description", comment);
    dispatch(updateKycStatus({idToken, body: formData}));
    // setFlagModel(false);
    reset();
  }
  const columns = useMemo(() => [
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
      width: 50,
    },
    {
      title: "Account Number",
      dataIndex: "user",
      key: "user",
      width: 100,
      render: (text, record) => (text ? text?.id : "-"),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
    },
    {
      title: "Sumsub Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (
        <div
          className={`sumsubStatus_indicator ${text === "Approved" ? "approved" : text === "Pending" ? "pending" : text === "in_progress" ? "in_progress" : text === "in_review" ? "in_review" : ""}`}
        >
          {typeof text === "string" && text.length > 0 ? text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase() : "-"}
        </div>
      ),
    },
    {
      title: "Admin Review",
      dataIndex: "admin_status",
      key: "admin_status",
      width: 100,
      render: (text, row, index) =>
        text !== null ? (
          <div
            className={`adminStatus_indicator ${
              text === "Approved"
                ? "approved"
                : text === "Manual Approved"
                ? "approved"
                : text === "Rejected"
                ? "rejected"
                : text === "Pending"
                ? "pending"
                : text === "in_progress"
                ? "in_progress"
                : text === "in_review"
                ? "in_review"
                : ""
            }`}
          >
            {text}
            <Dropdown
              overlay={() => statusMenuKyc(text?.status, row)}
              trigger={["click"]}
            >
              <DownOutlined />
            </Dropdown>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 100,
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
      title: "Country based on Location",
      dataIndex: "region",
      key: "region",
      width: 100,
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Contract",
      dataIndex: "contract",
      key: "contract",
      width: 100,
      render: (text) =>
        text !== null ? (
          <a
            style={{cursor: "pointer"}}
            href={text}
            target="_blank"
          >
            <DownloadToPC />
          </a>
        ) : (
          "-"
        ),
    },
  ]);

  function updateDateRange(dates) {
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates([null, null]);
    }
  }

  return (
    <>
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
              <Button
                className={status === "Manual Approved" ? "active" : ""}
                onClick={() => handleTabChange("Manual Approved")}
              >
                Manual Approved
              </Button>
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
      <Modal
        title={"Flag User"}
        open={kycModel}
        className="reset"
        onCancel={() => {
          reset();
          // setFlagModel(false);
        }}
        onOk={handleUpdateFlag}
      >
        <Form.Item
          label="Reason"
          className="reset"
        >
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{height: "120px"}}
            maxLength={"255"}
            placeholder="Write your comment here.."
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default KYC;
