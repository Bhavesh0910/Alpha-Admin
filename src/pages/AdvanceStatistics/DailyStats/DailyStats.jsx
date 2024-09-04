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
import "./DailyStats.scss";
import {fetchDailyStats, fetchWithdrawalsStatus} from "../../../store/NewReducers/advanceStatistics";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {exportDataReq} from "../../../store/NewReducers/exportSlice";
import {returnMessages} from "../../../store/reducers/message";
import {returnErrors} from "../../../store/reducers/error";

const {Option} = Select;
const {RangePicker} = DatePicker;

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

  const {dailyStats, isLoading} = useSelector((state) => state.advanceStatistics);
  const {isLoading: isExportLoading} = useSelector((state) => state.export);
  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&plan_type=${searchText}`;
    }

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      query += `&start_date=${startDate}&end_date=${endDate}`;
    }

    dispatch(fetchDailyStats({idToken, query, dispatch}));
    console.log(query);
  }, [dispatch, idToken, pageNo, pageSize, searchText, dates]);

  const columns = useMemo(() => [
    {
      title: "",
      key: "",
      children: [
        {
          title: "Plan Type",
          dataIndex: "plan_type",
          key: "plan_type",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Created Date",
          dataIndex: "created_date",
          key: "created_date",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Passed",
          dataIndex: "passed",
          key: "passed",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Breached",
          dataIndex: "breached",
          key: "breached",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Total Accounts",
          dataIndex: "total_accounts",
          key: "total_accounts",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Repeated",
          dataIndex: "repeated",
          key: "repeated",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "New",
          dataIndex: "new",
          key: "new",
          width: 60,
          render: (text) => text || "-",
        },
      ],
    },
    {
      title: "Alpha Pro",
      key: "alpha_pro",
      children: [
        {
          title: "Passed",
          dataIndex: ["Alpha pro", "passed"],
          key: "alpha_pro_passed",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Breached",
          dataIndex: ["Alpha pro", "breached"],
          key: "alpha_pro_breached",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Total Accounts",
          dataIndex: ["Alpha pro", "total_accounts"],
          key: "alpha_pro_total_accounts",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Repeated",
          dataIndex: ["Alpha pro", "repeated"],
          key: "alpha_pro_repeated",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "New",
          dataIndex: ["Alpha pro", "new"],
          key: "alpha_pro_new",
          width: 60,
          render: (text) => text || "-",
        },
      ],
    },
    {
      title: "Free Trial",
      key: "free_trial",
      children: [
        {
          title: "Passed",
          dataIndex: ["Free Trial", "passed"],
          key: "free_trial_passed",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Breached",
          dataIndex: ["Free Trial", "breached"],
          key: "free_trial_breached",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Total Accounts",
          dataIndex: ["Free Trial", "total_accounts"],
          key: "free_trial_total_accounts",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Repeated",
          dataIndex: ["Free Trial", "repeated"],
          key: "free_trial_repeated",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "New",
          dataIndex: ["Free Trial", "new"],
          key: "free_trial_new",
          width: 60,
          render: (text) => text || "-",
        },
      ],
    },
    {
      title: "Scaling",
      key: "scaling",
      children: [
        {
          title: "Passed",
          dataIndex: ["Scaling", "passed"],
          key: "scaling_passed",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Breached",
          dataIndex: ["Scaling", "breached"],
          key: "scaling_breached",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Total Accounts",
          dataIndex: ["Scaling", "total_accounts"],
          key: "scaling_total_accounts",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Repeated",
          dataIndex: ["Scaling", "repeated"],
          key: "scaling_repeated",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "New",
          dataIndex: ["Scaling", "new"],
          key: "scaling_new",
          width: 60,
          render: (text) => text || "-",
        },
      ],
    },
    {
      title: "Swing",
      key: "swing",
      children: [
        {
          title: "Passed",
          dataIndex: ["Swing", "passed"],
          key: "swing_passed",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Breached",
          dataIndex: ["Swing", "breached"],
          key: "swing_breached",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Total Accounts",
          dataIndex: ["Swing", "total_accounts"],
          key: "swing_total_accounts",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Repeated",
          dataIndex: ["Swing", "repeated"],
          key: "swing_repeated",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "New",
          dataIndex: ["Swing", "new"],
          key: "swing_new",
          width: 60,
          render: (text) => text || "-",
        },
      ],
    },
    {
      title: "Alpha Pro Plus",
      key: "alpha_pro_plus",
      children: [
        {
          title: "Passed",
          dataIndex: ["Alpha Pro Plus", "passed"],
          key: "alpha_pro_plus_passed",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Breached",
          dataIndex: ["Alpha Pro Plus", "breached"],
          key: "alpha_pro_plus_breached",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "Total Accounts",
          dataIndex: ["Alpha Pro Plus", "total_accounts"],
          key: "alpha_pro_plus_total_accounts",
          width: 120,
          render: (text) => text || "-",
        },
        {
          title: "Repeated",
          dataIndex: ["Alpha Pro Plus", "repeated"],
          key: "alpha_pro_plus_repeated",
          width: 80,
          render: (text) => text || "-",
        },
        {
          title: "New",
          dataIndex: ["Alpha Pro Plus", "new"],
          key: "alpha_pro_plus_new",
          width: 60,
          render: (text) => text || "-",
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

  const handleExport = () => {
    if (exportDates && exportDates?.length === 2) {
      const [startDate, endDate] = exportDates;
      const url = `daily-details/export/?start_date=${startDate}&end_date=${endDate}`;

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
          <div className="search_box_wrapper">
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
          </div>
          <div className="header_middle">
            <div className="filter_btns">
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
            </div>
          </div>
        </div>
      </div>
      <RangePicker
        presets={rangePresets}
        onChange={updateDateRange}
      />
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={dailyStats?.results || []}
          columns={columns}
          totalPages={Math.ceil(dailyStats?.count / pageSize)}
          totalItems={dailyStats?.count}
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
            onChange={updateExportDateRange}
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
