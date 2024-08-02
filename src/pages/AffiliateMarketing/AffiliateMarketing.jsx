import React, {useEffect, useRef, useState} from "react";
import {Button, DatePicker, Select} from "antd";
import {Link, useNavigate} from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import {useDispatch, useSelector} from "react-redux";
import {fetchNewAffiliateCodeList} from "../../store/NewReducers/affiliateSlice";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

import "./AffiliateMarketing.scss";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import UserDetails from "../../components/AffiliateMarketing/UserDetails/UserDetails";
import ReactCountryFlag from "react-country-flag";
const {Option} = Select;

const AffiliateMarketing = ({userData}) => {
  const lookup = require("country-code-lookup");
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const {affiliateData, currentPage, totalPages, totalItems, page_size, count, isLoading} = useSelector((state) => state.affiliate);
  // const {affiliateData, currentPage, totalPages, page_size, count, isLoading} = useSelector((state) => state.affiliate.newCodeListData);
  // const {count, isLoading} = useSelector((state) => state.affiliate);
  const {idToken} = useSelector((state) => state.auth);

  const newCodeData = useSelector((state) => state.affiliate.newCodeListData);

  // console.log("isLoading", isLoading);

  useEffect(() => {
    dispatch(
      fetchNewAffiliateCodeList({
        idToken,
        pageNo,
        pageSize,
        searchText,
      }),
    );
  }, [dispatch, pageNo, searchText, pageSize, newCodeData?.isLoading, category]);

  const searchRef = useRef();

  useEffect(() => {
    setFilterData(newCodeData?.results);
  }, [newCodeData]);

  const handleRowClick = (affiliateId, email) => {
    const url = `/affiliate-marketing/code?email=${email}`;
    navigate(url);
  };

  const [isUserDetailOpened, setIsUserDetailOpened] = useState(false);
  const [id, setId] = useState();
  const handleViewDetailsBtn = (id) => {
    setIsUserDetailOpened(!isUserDetailOpened);
    setId(id);
    console.log(id);
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = String(text)?.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span
              key={index}
              className="highlight"
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div onClick={() => handleRowClick(record.id, record.email)}>
          {category === "name" || category === "all"
            ? highlightText(
                text
                  ?.split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") || "-",
                searchText
              )
            : text?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "-"}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <div
          onClick={() => handleRowClick(record.id, record.email)}
          style={{display: "flex", alignItems: "center", gap: "12px"}}
        >
          {category === "email" || category === "all"
            ? highlightText(
                text
                  ?.split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") || "-",
                searchText
              )
            : text?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "-"}
        </div>
      ),
    },
    {
      title: "Referred Count",
      dataIndex: "referred_count",
      key: "referred_count",
      render: (text) => text || "-",
    },
    {
      title: "Coupon Discount",
      dataIndex: "coupon_discount",
      key: "coupon_discount",
      render: (text) => text || "-",
    },
    {
      title: "Referred List",
      dataIndex: "referredList",
      key: "referredList",
      render: (text, record) => (
        <button
          className="view_details_btn standard_button"
          onClick={() => handleViewDetailsBtn(record.id)}
        >
          View Details
        </button>
      ),
    },
  ];
  

  const dummyData = [
    {
      key: "1",
      name: "Jacob Jones",
      email: "debra.holt@example.com",
      country: "Georgia",
      flag: "https://flagcdn.com/w320/de.png", // Example flag URL
      referredCount: 1,
      commissionEarned: "$202.87",
      challenge200k: 4,
      challenge300k: 2,
      referredList: "View Details",
    },
  ];

  const handleSearch = (e) => {
    console.log("search1", e.target.value);
    if (e.key === "Enter") {
      console.log(searchText, e.key);
      setSearchText(e.target.value);
    }
  };

  const handleClick = () => {
    setSearchText(searchRef.current.value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleSearchButtonClick = () => {
    setSearchText(searchText);
  };

  return (
    <div className="affiliateMarketing_container">
      <div className="header_wrapper">
        <h3 className="page_header">Affiliate List</h3>
        <Button
          onClick={() => navigate('/affiliate-marketing/logs')}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="table_header_filter">
        <div className="search_box_wrapper">
          <Select
            className="category_dropdown"
            defaultValue="all"
            onChange={handleCategoryChange}
          >
            <Option value="all">All Categories</Option>
            <Option value="name">Name</Option>
            <Option value="email">Email</Option>
          </Select>
          <input
            placeholder="Search..."
            className="search_input"
            onKeyDown={(e) => handleSearch(e)}
            ref={searchRef}
          />
          <div
            className="searchImg"
            onClick={(e) => handleClick(e)}
          >
            <img
              src={searchIcon}
              alt="searchIcon"
            />
          </div>
        </div>
        <div className="export_btn">
          <Button onClick={() => navigate("/affiliate-marketing/create-affiliate-code")}>
            <img
              src={exportBtnIcon}
              alt="create_btn_icon"
            />
            Create
          </Button>
        </div>
      </div>
      {newCodeData?.isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={filterData || []}
          columns={columns}
          totalPages={Math.ceil(newCodeData?.count / pageSize)}
          totalItems={newCodeData?.count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}

      {isUserDetailOpened && isUserDetailOpened === true ? (
        <div className="userDetails_container">
          <UserDetails
            id={id}
            isUserDetailOpened={isUserDetailOpened}
            setIsUserDetailOpened={setIsUserDetailOpened}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AffiliateMarketing;
