import React, { useEffect, useRef, useState } from "react";
import { Button, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewAffiliateCodeList } from "../../store/NewReducers/affiliateSlice";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import "./AffiliateMarketing.scss";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";

const { Option } = Select;

const AffiliateMarketing = () => {
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const { affiliateData, isLoading } = useSelector((state) => state.affiliate);
  const { idToken } = useSelector((state) => state.auth);
  const newCodeData = useSelector((state) => state.affiliate.newCodeListData);

  useEffect(() => {
    dispatch(
      fetchNewAffiliateCodeList({
        idToken,
        pageNo,
        pageSize,
        searchText,
      }),
    );
  }, [dispatch, pageNo, searchText, pageSize, idToken]);

  useEffect(() => {
    setFilterData(newCodeData?.results);
  }, [newCodeData]);

  const handleViewDetailsBtn = (id, code) => {
    navigate('/affiliate-marketing/ref-list', { state: { id, code } });
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
            <span key={index} className="highlight">
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
        <div onClick={() => handleViewDetailsBtn(record.id)}>
          {category === "name" || category === "all"
            ? highlightText(
              text
                ?.split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") || "-",
              searchText,
            )
            : text
              ?.split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ") || "-"}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <div
          onClick={() => handleViewDetailsBtn(record?.id, record?.code)}
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          {category === "email" || category === "all"
            ? highlightText(
              text
                ?.split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") || "-",
              searchText,
            )
            : text
              ?.split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ") || "-"}
        </div>
      ),
    },
    {
      title: "Referred Count",
      dataIndex: "referred_count",
      key: "referred_count",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Coupon Discount",
      dataIndex: "coupon_discount",
      key: "coupon_discount",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Referred List",
      dataIndex: "referredList",
      key: "referredList",
      render: (text, record) => (
        <button
          className="view_details_btn standard_button"
          onClick={() => handleViewDetailsBtn(record.id, record?.code)}
        >
          View Details
        </button>
      ),
    },
  ];

  const handleSearch = (search) => {
    setPageNo(1)
    setPageSize(20)
    setSearchText(search);


  };

  return (
    <div className="affiliateMarketing_container">
      <div className="header_wrapper">
        <h3 className="page_header">Affiliate List</h3>
        <Button
          onClick={() => navigate("/affiliate-marketing/logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="table_header_filter">
        <div className="search_box_wrapper">
          <input
            placeholder="Search by Email..."
            className="search_input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.target.value);
              }
            }}
            />
          <div className="searchImg"            
           onClick={() => handleSearch(search)}
          >
            <img src={searchIcon} alt="searchIcon" />
          </div>
        </div>
        <div className="export_btn">
          <Button onClick={() => navigate("/affiliate-marketing/create-affiliate-code")}>
            <img src={exportBtnIcon} alt="create_btn_icon" />
            Create
          </Button>
        </div>
      </div>
      {isLoading ? (
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
          scrollY={400}
        />
      )}
    </div>
  );
};

export default AffiliateMarketing;
