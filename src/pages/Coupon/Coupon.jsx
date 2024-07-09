import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import searchIcon from "../../assets/icons/searchIcon.svg";
import arrowIcon from "../../assets/icons/status_arrow_left_white.svg";
import { useNavigate } from "react-router-dom";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import "./Coupon.scss";
import EditCouponModal from "../../components/Coupon/EditCouponModal/EditCouponModal";
import { useDispatch, useSelector } from "react-redux";
import { getCoupons } from "../../store/NewReducers/Coupons";
import { returnErrors } from "../../store/reducers/error";
import { render } from "react-saga";
const { Option } = Select;
const Coupon = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [category, setCategory] = useState("all");

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [editCouponData, setEditCouponData]= useState();

  const { idToken } = useSelector(state => state.auth);
  const { couponData, count,refresh } = useSelector(state => state.coupon)
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCoupons(idToken, activeTab, searchText);
  }, [idToken, activeTab, searchText,refresh])

  function fetchCoupons(idToken, activeTab, searchText) {
    dispatch(getCoupons({idToken,activeTab, searchText }));
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchText(e.target.value);
    }
  };
  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }


  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const editButtonClick = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };


  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Coupon Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `${text === null ? "-" : text}`
    },
    {
      title: "Coupon Expiry",
      dataIndex: "expiry",
      key: "expiry",
    },
    {
      title: "Coupon Percentage",
      dataIndex: "percent",
      key: "percent",
    },
    {
      title: "Challenge",
      dataIndex: "challenge",
      key: "challenge",
      render: (text) => `${text === null ? "-" : text}`
    },
    {
      title: "Single Use",
      dataIndex: "single_use",
      key: "single_use",
      render: (text) => (
        <div className="coupon_status_container">
          {`${text === true ? "Yes" : "No"}`}
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (text) => (
        <div className="coupon_status_container">
          <p className={`${text === true ? "active" : "inactive"}`}>
            {`${text === true ? "Active" : "Inactive"}`}
          </p>

          <img src={arrowIcon} alt="arrow_icon" />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="actn_btn_container">
          <div className={`${text === "private" ? "private" : "public"}`}>
            {text}
          </div>
          <Button onClick={() => {
            setEditCouponData(record);
            editButtonClick();
          }}>
            Edit
          </Button>        
        </div>
      ),
    },
    
{
  title: "Users",
    dataIndex: "users",
      key: "users",
        render: (text) => (
          <div className="actn_btn_container">
            {text?.length}
          </div>
        ),
    },
  ];


  return (
  <div className="coupon_container">
    <div className="header_wrapper">
      <Button
        onClick={() => navigate("coupon-logs")}
        className="view_logs__btn standard_button"
      >
        View Logs
      </Button>
      <div className="header_row2">
        <div className="search_box_wrapper">
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
            className={activeTab === "" ? "active" : ""}
            onClick={() => handleTabChange("")}
          >
            All
          </Button>
          <Button
            className={activeTab ? "active" : ""}
            onClick={() => handleTabChange(true)}
          >
            Active
          </Button>
          <Button
            className={activeTab === false ? "active" : ""}
            onClick={() => handleTabChange(false)}
          >
            Inactive
          </Button>
        </div>
        <div className="create_coupon_btn">
          <Button onClick={() => navigate("create-coupon")}>
            Create Coupon
          </Button>
        </div>
      </div>
    </div>
    <AntTable
      data={couponData || []}
      columns={columns}
      totalPages={Math.ceil(count / pageSize)}
      totalItems={count}
      pageSize={pageSize}
      CurrentPageNo={pageNo}
      setPageSize={setPageSize}
      triggerChange={triggerChange}
    />

    {isEditModalVisible === true ? (
      <EditCouponModal editCouponData={editCouponData} idToken={idToken} setIsEditModalVisible={setIsEditModalVisible} />
    ) : (
      ""
    )}
  </div>
);
};

export default Coupon;
