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
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
const { Option } = Select;
const Coupon = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [editCouponData, setEditCouponData] = useState();

  const { idToken } = useSelector(state => state.auth);
  const { couponData, isLoading , refresh } = useSelector(state => state.coupon)
  const count = useSelector(state => state.coupon.couponData[0].count)
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState('')

  console.log(couponData[0].results)
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCoupons(idToken, pageNo, pageSize, searchText);
  }, [idToken, pageNo, pageSize, searchText, refresh])

  function fetchCoupons(idToken, pageNo, pageSize, searchText) {
    dispatch(getCoupons({ idToken, pageNo, pageSize, searchText }));
  }



  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchText(e.target.value);
      setFilterData(couponData[0]?.results)
    }
  };
  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }


  useEffect(() => {
    if (activeTab === 'active') {
      setFilterData(couponData[0]?.results.filter((item) => item.is_active === true))
    }
    else if (activeTab === 'inactive') {
      setFilterData(couponData[0]?.results.filter((item) => item.is_active === false))
    }
    else {
      setFilterData(couponData[0]?.results)
    }
    console.log(filterData)
  }, [activeTab])


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
      dataIndex: "coupon_name",
      key: "code",
    },
    {
      title: "Coupon Amount",
      dataIndex: "coupon_amount",
      key: "amount",
      render: (text) => `${text === null ? "-" : text}`
    },
    {
      title: "Coupon Expiry",
      dataIndex: "coupon_expiry",
      key: "coupon_expiry",
    },
    {
      title: "Coupon Percentage",
      dataIndex: "coupon_percent",
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
      dataIndex: "multi_use",
      key: "single_use",
      render: (text) => (
        <div className="coupon_status_container">
          {`${text === true ? "No" : "Yes"}`}
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
          {/* <div className={`${text === "private" ? "private" : "public"}`}>
            {text}
          </div> */}
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
              className={activeTab === "all" ? "active" : ""}
              onClick={() => handleTabChange("all")}
            >
              All
            </Button>
            <Button
              className={activeTab === 'active' ? "active" : ""}
              onClick={() => handleTabChange("active")}
            >
              Active
            </Button>
            <Button
              className={activeTab === 'inactive' ? "active" : ""}
              onClick={() => handleTabChange("inactive")}
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
      {isLoading && <LoaderOverlay />}
      <AntTable
        data={filterData || []}
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
