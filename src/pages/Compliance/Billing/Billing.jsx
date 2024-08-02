import {Button, DatePicker, Select} from "antd";
import React, {useEffect, useState} from "react";
import "./Billing.scss";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import notVerifiedIcon from "../../../assets/icons/notverified_red_circleIcon.svg";
import verifiedIcon from "../../../assets/icons/verified_green_circleIcon.svg";
import {useNavigate} from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {useDispatch, useSelector} from "react-redux";
import {getBillingDetailsReq, getBillingList} from "../../../store/NewReducers/complianceList";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
const {Option} = Select;
const {RangePicker} = DatePicker;
const Billing = () => {
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [dataa, setDataa] = useState([]);
  const {idToken, searchDates} = useSelector((state) => state.auth);
  const [dates, setDates] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState("all");
  const {data, isLoading: accountsLoading, count} = useSelector((state) => state.compliance);

  useEffect(() => {
    let query = `?page=${pageNo}&page_size=${pageSize}`;

    if (dates && dates[0] !== null) {
      query += `&start_date=${dates[0]}&end_date=${dates[1]}`;
    }

    if (searchText) {
      query += `&search=${searchText}`;
    }

    dispatch(getBillingList({idToken, query, dispatch}));
  }, [idToken, pageNo, pageSize, dates, searchText]);

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
      render: (text) => text || '-',
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
      key: "account_number",
      render: (text) => text || '-',
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => text || '-',
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (text) => (
        <span>
          <img
            src={text === false ? notVerifiedIcon : verifiedIcon}
            alt="verified"
            style={{ width: 20, height: 20, marginLeft: "13px" }}
          />
        </span>
      ),
    },
    {
      title: "Billing Method",
      dataIndex: "verification_type",
      key: "verification_type",
      render: (text) => text || '-',
    },
    {
      title: "Billing Type",
      dataIndex: "billing_type",
      key: "billing_type",
      render: (text) => <Button className="standard_button profit_share_btn">{text || '-'}</Button>,
    },
  ];
  

  function updateDateRange(dates) {
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates([null, null]);
    }
  }

  useEffect(() => {
    const dataaa = data?.map((item, ind) => {
      return {uniqueKey: ind, ...item};
    });

    console.log("dataaa ", dataaa);
    setDataa(dataaa);
  }, [data]);

  return (
    <div className="billing_container">
      <div className="header_wrapper">
        <div className="heading_box">
          <h3>Billing</h3>{" "}
          <RangePicker
            // placeholder={dates}
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
            <div className="searchImg">
              <img
                src={searchIcon}
                alt="searchIcon"
              />
            </div>
          </div>
        </div>
      </div>
      {accountsLoading && <LoaderOverlay />}
      <AntTable
        columns={columns}
        data={dataa || []}
        totalPages={Math.ceil(count / pageSize)}
        totalItems={count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
        isExpandable={true}
        // expandedRowRender={expandedRowRender}
        ExpandedComp={ExpandedRowRender}
        rowId="uniqueKey"
      />
    </div>
  );
};

export default Billing;

function ExpandedRowRender({record}) {
  const {idToken} = useSelector((state) => state.auth);
  const {bilingDetailsData, isLoading} = useSelector((state) => state.compliance);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBillingDetailsReq({idToken, email: record?.email}));
    console.log("here..........");
  }, [record]);

  useEffect(() => {
    console.log(bilingDetailsData, " : billingDetails");
  }, [bilingDetailsData]);

  return (
    <>
      {isLoading ? (
        <LoaderOverlay />
      ) :  bilingDetailsData[0] ?  (
        <div className="expandable_description">
          <div className="description_box">
            <label className="label">Sr No: </label>
            <p className="value">{record.uniqueKey + 1}</p>
          </div>
          <div className="description_box">
            <label className="label">Date: </label>
            <p className="value">{bilingDetailsData[0]?.createdAt || '-'}</p>
          </div>
          <div className="description_box">
            <label className="label">Account Number: </label>
            <p className="value">{bilingDetailsData[0]?.amount || - '-'}</p>
          </div>
          <div className="description_box">
            <label className="label">Amount: </label>
            <p className="value">{bilingDetailsData[0]?.amount || '-'}</p>
          </div>
          <div className="description_box">
            <label className="label">Account Type: </label>
            {/* <p className="value">{record.description.account_Type}</p> */}
          </div>
          <div className="description_box">
            <label className="label">Billing Method: </label>
            <p className="value">{bilingDetailsData[0]?.method || '-'}</p>
          </div>
          <div className="description_box">
            <label className="label">Billing Type: </label>
            <p className="value profit_share_btn standard_button">{bilingDetailsData[0]?.type || '-'}</p>
          </div>
          <div className="description_box">
            <label className="label">Status: </label>
            <p
              style={{cursor: "pointer"}}
              className={`status_indicator ${bilingDetailsData[0]?.status === "Approved" ? "approved" : "in_review"}`}
            >
              {bilingDetailsData[0]?.status || '-'}
            </p>
          </div>
        </div>
      ) : 'no data'}
      
    </>
  );
}
