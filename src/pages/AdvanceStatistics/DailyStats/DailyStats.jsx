import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";
import { ReactComponent as CopyButton } from "../../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import "./DailyStats.scss";
import { fetchDailyStats, fetchWithdrawalsStatus } from "../../../store/NewReducers/advanceStatistics";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { exportDataReq } from "../../../store/NewReducers/exportSlice";
import { returnMessages } from "../../../store/reducers/message";
import { returnErrors } from "../../../store/reducers/error";

const { Option } = Select;
const { RangePicker } = DatePicker;

const DailyStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState(null);
  const [exportDates, setExportDates] = useState(null);
  const defaultDates = [dayjs().subtract(7, "day"), dayjs()];
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusModelVisible, setStatusModelVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);

  const { dailyStats, isLoading } = useSelector((state) => state.advanceStatistics);
  const { isLoading: isExportLoading } = useSelector((state) => state.export);
  const { idToken } = useSelector((state) => state.auth);


  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&plan_type=${searchText}`;
    }

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      query += `&start_date=${startDate}&end_date=${endDate}`;
    }

    dispatch(fetchDailyStats({ idToken, query, dispatch }));
    console.log(query);
  }, [dispatch, idToken, pageNo, pageSize, searchText, dates]);

  const columns = useMemo(() => [
    {
        title: "",
        key: "overall",
        children: [
            {
                title: "Date",
                dataIndex: "Date",
                key: "Date",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Requests",
                dataIndex: "Total_request",
                key: "total_requests",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Approved",
                dataIndex: "total_approved",
                key: "total_approved",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Customers",
                dataIndex: "total_customer",
                key: "total_customers",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Breached",
                dataIndex: "total_breached",
                key: "total_breached",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Passed",
                dataIndex: "total_passed",
                key: "total_passed",
                width: 180,
                render: (text) => text || "N/A",
            },
        ],
    },
    {
        title: "Alpha Pro",
        key: "alpha_pro",
        children: [
            {
                title: "Passed",
                dataIndex: ["ALPHA PRO", "passed"],
                key: "alpha_pro_passed",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Breached",
                dataIndex: ["ALPHA PRO", "breached"],
                key: "alpha_pro_breached",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Accounts",
                dataIndex: ["ALPHA PRO", "total_accounts"],
                key: "alpha_pro_total_accounts",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "New",
                dataIndex: ["ALPHA PRO", "new"],
                key: "alpha_pro_new",
                width: 150,
                render: (text) => text || "N/A",
            },
        ],
    },
    {
        title: "Alpha Pro Plus",
        key: "alpha_pro_plus",
        children: [
            {
                title: "Passed",
                dataIndex: ["ALPHA PRO PLUS", "passed"],
                key: "alpha_pro_plus_passed",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Breached",
                dataIndex: ["ALPHA PRO PLUS", "breached"],
                key: "alpha_pro_plus_breached",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Accounts",
                dataIndex: ["ALPHA PRO PLUS", "total_accounts"],
                key: "alpha_pro_plus_total_accounts",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "New",
                dataIndex: ["ALPHA PRO PLUS", "new"],
                key: "alpha_pro_plus_new",
                width: 150,
                render: (text) => text || "N/A",
            },
        ],
    },
    {
        title: "Swing",
        key: "swing",
        children: [
            {
                title: "Passed",
                dataIndex: ["SWING", "passed"],
                key: "swing_passed",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Breached",
                dataIndex: ["SWING", "breached"],
                key: "swing_breached",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "Total Accounts",
                dataIndex: ["SWING", "total_accounts"],
                key: "swing_total_accounts",
                width: 120,
                render: (text) => text || "N/A",
            },
            {
                title: "New",
                dataIndex: ["SWING", "new"],
                key: "swing_new",
                width: 120,
                render: (text) => text || "N/A",
            },
        ],
    },
]);



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

  const updateExportDateRange = (dates) => {
    setPageNo(1);
    if (dates) {
      setExportDates(dates.map((date) => date.format("DD/MMM/YYYY")));
    } else {
      setExportDates([]);
    }
  };

  const updateDateRange = (dates) => {
    setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD/MMM/YYYY")));
      console.log(dates);
    } else {
      setDates([]);
    }
  };

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] },
  ];

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleExport = () => {
    if (exportDates && exportDates?.length === 2) {
      const [startDate, endDate] = exportDates;
      const url = `daily-details/export/?start_date=${startDate}&end_date=${endDate}`;

      dispatch(exportDataReq({ idToken, url }))
        .unwrap()
        .then((response) => {
          const { s3_file_url, filename } = response;

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

  const handleDateChange = (values) => {
    if (values) {
      setDates(values);
    }
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  return (
    <div className="withdrawal_status_container  daily_stats">
      {/* {isExportLoading && <LoaderOverlay />} */}
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
          to={"/advance-statistics/daily-stats/export-history"}
        >
          View Export History
        </Link>
      </div>
      <div className="table_header_filter">
        <div className="header_left">
          {/* <div className="search_box_wrapper">
            <input
              placeholder="Search by Plan Type..."
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
          </div> */}
          <div className="header_middle">
            {/* <div className="filter_btns">
              <Button
                className={activeTab === "all" ? "active" : ""}
                onClick={() => handleTabChange("all")}
              >
                Disabled Funded AC Report
              </Button>
              <Button
                className={activeTab === "paid" ? "active" : ""}
                onClick={() => handleTabChange("paid")}
              >
                Date Filtered AC report
              </Button>
              <Button
                className={activeTab === "unpaid" ? "active" : ""}
                onClick={() => handleTabChange("unpaid")}
              >
                Active AC by Periods
              </Button>
            </div> */}
          </div>
        </div>
      </div>
      {/* <RangePicker
        presets={rangePresets}
        onChange={updateDateRange}
      /> */}
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={dailyStats || []}
          columns={columns}
          totalPages={Math.ceil(dailyStats?.length / pageSize)}
          totalItems={dailyStats?.length}
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
        closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
      >
        <div className="export_modal_wrapper">
          <RangePicker
            onChange={updateExportDateRange}
            autoFocus
            presets={rangePresets}
            style={{ width: "100%" }}
          />
        </div>
        <p style={{ color: "#fff" }}>File will contain information of the date you’ve selected.</p>
        <div className="btn_wrapper">
          <Button
            type="primary"
            onClick={handleExport}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              color: "#fff",
            }}
            loading={isExportLoading}
          >
            Export
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DailyStats;
