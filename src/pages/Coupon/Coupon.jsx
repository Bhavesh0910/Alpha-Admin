import {Button, Select} from "antd";
import React, {useEffect, useState} from "react";
import searchIcon from "../../assets/icons/searchIcon.svg";
import arrowIcon from "../../assets/icons/status_arrow_left_white.svg";
import {useNavigate} from "react-router-dom";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import "./Coupon.scss";
import EditCouponModal from "../../components/Coupon/EditCouponModal/EditCouponModal";
import {useDispatch, useSelector} from "react-redux";
import {getCoupons} from "../../store/NewReducers/Coupons";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import editIcon from "../../assets/icons/edit.svg";
import publicIcon from "../../assets/icons/public.svg";
import privateIcon from "../../assets/icons/private.svg";

const {Option} = Select;

const Coupon = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [editCouponData, setEditCouponData] = useState();
  const [filterData, setFilterData] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const {idToken} = useSelector((state) => state.auth);
  const {couponData,count, isLoading, refresh} = useSelector((state) => state.coupon);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (idToken) {
      fetchCoupons(idToken, pageNo, pageSize, searchText, activeTab);
    }
  }, [idToken, pageNo, pageSize, searchText, refresh, activeTab]);

  function fetchCoupons(idToken, pageNo, pageSize, searchText,activeTab) {
    dispatch(getCoupons({idToken, pageNo, pageSize, searchText,activeTab}));
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

  const editButtonClick = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text) => text || "-",
    },
    {
      title: "Coupon Code",
      dataIndex: "coupon_name",
      key: "code",
      width: 120,
      render: (text) => text || "-",
    },
    {
      title: "Coupon Amount",
      dataIndex: "coupon_amount",
      key: "amount",
      width: 100,
      render: (text) => (text !== null ? `$${text}` : "-"),
    },
    {
      title: "Coupon Expiry",
      dataIndex: "coupon_expiry",
      key: "coupon_expiry",
      render: (text) => text || "-",
    },
    {
      title: "Coupon Percentage",
      dataIndex: "coupon_percent",
      key: "percent",
      width: 100,
      render: (text) => text || "-",
    },
    // {
    //   title: "Challenge",
    //   dataIndex: "challenge",
    //   key: "challenge",
    //   render: text => text || "-",
    // },
    {
      title: "Single Use",
      dataIndex: "multi_use",
      key: "single_use",
      width: 100,
      render: (text) => <div className="coupon_status_container">{text === true ? "No" : "Yes"}</div>,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (text) => (
        <div className="coupon_status_container">
          <p className={`${text === true ? "active" : "inactive"}`}>{text === true ? "Active" : "Inactive"}</p>
          <img
            src={arrowIcon}
            alt="arrow_icon"
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "public",
      key: "action",
      render: (text, record) => (
        <div
          title={`${text ? "Public" : "Private"}`}
          className="actn_btn_container"
        >
          {text ? (
            <img
              src={publicIcon}
              alt=""
            />
          ) : (
            <img
              src={privateIcon}
              alt=""
            />
          )}
          <div
            title="Edit"
            onClick={() => {
              setEditCouponData(record);
              editButtonClick();
            }}
          >
            <img
              src={editIcon}
              alt=""
            />
          </div>
        </div>
      ),
    },
    // {
    //   title: "Users",
    //   dataIndex: "users",
    //   key: "users",
    //   render: text => <div className="actn_btn_container">{text?.length || "-"}</div>,
    // },
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
            {/* <Select className="category_dropdown" defaultValue="all" onChange={handleCategoryChange}>
              <Option value="all">All Categories</Option>
            </Select> */}
            <input
              placeholder="Search by Email..."
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
              className={activeTab === "active" ? "active" : ""}
              onClick={() => handleTabChange("active")}
            >
              Active
            </Button>
            <Button
              className={activeTab === "inactive" ? "active" : ""}
              onClick={() => handleTabChange("inactive")}
            >
              Inactive
            </Button>
          </div>
          <div className="create_coupon_btn">
            <Button onClick={() => navigate("create-coupon")}>Create Coupon</Button>
          </div>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        data={couponData || []}
        columns={columns}
        totalPages={Math.ceil(count / pageSize)}
        totalItems={count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
        scrollY={440}
      />
      {isEditModalVisible && (
        <EditCouponModal
          editCouponData={editCouponData}
          idToken={idToken}
          setIsEditModalVisible={setIsEditModalVisible}
        />
      )}
    </div>
  );
};

export default Coupon;
