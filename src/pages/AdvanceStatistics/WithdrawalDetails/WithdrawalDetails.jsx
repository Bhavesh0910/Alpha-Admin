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
import "./WithdrawalDetails.scss";
import {fetchWithdrawalsDetails, fetchWithdrawalsStatus} from "../../../store/NewReducers/advanceStatistics";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {exportDataReq} from "../../../store/NewReducers/exportSlice";
import {returnMessages} from "../../../store/reducers/message";
import {returnErrors} from "../../../store/reducers/error";

const {Option} = Select;
const {RangePicker} = DatePicker;

const WithdrawalDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("New");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState(null);
  const [exportDates, setExportDates] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusModelVisible, setStatusModelVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);

  const {withdrawalsDetails, isLoading} = useSelector((state) => state.advanceStatistics);
  const {isLoading: isExportLoading} = useSelector((state) => state.export);
  const {idToken} = useSelector((state) => state.auth);
  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]}, // Assuming "All time" covers a very long period
  ];

  useEffect(() => {
    let query = `&page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&plan_size=${searchText}`;
    }

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      query += `&start_date=${startDate}&end_date=${endDate}`;
    }

    dispatch(fetchWithdrawalsDetails({idToken, query}));
    console.log(query);
  }, [dispatch, idToken, pageNo, pageSize, searchText, dates]);

  const columns = useMemo(() => [
    {
      title: "ACG Share",
      dataIndex: "acg_share",
      key: "acg_share",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Client Share",
      dataIndex: "client_share",
      key: "client_share",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 80,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
      width: 80,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Plan Name",
      dataIndex: "plan_name",
      key: "plan_name",
      width: 70,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Plan Size",
      dataIndex: "plan_size",
      key: "plan_size",
      width: 80,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => {
        return <div className={`status_btn status_green`}>{text || "-"}</div>;
      },
    },
    {
      title: "Withdrawal Amt",
      dataIndex: "withdrawl_amount",
      key: "withdrawal_amount",
      width: 110,
      render: (text) => (text ? `$${text.toFixed(2)}` : "-"),
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
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
      console.log(dates);
    } else {
      setDates([]);
    }
  };

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
    if (exportDates && exportDates?.length === 2) {
      const [startDate, endDate] = exportDates;
      const url = `withdrawals/details/export/?start_date=${startDate}&end_date=${endDate}`;

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
    <>
      {/* {isExportLoading && <LoaderOverlay />} */}
      <div className="withdrawal_details_container">
        <div className="header_boxx">
          <h1 style={{color: "white"}}>Approved Withdrawal</h1>
        </div>
        <div className="table_header_filter">
          <div className="header_left">
            <div className="search_box_wrapper">
              {/* <Select
              className="category_dropdown"
              defaultValue="all"
              onChange={handleCategoryChange}
            >
              <Option value="all">All Categories</Option>
          
            </Select> */}
              <input
                placeholder="Search by Plan Size..."
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
              <RangePicker
                presets={rangePresets}
                onChange={updateDateRange}
              />
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
            data={withdrawalsDetails?.results || []}
            columns={columns}
            totalPages={Math.ceil(withdrawalsDetails?.count / pageSize)}
            totalItems={withdrawalsDetails?.count}
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
    </>
  );
};

export default WithdrawalDetails;
