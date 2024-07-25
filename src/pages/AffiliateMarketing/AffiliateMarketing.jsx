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
  const {idToken} = useSelector((state) => state.auth);

  const newCodeData = useSelector((state) => state.affiliate.newCodeListData);

  console.log("isLoading", isLoading);

  useEffect(() => {
    dispatch(
      fetchNewAffiliateCodeList({
        idToken,
        pageNo,
        pageSize,
        searchText,
      }),
    );
  }, [dispatch, pageNo, searchText, pageSize]);

  const searchRef = useRef();

  useEffect(() => {
    setFilterData(newCodeData?.results);
  }, [newCodeData]);

  const handleRowClick = (affiliateId, email) => {
    const url = `/affiliate-marketing/affiliateMarketing-logs?email=${email}`;
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
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   render: (text, record) => (
    //     <div
    //       onClick={() => handleRowClick(record.id, record.email)}
    //       className="country_flag_div"
    //     >
    //       <img
    //         src={text.flag}
    //         alt="flag"
    //       />
    //       {text}
    //     </div>
    //   ),
    // },
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
                  .join(" "),
                searchText,
              )
            : text
                ?.split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
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
                  .join(" "),
                searchText,
              )
            : text
                ?.split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
        </div>
      ),
    },
    // {
    //   title: "Country",
    //   dataIndex: "country",
    //   key: "country",
    //   render: (country) => {
    //     console.log(country, "country");
    //     const countryName = country;
    //     const countryCode = lookup.byCountry(countryName);
    //     if (countryCode) {
    //       return (
    //         <div className="country_name_wrapper">
    //           <ReactCountryFlag
    //             countryCode={countryCode.internet === "UK" ? "GB" : countryCode.internet}
    //             svg={true}
    //             aria-label={countryName}
    //           />
    //           <span>{countryName}</span>
    //         </div>
    //       );
    //     } else {
    //       return <span>{countryName}</span>;
    //     }
    //   },
    // },
    {
      title: "Referred Count",
      dataIndex: "referred_count",
      key: "referred_count",
    },
    {
      title: "Coupon Discount",
      dataIndex: "coupon_discount",
      key: "coupon_discount",
    },
    // {
    //   title: "Created",
    //   dataIndex: "created",
    //   key: "created",
    //   render: (text, record) => <p>{record.created}</p>,
    // },
    // {
    //   title: "200K Challenge",
    //   dataIndex: "200k_challenge",
    //   key: "200k_challenge",
    // },
    // {
    //   title: "300K Challenge",
    //   dataIndex: "300k_challenge",
    //   key: "300k_challenge",
    // },
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
          // onClick={() => navigate('affiliateMarketing-logs')}
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
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={filterData}
          columns={columns}
          totalPages={Math.ceil(totalItems / pageSize)}
          totalItems={totalItems}
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
