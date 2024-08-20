import React, {useEffect, useMemo, useState} from "react";
import {DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input} from "antd";
import {Link, useNavigate} from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";
import {ReactComponent as CopyButton} from "../../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import {CloseOutlined, DownOutlined} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";
import "./WithdrawalStatus.scss";
import {fetchWithdrawalsStatus} from "../../../store/NewReducers/advanceStatistics";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {exportDataReq} from "../../../store/NewReducers/exportSlice";
import {returnMessages} from "../../../store/reducers/message";
import {returnErrors} from "../../../store/reducers/error";

const {Option} = Select;
const {RangePicker} = DatePicker;

const WithdrawalStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState();
  const defaultDates = [dayjs().subtract(7, "day"), dayjs()];
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusModelVisible, setStatusModelVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);

  const {withdrawalsStatus, isLoading} = useSelector((state) => state.advanceStatistics);
  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&search=${searchText}`;
    }

    dispatch(fetchWithdrawalsStatus({idToken, query}));
    console.log(query);
  }, [dispatch, idToken, pageNo, pageSize, searchText]);

  console.log("withdrawalsStatus", withdrawalsStatus);

  const columns = [
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (text) => (text !== null && text !== undefined ? `$${text.toFixed(2)}` : "-"),
    },
    {
      title: "MT4 Amount",
      dataIndex: "mt4_amount",
      key: "mt4_amount",
      render: (text) => (text !== null && text !== undefined ? `$${text.toFixed(2)}` : "-"),
    },
    {
      title: "Client Amount",
      dataIndex: "client_amount",
      key: "client_amount",
      render: (text) => (text !== null && text !== undefined ? `$${text.toFixed(2)}` : "-"),
    },
    {
      title: "Profit Share",
      dataIndex: "profit_share",
      key: "profit_share",
      render: (text) => (text !== null && text !== undefined ? `${text}%` : "-"),
    },
    {
      title: "Payable Amount",
      dataIndex: "payable_amount",
      key: "payable_amount",
      render: (text) => (text !== null && text !== undefined ? `$${text.toFixed(2)}` : "-"),
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
      render: (text) => (text !== null && text !== undefined ? `$${text.toFixed(2)}` : "-"),
    },
    {
      title: "Total Payable",
      dataIndex: "total_payable",
      key: "total_payable",
      render: (text) => (text !== null && text !== undefined ? `$${text.toFixed(2)}` : "-"),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (text) => text || "-",
    },
    {
      title: "Started On",
      dataIndex: "started_on",
      key: "started_on",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "created_on",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Next Payout Date",
      dataIndex: "next_payout_date",
      key: "next_payout_date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Trade From",
      dataIndex: "trade_from",
      key: "trade_from",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <div className="status_btn">{text || "-"}</div>,
    },
    {
      title: "Is Expected",
      dataIndex: "is_expected",
      key: "is_expected",
      render: (text) => (text ? "Yes" : "No"),
    },
  ];

  const statusMenu = (key, record) => (
    <Menu onClick={(e) => openStatusUpdateModal(e.key, record)}>
      <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Flagged">Flagged</Menu.Item>
      <Menu.Item key="Dismissed">Dismissed</Menu.Item>
    </Menu>
  );

  const handleUpdateStatus = () => {
    console.log(userToUpdate, updatedStatus);
    setStatusModelVisible(false);
  };

  const openStatusUpdateModal = (updatedValue, record) => {
    setUserToUpdate(record);
    setUpdatedStatus(updatedValue);
    setStatusModelVisible(true);
    setModalAction("Update Status");
  };

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const handleTabChange = (value) => {
    setPageNo(1);
    setActiveTab(value);
  };

  const handleCategoryChange = (value) => {
    setPageNo(1);
    setCategory(value);
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  function updateDateRange(dates) {
    setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates(null);
    }
  }

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]},
  ];

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDateChange = (values) => {
    if (values) {
      setDates(values);
    }
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  const handleExport = () => {
    if (dates.length === 2) {
      const [startDate, endDate] = dates;
      const url = `withdrawals/status/export/?start_date=${startDate}&end_date=${endDate}`;

      dispatch(exportDataReq({idToken, url}))
        .unwrap()
        .then((response) => {
          const {s3_file_url, filename} = response;

          const link = document.createElement("a");
          link.href = s3_file_url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          dispatch(returnMessages("Export Successful", 200));

          handleCloseModal();
        })
        .catch((error) => {
          dispatch(returnErrors("Export failed", 400));
        });
    } else {
      notification.warning({
        message: "Invalid Dates",
        description: "Please select a valid date range.",
      });
    }
  };

  return (
    <div className="withdrawal_status_container">
      <div className="table_header_filter">
        <div className="header_left">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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
          <div className="header_middle">
            <div className="filter_btns">
              <Button
                className={activeTab === "all" ? "active" : ""}
                onClick={() => handleTabChange("all")}
              >
                In Loss
              </Button>
              <Button
                className={activeTab === "paid" ? "active" : ""}
                onClick={() => handleTabChange("paid")}
              >
                Pending
              </Button>
              <Button
                className={activeTab === "unpaid" ? "active" : ""}
                onClick={() => handleTabChange("unpaid")}
              >
                New
              </Button>
            </div>
          </div>
        </div>
        <div className="export_btn">
          <Button onClick={handleOpenModal}>
            <img
              src={exportBtnIcon}
              alt="export_btn_icon"
            />
            Export
          </Button>
          <Link
            className="link"
            to={"/advance-statistics/withdrawal-status/export-history"}
          >
            View Export History
          </Link>
        </div>
      </div>
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={withdrawalsStatus?.results}
          columns={columns}
          totalPages={Math.ceil(withdrawalsStatus?.count / pageSize)}
          totalItems={withdrawalsStatus?.count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}
      <Modal
        title="Export"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        className="export_modal"
        closeIcon={<CloseOutlined style={{color: "#fff"}} />}
      >
        <div className="export_modal_wrapper">
          <RangePicker
            onChange={updateDateRange}
            autoFocus
            presets={rangePresets}
            style={{width: "100%"}}
          />
        </div>
        <p style={{color: "#fff"}}>File will contain information of the date you’ve selected.</p>
        <div className="btn_wrapper">
          <Button
            type="primary"
            onClick={handleExport}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              color: "#fff",
            }}
          >
            Export
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawalStatus;
