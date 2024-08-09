import {Button, DatePicker, Dropdown, Menu, Select, Modal, Form, Input, Table} from "antd";
import moment from "moment";
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import searchIcon from "../../assets/icons/searchIcon.svg";
import comment from "../../assets/icons/comment.svg";
import RightMark from "../../assets/icons/verified_green_circleIcon.svg";
import CrossMark from "../../assets/icons/notverified_red_circleIcon.svg";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {DownOutlined} from "@ant-design/icons";
import "./StageManager.scss";
import {supportListReq, nestedTableDataReq, statusUpdateReq, editCommentReq, updateContactReq, createAccountReq} from "../../store/NewReducers/Support";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import {formatDate, formatDateTime, formatDateTimeNew, FormatUSD} from "../../utils/helpers/string";
const {RangePicker} = DatePicker;

const {Option} = Select;

const StageManager = () => {
  const lookup = require("country-code-lookup");

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [newComment, setNewComment] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setuserToUpdate] = useState(null);

  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const [updatedContract, setUpdatedContract] = useState(null);

  const [status, setStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState(null);
  const {idToken} = useSelector((state) => state.auth);
  const {count, data, isLoading, stageStatusOptions} = useSelector((state) => state.support);
  const [fetchUpdate, setFetchUpdate] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const options = stageStatusOptions || location.pathname === "/support/funded" ? ["In Progress", "Approved", "Failed", "Pending"] : ["New", "Approved", "Rejected", "Flagged"];

  useEffect(() => {
    // console.log("Fetching UseEffect");
    fetchStageList(idToken, pageNo, pageSize, searchText, status, dates);
  }, [searchText, pageNo, pageSize, status, idToken, dates, fetchUpdate]);

  useEffect(() => {
    // console.log("Indirect Update ");
    setDates(null);
    setPageNo(1);
    setPageSize(20);
    setSearchText("");
    setSearch("");
    setStatus("all");
    setFetchUpdate((prev) => !prev);
    // console.log(window.onload)
  }, [location.pathname]);

  async function fetchStageList(idToken, pageNo, pageSize, searchText, status, dates) {
    // console.log("Fteching...");
    let query = "";
    let type;
    let url;
    query = `?page=${pageNo}&page_size=${pageSize}`;

    if (location.pathname === "/support/stage-1" || location.pathname === "/support/stage-2") {
      location.pathname === "/support/stage-1" ? (type = "Stage 1 Pass") : (type = "Stage 2 Pass");
      query = query + `&type=${type}`;
    } else {
      location.pathname === "/support/funded" ? (url = "v2/get/funded/list/") : (url = "v2/get-payout/");
    }

    if (searchText) {
      query += `&search=${searchText}`;
    }
    if (status && status !== "all") {
      query += `&status=${status}`;
    }
    if (dates) {
      query += `&start_date=${dates[0].format("DD MMM YYYY")}&end_date=${dates[1].format("DD MMM YYYY")}`;
    }
    dispatch(supportListReq({idToken, query, url, dispatch}));
  }

  function updateDateRange(dates) {
    setPageNo(1);
    if (dates) {
      setDates(dates);
    } else {
      setDates(null);
    }
  }

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const handleTabChange = (key) => {
    setPageNo(1);
    setStatus(key);
  };

  const handleCopyToClipboard = (text) => {
    toast("Copied email", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: "success",
      theme: "dark",
      className: "custom-toast-container",
    });
  };

  const openEditModal = (value, record) => {
    setEditCommentToUpdate(value);
    setuserToUpdate(record);
    setIsModalVisible(true);
    setModalAction("Edit");
  };

  const openStatusUpdateModal = (key, updatedValue, record) => {
    setuserToUpdate(record);
    setUpdatedStatus(updatedValue);
    setIsModalVisible(true);
    setModalAction("Update Status");
  };

  const openContractUpdateModal = (value, record) => {
    setuserToUpdate(record);
    setUpdatedStatus(value);
    setIsModalVisible(true);
    setModalAction("Contract");
  };

  const openCreateAccountModel = (updatedValue, record) => {
    setuserToUpdate(record);
    setUpdatedContract(updatedValue);
    setIsModalVisible(true);
    setModalAction("Create Account");
  };

  const statusMenu = (key, record) => (
    <Menu onClick={(e) => openStatusUpdateModal(key, e.key, record)}>
      <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Flagged">Flagged</Menu.Item>
      <Menu.Item key="Dissmissed">Dissmissed</Menu.Item>
    </Menu>
  );

  const handleUpdateStatus = () => {
    const formData = new FormData();
    formData.append("status", updatedStatus);
    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;
    let isPayoutUpdate = location.pathname === "/support/payout";
    dispatch(statusUpdateReq({idToken, body: formData, id: userId, isPayoutUpdate, updatedStatus, dispatch}));
    setIsModalVisible(false);
  };

  const handleEditComment = () => {
    const formData = new FormData();
    formData.append("comment", editCommentToUpdate);
    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;
    dispatch(editCommentReq({idToken, body: formData, id: userId, dispatch}));
    setIsModalVisible(false);
  };

  const handleContract = () => {
    const formData = new FormData();
    formData.append("issue_contract", updatedContract);
    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;
    dispatch(updateContactReq({idToken, body: formData, userId, dispatch}));
    setIsModalVisible(false);
  };

  const handleCreateAccount = () => {
    const body = {id: userToUpdate?.id};
    dispatch(createAccountReq({idToken, body, dispatch}));
    setIsModalVisible(false);
  };

  const navigate = useNavigate();

  const columns = useMemo(() => {
    switch (location.pathname) {
      case "/support/stage-1":
      case "/support/stage-2":
        return [
          {
            title: "Account",
            dataIndex: "account_id",
            key: "account_id",
            render: (text, row) => (
              <Link
                to="/trader-overview"
                // onClick={() => handleActiveAccount(row, "account")}
              >
                {text ? text : "-"}
              </Link>
            ),
          },
          // Table.EXPAND_COLUMN,
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => (
              <div className="column_one_wrapper">
                {/* <div
                      className="sno_wrapper"
                      style={{
                        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                      }}
                    >
                      {text && text.charAt(0).toUpperCase()}
                    </div> */}
                <div>{text}</div>
                {/* <CopyToClipboard onCopy={() => handleCopyToClipboard(text)} text={text}>
                      <p
                        className="table_copy_button"
                        style={{
                          marginRight: "20px",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="24" height="24" rx="12" fill="#1E1E1E" />
                          <path
                            d="M17.886 12.574C18 12.2987 18 11.9487 18 11.25C18 10.5513 18 10.2013 17.886 9.926C17.8106 9.74395 17.7001 9.57854 17.5608 9.43922C17.4215 9.29989 17.256 9.18938 17.074 9.114C16.7987 9 16.4487 9 15.75 9H11.4C10.56 9 10.14 9 9.81933 9.16333C9.53684 9.30719 9.30719 9.53684 9.16333 9.81933C9 10.1393 9 10.5593 9 11.4V15.75C9 16.4487 9 16.7987 9.114 17.074C9.26667 17.4413 9.55867 17.734 9.926 17.886C10.2013 18 10.5513 18 11.25 18C11.9487 18 12.2987 18 12.574 17.886M17.886 12.574C17.8106 12.756 17.7001 12.9215 17.5608 13.0608C17.4215 13.2001 17.256 13.3106 17.074 13.386C16.7987 13.5 16.4487 13.5 15.75 13.5C15.0513 13.5 14.7013 13.5 14.426 13.614C14.244 13.6894 14.0785 13.7999 13.9392 13.9392C13.7999 14.0785 13.6894 14.244 13.614 14.426C13.5 14.7013 13.5 15.0513 13.5 15.75C13.5 16.4487 13.5 16.7987 13.386 17.074C13.3106 17.256 13.2001 17.4215 13.0608 17.5608C12.9215 17.7001 12.756 17.8106 12.574 17.886M17.886 12.574C17.5275 13.8107 16.8678 14.9391 15.9661 15.8582C15.0645 16.7774 13.9489 17.4585 12.7193 17.8407L12.574 17.886M15 9V8.4C15 7.56 15 7.14 14.8367 6.81933C14.693 6.53694 14.4636 6.3073 14.1813 6.16333C13.86 6 13.44 6 12.6 6H8.4C7.56 6 7.14 6 6.81933 6.16333C6.53684 6.30719 6.30719 6.53684 6.16333 6.81933C6 7.13933 6 7.55933 6 8.4V12.6C6 13.44 6 13.86 6.16333 14.1807C6.30733 14.4633 6.53667 14.6927 6.81933 14.8367C7.13933 15 7.56 15 8.40067 15H9"
                            stroke="#36D66B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </p>
                    </CopyToClipboard> */}
              </div>
            ),
          },
          // Table.SELECTION_COLUMN,
          {
            title: "Full Name",
            dataIndex: "username",
            key: "username",
            render: (text) => (text ? text : "-"),
          },
          {
            title: "Flag",
            dataIndex: "country",
            key: "country",
            render: (country) => {
              const countryName = country;
              const countryCode = lookup.byCountry(countryName);
              if (countryCode) {
                return (
                  <div className="country_name_wrapper">
                    <ReactCountryFlag
                      countryCode={countryCode.internet === "UK" ? "GB" : countryCode.internet}
                      svg={true}
                      aria-label={countryName}
                    />
                  </div>
                );
              } else {
                return <span>{countryName}</span>;
              }
            },
          },
          {
            title: "Funded",
            dataIndex: "funded_account",
            key: "funded_account",
            render: (text, row) => (
              <Link
                to="/traders-list-2"
                // onClick={() => handleActiveAccount(row, "funded_account")}
              >
                {text ? text : "-"}
              </Link>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    width: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  <p
                    className={text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Failed" ? "failed" : text === "Pending" ? "pending" : ""}
                  >
                    {text}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Email Generated",
            dataIndex: "email_sent",
            key: "email_sent",
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Credential Generated",
            dataIndex: "credential_generated",
            key: "credential_generated",
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Contract Issued",
            dataIndex: "issue_contract",
            key: "issue_contract",
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "KYC Verified",
            dataIndex: "is_kyc_verified",
            key: "is_kyc_verified",
            render: (text) => (
              <img
                width={"25px"}
                src={text ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Payment",
            dataIndex: "is_payment_verified",
            key: "is_payment_verified",
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Date (created at)",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          },
          {
            title: "Date (last updated)",
            dataIndex: "updated_at",
            key: "updated_at",
            render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          },
          {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            render: (text, record, index) =>
              text ? (
                <div className="comment_box">
                  <p>{text}</p>
                  <img
                    src={comment}
                    alt="comment"
                    className="edit-icon"
                    onClick={() => openEditModal(text, record)}
                  />
                </div>
              ) : (
                <Button onClick={() => openEditModal(text, record)}>Add Comment</Button>
              ),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(index)}
                trigger={["click"]}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    width: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  <p
                    className={
                      text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Flagged" ? "flagged" : text === "Rejected" ? "rejected" : text === "New" ? "new" : ""
                    }
                  >
                    {text === "in_progress" ? "In Progress" : text === "Approved" ? "Approved" : text === "Flagged" ? "Flagged" : text === "Rejected" ? "Rejected" : text === "New" ? "New" : ""}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Phase 1 ID",
            dataIndex: "subject",
            key: "subject",
            render: (text) => "-",
            // text.split(" ")[0].split("(")[1].slice(0, -1)
            // console.log("Text : ", text.split(" ")[0].split("(")[1].slice(0, -1))
            // return text.split(" ").split("(");
            // }
          },
          {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (text, record) => (
              <Button
                onClick={() => navigate(`/account-analysis/${record.account_id}`)}
                className="account_metrics_btn"
              >
                Account Metrics
              </Button>
            ),
          },
          {
            title: "Action",
            key: "action",
            render: (text, row) => (
              // <Dropdown
              //   overlay={
              //     <Menu>
              //       <Menu.Item onClick={() => handleGenerateContract(row)}>{row.contract_issued ? "Revoke" : "Generate"} Contract</Menu.Item>
              //       <Menu.Item onClick={() => handleGenerateContract(row)}>Create Account</Menu.Item>
              //     </Menu>
              //   }
              //   trigger={["click"]}
              // >
              <Button
                className="action_btn standard_button"
                onClick={() => openCreateAccountModel(row)}
              >
                Create Account
              </Button>
              // </Dropdown>
            ),
          },
        ];
        break;
      case "/support/funded":
        return [
          {
            title: "Flag",
            dataIndex: "flag",
            key: "flag",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Account Number",
            dataIndex: "login_id",
            key: "accountNumber",
          },
          {
            title: "Max Loss",
            dataIndex: "stats",
            key: "stats",
            render: (text) => (text?.max_loss ? text?.max_loss.toFixed(2) : "-"),
          },
          {
            title: "Daily Loss",
            dataIndex: "stats",
            key: "stats",
            render: (text) => (text?.max_daily_loss ? text?.max_daily_loss?.toFixed(2) : "-"),
          },
          {
            title: "Profit",
            dataIndex: "stats",
            key: "stats",
            render: (text) => (text?.profit ? text?.profit?.toFixed(2) : "-"),
          },
          {
            title: "Balance",
            dataIndex: "stats",
            key: "stats",
            render: (text) => {
              return text?.balance ? text?.balance : "-";
            },
          },
          {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            render: (text, record, index) =>
              text ? (
                <div className="comment_box">
                  <p>{text}</p>
                  <img
                    src={comment}
                    alt="comment"
                    className="edit-icon"
                    onClick={() => openEditModal(text, record)}
                  />
                </div>
              ) : (
                <Button onClick={() => openEditModal(text, record)}>Add Comment</Button>
              ),
          },
          {
            title: "Status",
            dataIndex: "progress",
            key: "progress",
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    width: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  <p
                    className={text === "All" ? "all" : text === "Approved" ? "approved" : text === "Failed" ? "failed" : text === "Pending" ? "pending" : text === "In Progress" ? "in_progress" : ""}
                  >
                    {text}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Phase 1 ID",
            dataIndex: "phase1Id",
            key: "phase1Id",
            render: (text) => (text ? text : "-"),
          },
          {
            title: "Funded ID",
            dataIndex: "fundedId",
            key: "fundedId",
            render: (text) => (text ? text : "-"),
          },
          {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (text, record, index) => <Button className="account_metrics_btn">Account Metrics</Button>,
          },
        ];
        break;
      case "/support/payout":
        return [
          {
            title: "Email",
            dataIndex: "user_email",
            key: "user_email",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "Login ID",
            dataIndex: "login_id",
            key: "login_id",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "Username",
            dataIndex: "user_name",
            key: "user_name",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "KYC",
            dataIndex: "kyc",
            key: "kyc",
            render: (text) => (
              <img
                width={"25px"}
                src={text ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Date (created at)",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          },
          {
            title: "Payment Mode",
            dataIndex: "method",
            key: "method",
            render: (text) => <span>{text}</span>,
          },
          {
            title: "Profit Split",
            dataIndex: "profit_split",
            key: "profit_split",
            render: (text) => <span>{text}%</span>,
          },
          {
            title: "Bonus",
            dataIndex: "bonus",
            key: "bonus",
            render: (text) => (text ? <span>{text}%</span> : "-"),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text) => <span>${text}</span>,
          },
          {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            render: (text, record, index) =>
              text ? (
                <div className="comment_box">
                  <p>{text}</p>
                  <img
                    src={comment}
                    alt="comment"
                    className="edit-icon"
                    onClick={() => openEditModal(text, record)}
                  />
                </div>
              ) : (
                <Button onClick={() => openEditModal(text, record)}>Add Comment</Button>
              ),
          },
          ,
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    width: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  {/* "New", "Approved", "Rejected", "Flagged" */}
                  <p className={text === "New" ? "new" : text === "Approved" ? "approved" : text === "Rejected" ? "rejected" : text === "Flagged" ? "rejected" : ""}>{text}</p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text, row, index) => (
              <>
                <div className="action_button">
                  <Button
                    className="standard_button custom"
                    onClick={() => openContractUpdateModal("Approved", row)}
                  >
                    {"Accept"}
                  </Button>
                  <Button
                    className="reject_button"
                    onClick={() => openContractUpdateModal("Rejected", row)}
                  >
                    {"Reject"}
                  </Button>
                </div>
                {/* <div className="action_button">
                <Button className="standard_button custom">{"Accept/Reject"}</Button>
              </div> */}
              </>
            ),
          },
        ];
        break;
      default:
        break;
    }
  }, [location.pathname]);

  if (location.pathname === "/support/stage-2") {
    columns.push({
      title: "Contract",
      dataIndex: "issue_contract",
      key: "issue_contract",
      render: (text, row) => (
        <Button
          className="action_btn standard_button"
          onClick={() => openContractUpdateModal(!text, row)}
        >
          {text ? "Revoke" : "Generate"}
        </Button>
      ),
    });
  }

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  let viewLogsLink;

  if (location.pathname === "/support/stage-1" || location.pathname === "/support/stage-2") {
    viewLogsLink = location.pathname === "/support/stage-1" ? "/support/stage-1/logs" : "/support/stage-2/logs";
  } else if (location.pathname === "/support/funded") {
    viewLogsLink = "/funded/funded-view-logs";
  } else if (location.pathname === "/support/payout") {
    viewLogsLink = "/support/payout/payout-view-logs";
  }

  return (
    <div className="stageManager_container">
      <div className="header_wrapper">
        <h2>{location.pathname.split("/")[2].charAt(0).toUpperCase() + location.pathname.split("/")[2].slice(1)}</h2>
        <Button
          onClick={() => navigate(viewLogsLink)}
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
            // onChange={handleCategoryChange}
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

        <div className="filter_buttons">
          <Button
            className={status === "all" ? "active" : ""}
            onClick={() => handleTabChange("all")}
          >
            All
          </Button>
          {options?.map((item) => (
            <Button
              className={status === `${item}` ? "active" : ""}
              onClick={() => handleTabChange(`${item}`)}
            >
              {item}
            </Button>
          ))}
        </div>
        <RangePicker
          value={dates ? [dayjs(dates[0], "YYYY-MM-DD"), dayjs(dates[0], "YYYY-MM-DD")] : null}
          onChange={updateDateRange}
          autoFocus
          // presets={rangePresets}
        />
      </div>
      {isLoading && <LoaderOverlay />}

      <AntTable
        columns={columns}
        data={data || []}
        totalPages={Math.ceil(count / pageSize)}
        totalItems={count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
        isExpandable={true}
        // expandedRowRender={ExpandedRowData}
        ExpandedComp={ExpandedRowData}
        rowId={location.pathname === "/support/funded" ? "login_id" : "id"}
      />
      <Modal
        title={modalAction}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditCommentToUpdate(null);
          setuserToUpdate(null);
          setUpdatedContract(null);
        }}
        onOk={modalAction === "Update Status" ? handleUpdateStatus : modalAction === "Edit" ? handleEditComment : modalAction === "Create Account" ? handleCreateAccount : handleContract}
      >
        {modalAction === "Edit" ? (
          <Form.Item label="Edit Comment">
            <Input.TextArea
              value={editCommentToUpdate}
              onChange={(e) => setEditCommentToUpdate(e.target.value)}
              placeholder="Write your comment here.."
            />
          </Form.Item>
        ) : (
          <Form.Item label="Comment">
            value={editCommentToUpdate}
            onChange={(e) => setEditCommentToUpdate(e.target.value)}
            <Input.TextArea placeholder="Write your comment here.." />
          </Form.Item>
        )}
      </Modal>
    </div>
  );
};

export default StageManager;

function ExpandedRowData({record}) {
  const location = useLocation();
  const [url, setUrl] = useState();
  const {idToken} = useSelector((state) => state.auth);
  const {nestedTableData, isLoading} = useSelector((state) => state.support);
  const dispatch = useDispatch();

  useEffect(() => {
    switch (location.pathname) {
      case "/support/stage-1":
      case "/support/stage-2":
        setUrl(`support/admin/get//details/${record.id}/`);
        break;
      case "/support/funded":
        setUrl(`v2/get/funded/details/${record.login_id}/`);
        break;
      case "/support/payout":
        setUrl(`v2/get-payout-details/${record.id}/`);
        break;
      default:
        break;
    }
  }, [record]);

  useEffect(() => {
    let flag = location.pathname === "/support/stage-1" || location.pathname === "/support/stage-2" ? true : false;
    dispatch(nestedTableDataReq({idToken, url, flag, dispatch}));
  }, [url]);

  const martingleStatus = nestedTableData?.martingale?.status || nestedTableData?.martingale_status;

  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="nestedTable">
          <div>
            <div>Martingle</div>
            {/* <div>{nestedTableData?.contact}</div> */}
            <button className={`${martingleStatus === "Success" ? "status_success" : "notButton"}`}>Success</button>
          </div>
          <div>
            <div>Max Loss</div>
            <p>{FormatUSD(nestedTableData?.drawdown_result?.max_loss?.result || nestedTableData?.max_loss || 0)}</p>
          </div>
          <div>
            <div>Max Daily Loss</div>
            <p>{FormatUSD(nestedTableData?.drawdown_result?.max_daily_loss?.result || nestedTableData?.max_daily_loss || 0)}</p>
          </div>
          <div>
            <div>Min Trading Day</div>
            <p>{nestedTableData?.trading_days?.result || "-"}</p>
          </div>
          <div>
            <div>Purchased date</div>
            <p>{nestedTableData?.purchase_date || "-"}</p>
          </div>
          <div className="date_time">
            <div>Account Started</div>
            <p>{formatDateTimeNew(nestedTableData?.start_date || "-")}</p>
          </div>
          <div>
            <div>Risk Report</div>
            <p>{nestedTableData?.risk_reports || "-"}</p>
          </div>
          <div className="date_time">
            <div>Account Passed</div>
            <p>{formatDateTimeNew(nestedTableData?.pass_date || "-")}</p>
          </div>
        </div>
      )}
    </>
  );
}
