import {Button, DatePicker, Dropdown, Menu, Select, Modal, Form, Input, Table, Alert, Tag, notification} from "antd";
import moment from "moment";
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import searchIcon from "../../assets/icons/searchIcon.svg";
import commentIcon from "../../assets/icons/comment.svg";
import RightMark from "../../assets/icons/verified_green_circleIcon.svg";
import createIcon from "../../assets/icons/createAcc.svg";
import AccIcon from "../../assets/icons/acc-metrics.svg";
import addIcon from "../../assets/icons/add-edit.svg";
import acceptIcon from "../../assets/icons/accept.svg";
import rejectIcon from "../../assets/icons/reject.svg";
import toggleGreen from "../../assets/icons/toggle-green.svg";
import toggleRed from "../../assets/icons/toggle-red.svg";
import CrossMark from "../../assets/icons/notverified_red_circleIcon.svg";

import AntTable from "../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {DownOutlined} from "@ant-design/icons";
import "./StageManager.scss";
import {supportListReq, nestedTableDataReq, statusUpdateReq, editCommentReq, updateContactReq, createAccountReq} from "../../store/NewReducers/Support";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import {formatDate, formatDateTime, formatDateTimeNew, FormatUSD} from "../../utils/helpers/string";
import {updateFlagReq} from "../../store/NewReducers/listSlice";
import axios from "axios";
import {baseUrl} from "../../utils/api/apis";
import {returnErrors} from "../../store/reducers/error";
import downloadIcon from "../../assets/icons/download_to_pc.svg";
import {copyToClipboard} from "../../utils/utilityFunctions";
import {data} from "./../AffiliateMarketing/AffiliateRefList/AffiliateRefList";
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

  const [flagUser, setFlagUser] = useState(null);
  const [flagModal, setFlagModel] = useState(false);
  const [flagUpdatedValue, setFlagUpdatedValue] = useState(null);
  const [comment, setComment] = useState(null);

  const [close, setClose] = useState(false);

  const [paymentReference, setPaymentReference] = useState("");

  const [reason, setReason] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const [maxReasonChar, setMaxReasonChar] = useState(false);
  const [status, setStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState(null);
  const {idToken} = useSelector((state) => state.auth);
  const {count, data, isLoading, stageStatusOptions, refetch} = useSelector((state) => state.support);
  const {refetch: listRefetch} = useSelector((state) => state.list);
  const [specialCount, setSpecialCount] = useState(0);
  const [fetchUpdate, setFetchUpdate] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const options =
    stageStatusOptions || location.pathname === "/support/funded"
      ? ["New", "In Progress", "Flagged", "Dissmissed", "Rejected", "Approved"]
      : ["New", "In Progress", "Flagged", "Dissmissed", "Rejected", "Approved"];
  useEffect(() => {
    fetchStageList(idToken, pageNo, pageSize, searchText, status, dates);
  }, [searchText, pageNo, pageSize, status, idToken, dates, refetch, fetchUpdate, listRefetch]);

  useEffect(() => {
    // console.log("Indirect Update ");
    setDates(null);
    setPageNo(1);
    setPageSize(20);
    setSearchText("");
    setSearch("");
    setStatus("all");
    if (specialCount > 0) {
      setFetchUpdate((prev) => !prev);
    }
    setSpecialCount((prev) => prev + 1);
    // console.log(window.onload)
  }, [location.pathname]);

  async function fetchStageList(idToken, pageNo, pageSize, searchText, status, dates) {
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

  const updateDateRange = (dates) => {
    setPageNo(1);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
        notification.error({
          message: "Invalid Date Range",
          description: `The selected date range (${startDate.format("DD/MMM/YYYY")} - ${endDate.format("DD/MMM/YYYY")}) contains future dates. Please select a valid range.`,
        });

        if (lastValidRange) {
          setDefaultDates([lastValidRange.startDate, lastValidRange.endDate]);
          return;
        }

        setDefaultDates(null);
        setIsValidRange(false);
        return;
      }

      setDates(dates);
      setLastValidRange({startDate, endDate});
      setDefaultDates(dates);
      setIsValidRange(true);
    } else {
      setDates(null);
      setDefaultDates(null);
    }
  };

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
    console.log(" Status : ", key, updatedValue, record);
    setuserToUpdate(record);
    setUpdatedStatus(updatedValue);
    setIsModalVisible(true);
    setModalAction("Update Status");
  };

  const openContractUpdateModal = (value, record, isRisk = false) => {
    console.log(value, record, " value, record");
    setuserToUpdate(record);
    setUpdatedStatus(value);
    setUpdatedContract({value: value, isRisk: isRisk});
    setIsModalVisible(true);
    setModalAction("Contract");
  };

  const openCreateAccountModel = (record) => {
    setuserToUpdate(record);
    console.log(record, " : updatedValue, record");
    // setUpdatedContract(updatedValue);
    setIsModalVisible(true);
    setModalAction("Create Account");
  };

  const statusMenu = (key, record) => (
    <Menu
      className="menuCard"
      onClick={(e) => openStatusUpdateModal(key, e.key, record)}
    >
      <Menu.Item key="New">Action Required</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Flagged">In Review</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="Dissmissed">Subject to interview</Menu.Item>
    </Menu>
  );

  const handleUpdateStatus = () => {
    console.log("I amd here : ", updatedStatus, " ", paymentReference);
    const formData = new FormData();
    formData.append("status", updatedStatus);
    let isPayoutUpdate;

    if (location.pathname === "/support/payout") {
      formData.append("id", userToUpdate?.id);
      formData.append("payment_reference", paymentReference);
      isPayoutUpdate = location.pathname === "/support/payout";
    }
    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;
    dispatch(statusUpdateReq({idToken, body: formData, id: userId, isPayoutUpdate, updatedStatus, dispatch}));
    setIsModalVisible(false);
  };

  const handleEditComment = () => {
    const formData = new FormData();
    formData.append("comment", editCommentToUpdate);
    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;
    dispatch(editCommentReq({idToken, body: formData, id: userId, stage: location.pathname, dispatch}));
    setIsModalVisible(false);
  };

  const handleContract = () => {
    const formData = new FormData();
    if (updatedContract?.isRisk) {
      formData.append("issue_contract", false);
      formData.append("issue_contract", updatedContract?.value);
    } else {
      formData.append("issue_contract", updatedContract?.value);
    }
    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;
    console.log("userId : ", userId);
    dispatch(updateContactReq({idToken, body: formData, id: userId, dispatch}));
    setIsModalVisible(false);
  };

  const handleCreateAccount = () => {
    const body = {id: userToUpdate?.id};
    console.log("userToUpdate?.id", userToUpdate?.id);
    console.log(body, "body");
    dispatch(createAccountReq({idToken, body, dispatch}));
    setIsModalVisible(false);
  };

  const navigate = useNavigate();

  function reset() {
    setFlagUser(null);
    setFlagUpdatedValue(null);
    setComment(null);
  }

  const openFlagUpdateModal = (updatedValue, record) => {
    console.log(updatedValue, record, " updatedValue, record ");

    let user = "";

    if (location.pathname === "/support/stage-1" || location.pathname === "/support/stage-2") {
      user = record?.User_id;
    } else if (location.pathname === "/support/funded") {
      user = record?.user_id;
    } else if (location.pathname === "/support/payout") {
      user = record?.user;
    }
    setFlagModel(true);
    setFlagUser(user);
    setFlagUpdatedValue(updatedValue);
  };

  const statusMenuFlag = (key, record) => (
    <Menu
      className="menuCard"
      onClick={(e) => openFlagUpdateModal(e.key, record)}
    >
      <Menu.Item key="Safe">Safe</Menu.Item>
      <Menu.Item key="Warning">Warning</Menu.Item>
      <Menu.Item key="Blacklisted">Blacklisted</Menu.Item>
    </Menu>
  );

  function handleUpdateFlag() {
    const formData = new FormData();
    formData.append("status", flagUpdatedValue);
    formData.append("notes", comment);

    dispatch(updateFlagReq({idToken, body: formData, id: flagUser?.id}));
    setFlagModel(false);
    reset();
  }
  const columns = useMemo(() => {
    switch (location?.pathname) {
      case "/support/stage-1":
        return [
          {
            title: "Flag",
            dataIndex: "User_id",
            key: "User_id",
            width: 60,
            render: (text, row, index) => (
              <div
                className="flagContainer"
                onClick={() => {
                  setClose(true);
                  setSelectedIndex(index);
                }}
                // onMouseLeave={() => setClose(false)}
              >
                <p className={`flag ${text?.status === "Blacklisted" ? "Red" : text?.status === "Warning" ? "Yellow" : "Green"}`}></p>
                <Dropdown
                  overlay={() => statusMenuFlag(text?.status, row)}
                  open={selectedIndex === index ? close : false}
                  trigger={["click"]}
                  getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}

                  // onMouseLeave={() => setClose(false)}
                >
                  <DownOutlined />
                </Dropdown>
              </div>
            ),
          },
          {
            title: "Account No.",
            dataIndex: "account_id",
            key: "account_id",
            width: 70,
            render: (text, record) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <a
                  href={`/account-analysis/${record?.account_id}/${platform}/${record?.User_id?.id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                  // onClick={() => navigate(`/account-analysis/${record?.account_id}/${platform}/${record?.User_id?.id}`)}
                >
                  {text ? text : "-"}
                </a>
              );
            },
          },
          // Table.EXPAND_COLUMN,
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 70,
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
          // {
          //   title: "Full Name",
          //   dataIndex: "username",
          //   key: "username",
          //   render: (text) => (text ? text : "-"),
          // },
          {
            title: "Country",
            dataIndex: "country",
            key: "country",
            width: 80,
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
          // {
          //   title: "Stage-2",
          //   dataIndex: "stage2_account",
          //   key: "stage2_account",
          //   render: (text, row) => (
          //     <Link
          //       to="/traders-list-2"
          //       // onClick={() => handleActiveAccount(row, "funded_account")}
          //     >
          //       {text ? text : "-"}
          //     </Link>
          //   ),
          // },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 60,
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
                getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    minWidth: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  <p
                    className={
                      text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Rejected" ? "rejected" : text === "Flagged" ? "flagged" : ""
                    }
                  >
                    {text === "New" ? "Action Required" : text === "Dissmissed" ? "Subject to interview" : text === "Failed" ? "Rejected" : text === "Flagged" ? "In review" : text}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Email Generated",
            dataIndex: "email_sent",
            key: "email_sent",
            width: 100,
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          // {
          //   title: "Credential Generated",
          //   dataIndex: "credential_generated",
          //   key: "credential_generated",
          //   width: 100,
          //   render: (text, row) => (
          //     <img
          //       width={"25px"}
          //       src={text || row.status === "approved" ? RightMark : CrossMark}
          //       alt=""
          //     />
          //   ),
          // },
          // {
          //   title: "Date (created at)",
          //   dataIndex: "created_at",
          //   key: "created_at",
          //   render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          // },
          // {
          //   title: "Date (last updated)",
          //   dataIndex: "updated_at",
          //   key: "updated_at",
          //   render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          // },
          // {
          //   title: "Comment",
          //   dataIndex: "comment",
          //   key: "comment",
          //   render: (text, record, index) =>
          //     text ? (
          //       <div className="comment_box">
          //         <p>{text}</p>
          //         <img
          //           src={commentIcon}
          //           alt="comment"
          //           className="edit-icon"
          //           onClick={() => openEditModal(text, record)}
          //         />
          //       </div>
          //     ) : (
          //       <div onClick={() => openEditModal(text, record)}>
          //         <img
          //           src={addIcon}
          //           alt=""
          //         />
          //       </div>
          //     ),
          // },
          {
            title: "Details",
            dataIndex: "details",
            key: "details",
            width: 80,
            render: (text, record) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <Button
                  style={{background: "#c5ffff"}}
                  onClick={() => navigate(`/account-analysis/${record?.account_id}/${platform}/${record?.User_id?.id}`)}
                  className="account_metrics_btn"
                  title="Account Metrics"
                >
                  <img
                    style={{height: "16px"}}
                    src={AccIcon}
                    alt=""
                  />
                </Button>
              );
            },
          },
          {
            title: "Action",
            key: "action",
            width: 80,
            render: (text, row) => (
              <div
                style={{cursor: "pointer"}}
                title="Create Account"
                onClick={() => openCreateAccountModel(row)}
              >
                <img
                  src={createIcon}
                  alt=""
                />
              </div>
              // </Dropdown>
            ),
          },
        ];
      case "/support/stage-2":
        return [
          {
            title: "Flag",
            dataIndex: "User_id",
            key: "User_id",
            render: (text, row) => (
              <div className="flagContainer">
                <p className={`flag ${text?.status === "Blacklisted" ? "Red" : text?.status === "Warning" ? "Yellow" : "Green"}`}></p>
                <Dropdown
                  overlay={() => statusMenuFlag(text?.status, row)}
                  trigger={["click"]}
                  getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
                >
                  <DownOutlined />
                </Dropdown>
              </div>
            ),
          },
          {
            title: "Account No.",
            dataIndex: "account_id",
            key: "account_id",
            width: 80,
            render: (text, record) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <a
                  href={`/account-analysis/${record?.account_id}/${platform}/${record?.User_id?.id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                  // onClick={() => navigate(`/account-analysis/${record?.account_id}/${platform}/${record?.User_id?.id}`)}
                >
                  {text ? text : "-"}
                </a>
              );
            },
          },
          // Table.EXPAND_COLUMN,
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 40,
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
          // {
          //   title: "Full Name",
          //   dataIndex: "username",
          //   key: "username",
          //   render: (text) => (text ? text : "-"),
          // },
          {
            title: "Country",
            dataIndex: "country",
            key: "country",
            width: 80,
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
          // {
          //   title: "Funded",
          //   dataIndex: "funded_account",
          //   key: "funded_account",
          //   render: (text, row) => (
          //     <Link
          //       to="/traders-list-2"
          //       // onClick={() => handleActiveAccount(row, "funded_account")}
          //     >
          //       {text ? text : "-"}
          //     </Link>
          //   ),
          // },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            // width:10,
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
                getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    minWidth: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    // justifyContent: "space-between",
                    // padding: "6px 1px",
                  }}
                >
                  <p
                    className={
                      text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Rejected" ? "rejected" : text === "Flagged" ? "flagged" : ""
                    }
                  >
                    {text === "New" ? "Action Required" : text === "Dissmissed" ? "Subject to interview" : text === "Failed" ? "Rejected" : text}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Email Generated",
            dataIndex: "email_sent",
            key: "email_sent",
            width: 100,
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          // {
          //   title: "Credential Generated",
          //   dataIndex: "credential_generated",
          //   key: "credential_generated",
          //   width: 100,
          //   render: (text, row) => (
          //     <img
          //       width={"25px"}
          //       src={text || row?.status === "approved" ? RightMark : CrossMark}
          //       alt=""
          //     />
          //   ),
          // },
          {
            title: "Contract Issued",
            dataIndex: "issue_contract",
            key: "issue_contract",
            width: 100,
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Admin review",
            dataIndex: "is_kyc_verified",
            key: "is_kyc_verified",
            width: 100,
            render: (text) => (
              <img
                width={"25px"}
                src={text ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          {
            title: "Veriff",
            dataIndex: "veriff_status",
            key: "veriff_status",
            width: 100,
            render: (text) => {
              return typeof text === "string" && text.length > 0 ? text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase() : "-";
            },
          },
          // {
          //   title: "Payment",
          //   dataIndex: "is_payment_verified",
          //   key: "is_payment_verified",
          //   render: (text, row) => (
          //     <img
          //       width={"25px"}
          //       src={text || row.status === "approved" ? RightMark : CrossMark}
          //       alt=""
          //     />
          //   ),
          // },
          // {
          //   title: "Date (created at)",
          //   dataIndex: "created_at",
          //   key: "created_at",
          //   render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          // },
          // {
          //   title: "Date (last updated)",
          //   dataIndex: "updated_at",
          //   key: "updated_at",
          //   render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          // },
          // {
          //   title: "Comment",
          //   dataIndex: "comment",
          //   key: "comment",
          //   width: 80,
          //   render: (text, record, index) =>
          //     text ? (
          //       <div className="comment_box">
          //         <p>{text}</p>
          //         <img
          //           src={commentIcon}
          //           alt="comment"
          //           className="edit-icon"
          //           onClick={() => openEditModal(text, record)}
          //         />
          //       </div>
          //     ) : (
          //       <div onClick={() => openEditModal(text, record)}>
          //         <img
          //           src={addIcon}
          //           alt=""
          //         />
          //       </div>
          //     ),
          // },
          // {
          //   title: "Phase 1 ID",
          //   dataIndex: "subject",
          //   key: "subject",
          //   render: (text) => "-",
          //   // text.split(" ")[0].split("(")[1].slice(0, -1)
          //   // console.log("Text : ", text.split(" ")[0].split("(")[1].slice(0, -1))
          //   // return text.split(" ").split("(");
          //   // }
          // },
          {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (text, record) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <Button
                  style={{background: "#c5ffff"}}
                  onClick={() => navigate(`/account-analysis/${record.account_id}/${platform}/${record?.User_id?.id}`)}
                  className="account_metrics_btn"
                  title="Account Metrics"
                >
                  <img
                    style={{height: "16px"}}
                    src={AccIcon}
                    alt=""
                  />
                </Button>
              );
            },
          },
          {
            title: "Action",
            key: "action",
            width: 67,
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
              <div
                style={{cursor: "pointer"}}
                title="Create Account"
                onClick={() => openCreateAccountModel(row)}
              >
                <img
                  src={createIcon}
                  alt=""
                />
              </div>
              // </Dropdown>
            ),
          },
          {
            title: "Contract",
            dataIndex: "issue_contract",
            key: "issue_contract",
            render: (text, row) => (
              <div>
                <Dropdown
                  className="action_btn standard_button"
                  overlay={
                    <Menu className="menuCard">
                      <Menu.Item onClick={() => openContractUpdateModal(!text, row, false)}>{row?.issue_contract ? "Revoke" : "Generate"} Contract</Menu.Item>
                      <Menu.Item onClick={() => openContractUpdateModal(!text, row, true)}>
                        {row?.meta_data ? (Object.keys(JSON.parse(row?.meta_data)).length > 0 ? "Revoke" : "Generate") : "Generate"} Risk Contract
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button>{text ? "Revoke" : "Generate"}</Button>
                </Dropdown>
                {/* <Button
                  className="action_btn standard_button"
                  onClick={() => openContractUpdateModal(!text, row)}
                >
                  {text ? "Revoke" : "Generate"}
                </Button> */}
              </div>
            ),
          },
        ];
        break;
      case "/support/funded":
        return [
          {
            title: "Flag",
            dataIndex: "user_id",
            key: "user_id",
            render: (text, row) => (
              <div className="flagContainer">
                <p className={`flag ${text?.status === "Blacklisted" ? "Red" : text?.status === "Warning" ? "Yellow" : "Green"}`}></p>
                <Dropdown
                  overlay={() => statusMenuFlag(text?.status, row)}
                  trigger={["click"]}
                  getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
                >
                  <DownOutlined />
                </Dropdown>
              </div>
            ),
          },
          {
            title: "Account No.",
            dataIndex: "login_id",
            key: "accountNumber",
            width: 100,
            render: (text, record) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <a
                  href={`/account-analysis/${record?.login_id}/${platform}/${record?.user_id?.id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                  // onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}/${record?.user_id?.id}`)}
                >
                  {text ? text : "-"}
                </a>
              );
            },
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 80,
          },
          {
            title: "Email Generated",
            dataIndex: "email_sent",
            key: "email_sent",
            width: 100,
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          // {
          //   title: "Credential Generated",
          //   dataIndex: "credential_generated",
          //   key: "credential_generated",
          //   width: 100,
          //   render: (text, row) => (
          //     <img
          //       width={"25px"}
          //       src={text || row.status === "approved" ? RightMark : CrossMark}
          //       alt=""
          //     />
          //   ),
          // },

          {
            title: "Balance",
            dataIndex: "stats",
            key: "stats",
            width: 75,
            render: (text) => {
              return text?.balance ? text?.balance : "-";
            },
          },
          // {
          //   title: "Comment",
          //   dataIndex: "comment",
          //   key: "comment",
          //   width: 80,
          //   render: (text, record, index) =>
          //     text ? (
          //       <div className="comment_box">
          //         <p>{text}</p>
          //         <img
          //           src={commentIcon}
          //           alt="comment"
          //           className="edit-icon"
          //           onClick={() => openEditModal(text, record)}
          //         />
          //       </div>
          //     ) : (
          //       <div onClick={() => openEditModal(text, record)}>
          //         <img
          //           src={addIcon}
          //           alt=""
          //         />
          //       </div>
          //     ),
          // },
          {
            title: "Status",
            dataIndex: "progress",
            key: "progress",
            width: 70,
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
                getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    minWidth: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  <p
                    className={
                      text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Rejected" ? "rejected" : text === "Flagged" ? "flagged" : ""
                    }
                  >
                    {text === "New" ? "Action Required" : text === "Dissmissed" ? "Subject to interview" : text === "Failed" ? "Rejected" : text}{" "}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          // {
          //   title: "Phase 1 ID",
          //   dataIndex: "phase1Id",
          //   key: "phase1Id",
          //   render: (text) => (text ? text : "-"),
          // },
          // {
          //   title: "Funded ID",
          //   dataIndex: "fundedId",
          //   key: "fundedId",
          //   render: (text) => (text ? text : "-"),
          // },
          {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (text, record, index) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <Button
                  style={{background: "#c5ffff"}}
                  onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}/${record?.user_id?.id}`)}
                  className="account_metrics_btn"
                  title="Account Metrics"
                >
                  <img
                    style={{height: "16px"}}
                    src={AccIcon}
                    alt=""
                  />
                </Button>
              );
            },
          },
        ];
        break;
      case "/support/payout":
        return [
          {
            title: "Flag",
            dataIndex: "user",
            key: "user",
            width: 10,
            render: (text, row) => (
              <div className="flagContainer">
                <p className={`flag ${text?.status === "Blacklisted" ? "Red" : text?.status === "Warning" ? "Yellow" : "Green"}`}></p>
                <Dropdown
                  overlay={() => statusMenuFlag(text?.status, row)}
                  trigger={["click"]}
                  getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
                >
                  <DownOutlined />
                </Dropdown>
              </div>
            ),
          },
          {
            title: "Account No.",
            dataIndex: "login_id",
            key: "login_id",
            width: 100,
            render: (text, record) => {
              const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";
              return (
                <a
                  href={`/account-analysis/${record?.login_id}/${platform}/${record?.user?.id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                  // onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}/${record?.user?.id}`)}
                >
                  {text ? text : "-"}
                </a>
              );
            },
          },
          {
            title: "Email",
            dataIndex: "user_email",
            key: "user_email",
            width: 100,
            render: (text) => <span>{text}</span>,
          },
          // {
          //   title: "Username",
          //   dataIndex: "user_name",
          //   key: "user_name",
          //   render: (text) => <span>{text}</span>,
          // },
          {
            title: "Email Generated",
            dataIndex: "email_sent",
            key: "email_sent",
            width: 100,
            render: (text, row) => (
              <img
                width={"25px"}
                src={text || row.status === "approved" ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          // {
          //   title: "Credential Generated",
          //   dataIndex: "credential_generated",
          //   key: "credential_generated",
          //   width: 100,
          //   render: (text, row) => (
          //     <img
          //       width={"25px"}
          //       src={text || row.status === "approved" ? RightMark : CrossMark}
          //       alt=""
          //     />
          //   ),
          // },
          {
            title: "KYC",
            dataIndex: "kyc",
            key: "kyc",
            width: 50,
            render: (text) => (
              <img
                width={"25px"}
                src={text ? RightMark : CrossMark}
                alt=""
              />
            ),
          },
          // {
          //   title: "Date (created at)",
          //   dataIndex: "created_at",
          //   key: "created_at",
          //   render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
          // },
          {
            title: "Payment Mode",
            dataIndex: "method",
            key: "method",
            width: 85,
            render: (text) => <span>{text}</span>,
          },
          {
            title: "Profit Split",
            dataIndex: "profit_split",
            key: "profit_split",
            width: 60,
            render: (text) => <span>{text}%</span>,
          },
          {
            title: "Bonus",
            dataIndex: "performance_bonus",
            key: "bonus",
            width: 65,
            render: (text) => (text ? <span>{text}</span> : "-"),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 80,
            render: (text) => <span>${text}</span>,
          },
          {
            title: "Total Payout",
            dataIndex: "",
            key: "totalPayout",
            width: 80,
            render: (text, record) => <span>{record?.performance_bonus && record?.amount ? `$${record?.performance_bonus + record?.amount}` : "-"} </span>,
          },

          // {
          //   title: "Comment",
          //   dataIndex: "comment",
          //   key: "comment",
          //   width: 80,
          //   render: (text, record, index) =>
          //     text ? (
          //       <div className="comment_box">
          //         <p>{text}</p>
          //         <img
          //           src={commentIcon}
          //           alt="comment"
          //           className="edit-icon"
          //           onClick={() => openEditModal(text, record)}
          //         />
          //       </div>
          //     ) : (
          //       <div onClick={() => openEditModal(text, record)}>
          //         <img
          //           src={addIcon}
          //           alt=""
          //         />
          //       </div>
          //     ),
          // },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            // width:10,
            render: (text, record, index) => (
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
                getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
              >
                <Button
                  icon={<DownOutlined />}
                  className="status_button"
                  style={{
                    minWidth: "120px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                  }}
                >
                  {/* "New", "Approved", "Rejected", "Flagged" */}
                  <p
                    className={
                      text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Rejected" ? "rejected" : text === "Flagged" ? "flagged" : ""
                    }
                  >
                    {text === "New" ? "Action Required" : text === "Dissmissed" ? "Subject to interview" : text === "Failed" ? "Rejected" : text}{" "}
                  </p>
                </Button>
              </Dropdown>
            ),
          },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 90,
            render: (text, row, index) => (
              <>
                <div className="action_button">
                  <div
                    style={{cursor: "pointer"}}
                    title="Accept"
                    onClick={() => openContractUpdateModal("Approved", row)}
                  >
                    <img
                      src={acceptIcon}
                      alt=""
                    />
                  </div>
                  <div
                    style={{cursor: "pointer"}}
                    title="Reject"
                    onClick={() => openContractUpdateModal("Rejected", row)}
                  >
                    <img
                      src={rejectIcon}
                      alt=""
                    />
                  </div>
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
  }, [location.pathname, close]);

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

  const [defaultDates, setDefaultDates] = useState();

  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({startDate: null, endDate: null});

  return (
    <div className="stageManager_container">
      <div className="header_wrapper">
        <h2>{location.pathname.split("/")[2].charAt(0).toUpperCase() + location.pathname.split("/")[2].slice(1)}</h2>

        <div className="supportFilterParent">
          <RangePicker
            value={defaultDates} // Use value prop to control the picker
            autoFocus
            onChange={updateDateRange}
            // presets={rangePresets}
          />
          <Button
            onClick={() => navigate(viewLogsLink)}
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button>
        </div>
      </div>

      <div className="table_header_filter">
        <div className="search_box_wrapper stageSearchBox">
          {/* <Select
            className="category_dropdown"
            defaultValue="all"
            // onChange={handleCategoryChange}
          >
            <Option value="all">All Categories</Option> */}
          {/* <Option value="swift">Swift</Option>
            <Option value="wire">Wire</Option> */}
          {/* </Select> */}
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
              {item === "New" ? "Action Required" : item === "Dissmissed" ? "Subject to interview" : item === "Failed" ? "Rejected" : item}
            </Button>
          ))}
        </div>
        <div className="mobileSelector">
          <Select
            placeholder="Select a filter"
            onChange={handleTabChange}
          >
            <Option
              key={"all"}
              value={"all"}
            >
              All
            </Option>
            {options?.map((item) => (
              <Option
                key={item}
                value={item}
              >
                {item === "New" ? "Action Required" : item === "Dissmissed" ? "Subject to interview" : item === "Failed" ? "Rejected" : item}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <div onMouseLeave={() => setClose(false)}>
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
      </div>
      <Modal
        title={(modalAction === "Contract" && updatedStatus === "Rejected" ? "Reject" : "Approve") + " " + modalAction}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditCommentToUpdate(null);
          setuserToUpdate(null);
          setUpdatedContract(null);
          setPaymentReference(null);
        }}
        onOk={modalAction === "Update Status" ? handleUpdateStatus : modalAction === "Edit" ? handleEditComment : modalAction === "Create Account" ? handleCreateAccount : handleContract}
        className="supportModel"
      >
        {modalAction === "Edit" ? (
          <Form.Item
            className="lableWhite"
            label="Edit Comment"
          >
            <Input.TextArea
              style={{height: "120px"}}
              maxLength={255}
              value={editCommentToUpdate}
              // onChange={(e) => setEditCommentToUpdate(e.target.value)}
              onChange={(e) => {
                if (e.target.value.length <= 255) {
                  setEditCommentToUpdate(e.target.value);
                  setShowWarning(false);
                }
                if (e.target.value.length === 255) {
                  console.log("warning....");
                  setShowWarning(true);
                }
                if (e.target.value.length === 256) {
                  console.log("warning....");
                  setMaxReasonChar(true);
                }
              }}
              placeholder="Write your comment here.."
            />
            {showWarning && (
              <Alert
                message="Comment cannot exceed 255 characters."
                type="warning"
                showIcon
                className="warning"
              />
            )}
          </Form.Item>
        ) : modalAction === "Update Status" && location.pathname === "/support/payout" ? (
          <>
            <Form.Item
              className="lableWhite"
              label="Comment"
              style={{color: "white"}}
            >
              <Input.TextArea
                value={paymentReference}
                // onChange={(e) => setPaymentReference(e.target.value)}
                onChange={(e) => {
                  if (e.target.value.length <= 255) {
                    setPaymentReference(e.target.value);
                    setShowWarning(false);
                  }
                  if (e.target.value.length === 255) {
                    console.log("warning....");
                    setShowWarning(true);
                  }
                  if (e.target.value.length === 256) {
                    console.log("warning....");
                    setMaxReasonChar(true);
                  }
                }}
                maxLength={255}
                placeholder="Write your comment here.."
              />
              {showWarning && (
                <Alert
                  message="Comment cannot exceed 255 characters."
                  type="warning"
                  showIcon
                  className="warning"
                />
              )}
            </Form.Item>
            <Form.Item
              className="lableWhite"
              label="Payment Reference"
              style={{color: "white"}}
            >
              <Input.TextArea
                value={editCommentToUpdate}
                // onChange={(e) => setEditCommentToUpdate(e.target.value)}
                placeholder="Write your comment here.."
                onChange={(e) => {
                  if (e.target.value.length <= 255) {
                    setEditCommentToUpdate(e.target.value);
                    setShowWarning(false);
                  }
                  if (e.target.value.length === 255) {
                    console.log("warning....");
                    setShowWarning(true);
                  }
                  if (e.target.value.length === 256) {
                    console.log("warning....");
                    setMaxReasonChar(true);
                  }
                }}
                maxLength={255}
              />
              {showWarning && (
                <Alert
                  message="Comment cannot exceed 255 characters."
                  type="warning"
                  showIcon
                  className="warning"
                />
              )}
            </Form.Item>
          </>
        ) : (
          <Form.Item
            className="lableWhite"
            label="Comment"
            style={{color: "white"}}
          >
            <Input.TextArea
              style={{height: "120px"}}
              value={editCommentToUpdate}
              // onChange={(e) => setEditCommentToUpdate(e.target.value)}
              onChange={(e) => {
                if (e.target.value.length <= 255) {
                  setEditCommentToUpdate(e.target.value);
                  setShowWarning(false);
                }
                if (e.target.value.length === 255) {
                  console.log("warning....");
                  setShowWarning(true);
                }
                if (e.target.value.length === 256) {
                  console.log("warning....");
                  setMaxReasonChar(true);
                }
              }}
              maxLength={255}
              placeholder="Write your comment here.."
            />
            {showWarning && (
              <Alert
                message="Comment cannot exceed 255 characters."
                type="warning"
                showIcon
                className="warning"
              />
            )}
          </Form.Item>
        )}
      </Modal>
      <Modal
        title={"Flag User"}
        open={flagModal}
        className="reset"
        onCancel={() => {
          reset();
          setFlagModel(false);
        }}
        onOk={handleUpdateFlag}
      >
        <Form.Item
          label="Reason"
          value={comment}
          className="reset"
          // onChange={(e) => setComment(e.target.value)}
        >
          <Input.TextArea
            style={{height: "120px"}}
            onChange={(e) => {
              if (e.target.value.length <= 255) {
                setComment(e.target.value);
                setShowWarning(false);
              }
              if (e.target.value.length === 255) {
                console.log("warning....");
                setShowWarning(true);
              }
              if (e.target.value.length === 256) {
                console.log("warning....");
                setMaxReasonChar(true);
              }
            }}
            maxLength={255}
            placeholder="Write your comment here.."
          />
          {showWarning && (
            <Alert
              message="Comment cannot exceed 255 characters."
              type="warning"
              showIcon
              className="warning"
            />
          )}
        </Form.Item>
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
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const [maxReasonChar, setMaxReasonChar] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setuserToUpdate] = useState(null);
  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);
  const [updatedContract, setUpdatedContract] = useState(null);

  const {isExpandable} = useSelector((state) => state.support);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (record.id === null || record.id === undefined) {
      return;
    }
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
  }, []);

  const martingleStatus = nestedTableData?.martingale?.status || nestedTableData?.martingale_status;

  const openEditModal = (value, record) => {
    setEditCommentToUpdate(value);
    setuserToUpdate(record);
    setIsModalVisible(true);
    setModalAction("Edit");
  };

  const handleEditComment = () => {
    const formData = new FormData();

    if (location.pathname === "/support/payout") {
      formData.append("comment", editCommentToUpdate);
      formData.append("id", userToUpdate?.id);
    } else {
      formData.append("comment", editCommentToUpdate);
    }

    let userId = location.pathname === "/support/funded" ? userToUpdate?.login_id : userToUpdate?.id;

    let stage = location.pathname === "/support/funded" ? "funded" : location.pathname === "/support/payout" ? "payout" : "stage";

    dispatch(editCommentReq({idToken, body: formData, id: userId, stage: stage, dispatch}));
    setIsModalVisible(false);
  };

  async function handleDownloadContract(id) {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        responseType: "blob",
      };
      const response = await axios.get(`${baseUrl}dg/get_document/${id}/`, config);
      setLoading(false);
      return response.data;
    } catch (error) {
      dispatch(returnErrors(error?.response?.data?.detail || "Something went wrong!"), 400);
      console.error("Failed to download the contract:", error);
      setLoading(false);
    }
    setLoading(false);
  }
  const platform = record?.platform === "dxtrader" ? "dxtrader" : record?.platform === "ctrader" ? "ctrader-accounts" : "trader-accounts";

  useEffect(() => {
    // console.log("kkk");
    if (location.pathname === "/support/funded") {
      setUrl(`v2/get/funded/details/${record.login_id}/`);
      dispatch(nestedTableDataReq({idToken, url, flag: false, dispatch}));
    }
  }, [url, record]);

  function handleModal(text) {
    setModalVisible(true);
    setSelectedButton(text);
  }

  //   {
  //     title: "Payout",
  //     dataIndex: "key",
  //     key: "payout",
  //     width: 100,
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: "Account Number",
  //     dataIndex: "account_number",
  //     key: "account_number",
  //     width: 100,
  //     render: (text, record) =>
  //       text ? (
  //         <a
  //           href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
  //           target="_blank"
  //           style={{cursor: "pointer"}}
  //         >
  //           {text}
  //         </a>
  //       ) : (
  //         "-"
  //       ),
  //   },
  //   {
  //     title: "Challenge Name",
  //     dataIndex: "challenge",
  //     key: "challenge",
  //     width: 100,
  //     render: (text) => (text ? text : "-"),
  //   },
  //   {
  //     title: "Payout Amount",
  //     dataIndex: "amount",
  //     key: "amount",
  //     width: 100,
  //     render: (text) => (text ? `$${text}` : "-"),
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     width: 100,
  //     render: (status) => <Tag color={status === "Approved" ? "green" : "volcano"}>{status ? status : "-"}</Tag>,
  //   },
  //   {
  //     title: "Date",
  //     dataIndex: "created_at",
  //     key: "created_at",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  // ];
  // const evaluationColumns = [
  //   {
  //     title: "Evaluation",
  //     dataIndex: "key",
  //     key: "evaluation",
  //     width: 100,
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: "Login ID",
  //     dataIndex: "login_id",
  //     key: "login_id",
  //     width: 100,
  //     render: (text, record) =>
  //       text ? (
  //         <a
  //           href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
  //           target="_blank"
  //           style={{cursor: "pointer"}}
  //         >
  //           {text}
  //         </a>
  //       ) : (
  //         "-"
  //       ),
  //   },
  //   {
  //     title: "Is Active",
  //     dataIndex: "is_Active",
  //     key: "is_Active",
  //     width: 100,
  //     render: (text) => (text ? text : "-"),
  //   },

  //   {
  //     title: "Progress",
  //     dataIndex: "progress",
  //     key: "progress",
  //     width: 100,
  //     render: (status) => <Tag color={status === "Success" ? "green" : "volcano"}>{status ? status : "-"}</Tag>,
  //   },
  //   {
  //     title: "Start Date",
  //     dataIndex: "start_date",
  //     key: "start_date",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  //   {
  //     title: "Expiry Date",
  //     dataIndex: "expiry_date",
  //     key: "expiry_date",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  // ];
  // const fundedColumns = [
  //   {
  //     title: "Funded",
  //     dataIndex: "key",
  //     key: "funded",
  //     width: 100,
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: "Login ID",
  //     dataIndex: "login_id",
  //     key: "login_id",
  //     width: 100,
  //     render: (text, record) =>
  //       text ? (
  //         <a
  //           href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
  //           target="_blank"
  //           style={{cursor: "pointer"}}
  //         >
  //           {text}
  //         </a>
  //       ) : (
  //         "-"
  //       ),
  //   },
  //   {
  //     title: "Is Active",
  //     dataIndex: "is_Active",
  //     key: "is_Active",
  //     width: 100,
  //     render: (text) => (text ? text : "-"),
  //   },

  //   // {
  //   //   title: "Progress",
  //   //   dataIndex: "progress",
  //   //   key: "progress",
  //   //   width: 100,
  //   //   render: (status) => <Tag color={status === "Success" ? "green" : "volcano"}>{status? status:'-'}</Tag>,
  //   // },
  //   {
  //     title: "Start Date",
  //     dataIndex: "start_date",
  //     key: "start_date",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  //   {
  //     title: "Expiry Date",
  //     dataIndex: "expiry_date",
  //     key: "expiry_date",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  // ];
  // const verificationColumns = [
  //   {
  //     title: "Verification",
  //     dataIndex: "key",
  //     key: "verification",
  //     width: 100,
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: "Login ID",
  //     dataIndex: "login_id",
  //     key: "login_id",
  //     width: 100,
  //     render: (text, record) =>
  //       text ? (
  //         <a
  //           href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
  //           target="_blank"
  //           style={{cursor: "pointer"}}
  //         >
  //           {text}
  //         </a>
  //       ) : (
  //         "-"
  //       ),
  //   },
  //   {
  //     title: "Is Active",
  //     dataIndex: "is_Active",
  //     key: "is_Active",
  //     width: 100,
  //     render: (text) => (text ? text : "-"),
  //   },

  //   {
  //     title: "Progress",
  //     dataIndex: "progress",
  //     key: "progress",
  //     width: 100,
  //     render: (status) => <Tag color={status === "Success" ? "green" : "volcano"}>{status ? status : "-"}</Tag>,
  //   },
  //   {
  //     title: "Start Date",
  //     dataIndex: "start_date",
  //     key: "start_date",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  //   {
  //     title: "Expiry Date",
  //     dataIndex: "expiry_date",
  //     key: "expiry_date",
  //     width: 100,
  //     render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
  //   },
  // ];
  const columns = useMemo(() => {
    switch (selectedButton) {
      case "Payout":
        return [
          {
            title: "Index",
            dataIndex: "key",
            key: "index",
            width: 100,
            render: (text, record, index) => index + 1,
          },
          {
            title: "Account Number",
            dataIndex: "account_number",
            key: "account_number",
            width: 100,
            render: (text, record) =>
              text ? (
                <a
                  href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                >
                  {text}
                </a>
              ) : (
                "-"
              ),
          },
          {
            title: "Challenge Name",
            dataIndex: "challenge",
            key: "challenge",
            width: 100,
            render: (text) => (text ? text : "-"),
          },
          {
            title: "Payout Amount",
            dataIndex: "amount",
            key: "amount",
            width: 100,
            render: (text) => (text ? `$${text}` : "-"),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status) => <Tag color={status === "Approved" ? "green" : "volcano"}>{status ? status : "-"}</Tag>,
          },
          {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
        ];

      case "Evaluation":
        return [
          {
            title: "Index",
            dataIndex: "key",
            key: "index",
            width: 100,
            render: (text, record, index) => index + 1,
          },
          {
            title: "Login ID",
            dataIndex: "login_id",
            key: "login_id",
            width: 100,
            render: (text, record) =>
              text ? (
                <a
                  href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                >
                  {text}
                </a>
              ) : (
                "-"
              ),
          },
          {
            title: "Is Active",
            dataIndex: "is_Active",
            key: "is_Active",
            width: 100,
            render: (text) => (text ? text : "-"),
          },

          {
            title: "Progress",
            dataIndex: "progress",
            key: "progress",
            width: 100,
            render: (status) => <Tag color={status === "Success" ? "green" : "volcano"}>{status ? status : "-"}</Tag>,
          },
          {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
          {
            title: "Expiry Date",
            dataIndex: "expiry_date",
            key: "expiry_date",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
        ];

      case "Funded":
        return [
          {
            title: "Index",
            dataIndex: "key",
            key: "index",
            width: 100,
            render: (text, record, index) => index + 1,
          },
          {
            title: "Login ID",
            dataIndex: "login_id",
            key: "login_id",
            width: 100,
            render: (text, record) =>
              text ? (
                <a
                  href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                >
                  {text}
                </a>
              ) : (
                "-"
              ),
          },
          {
            title: "Is Active",
            dataIndex: "is_Active",
            key: "is_Active",
            width: 100,
            render: (text) => (text ? text : "-"),
          },

          // {
          //   title: "Progress",
          //   dataIndex: "progress",
          //   key: "progress",
          //   width: 100,
          //   render: (status) => <Tag color={status === "Success" ? "green" : "volcano"}>{status? status:'-'}</Tag>,
          // },
          {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
          {
            title: "Expiry Date",
            dataIndex: "expiry_date",
            key: "expiry_date",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
        ];
      case "Verification":
        return [
          {
            title: "Index",
            dataIndex: "key",
            key: "index",
            width: 100,
            render: (text, record, index) => index + 1,
          },
          {
            title: "Login ID",
            dataIndex: "login_id",
            key: "login_id",
            width: 100,
            render: (text, record) =>
              text ? (
                <a
                  href={`/account-analysis/${record?.login_id}/${platform}/${nestedTableData?.user_id}`}
                  target="_blank"
                  style={{cursor: "pointer"}}
                >
                  {text}
                </a>
              ) : (
                "-"
              ),
          },
          {
            title: "Is Active",
            dataIndex: "is_Active",
            key: "is_Active",
            width: 100,
            render: (text) => (text ? text : "-"),
          },

          {
            title: "Progress",
            dataIndex: "progress",
            key: "progress",
            width: 100,
            render: (status) => <Tag color={status === "Success" ? "green" : "volcano"}>{status ? status : "-"}</Tag>,
          },
          {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
          {
            title: "Expiry Date",
            dataIndex: "expiry_date",
            key: "expiry_date",
            width: 100,
            render: (text) => (text ? moment(text).format("MMMM Do YYYY, h:mm:ss a") : "-"),
          },
        ];
    }
  }, [selectedButton]);
  return (
    <>
      {loading && <LoaderOverlay />}
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="nestedTable">
          {location.pathname !== "/support/payout" && location.pathname !== "/support/funded" && (
            <div className="expanded_detail_box">
              <div className="payoutNestedTable">
                <div>
                  <div>Martingle</div>
                  {/* <div>{nestedTableData?.contact}</div> */}
                  <button className={`${martingleStatus === "Success" ? "status_success" : "notButton"}`}>Success</button>
                </div>
                <div>
                  <div>Name</div>
                  <p>{record?.username || "-"}</p>
                </div>
                <div className="date_time">
                  <div>Date (Created at)</div>
                  <p>{moment(record?.created_at).format("MMMM Do YYYY, h:mm:ss a") || "-"}</p>
                </div>
                <div className="date_time">
                  <div>Date (last updated)</div>
                  <p>{moment(record?.updated_at).format("MMMM Do YYYY, h:mm:ss a") || "-"}</p>
                </div>
                <div>
                  <div>Max Loss</div>
                  <p>{FormatUSD((nestedTableData && nestedTableData?.drawdown_result?.max_loss?.result) || (nestedTableData && nestedTableData?.stats?.max_loss) || 0)}</p>
                </div>
                <div>
                  <div>Profit</div>
                  <p>{FormatUSD((nestedTableData && nestedTableData?.drawdown_result?.max_loss?.result) || (nestedTableData && nestedTableData?.stats?.profit) || 0)}</p>
                </div>
                <div>
                  <div>Max Daily Loss</div>
                  <p>{FormatUSD((nestedTableData && nestedTableData?.drawdown_result?.max_daily_loss?.result) || (nestedTableData && nestedTableData?.stats?.max_daily_loss) || 0)}</p>
                </div>
                <div>
                  <div>Min Trading Day</div>
                  <p>{(nestedTableData && nestedTableData?.trading_days?.result) || "-"}</p>
                </div>
                <div>
                  <div>Purchased date</div>
                  <p>{(nestedTableData && nestedTableData?.purchase_date) || "-"}</p>
                </div>
                <div className="date_time">
                  <div>Account Started</div>
                  {/* <p>{nestedTableData?.start_date?(formatDateTimeNew(nestedTableData?.start_date || "-")):'-'}</p> */}
                  <p>{formatDateTimeNew(nestedTableData && nestedTableData?.start_date) || "-"}</p>
                </div>
                <div>
                  <div>Risk Report</div>
                  <p>{(nestedTableData && nestedTableData?.risk_reports) || "-"}</p>
                </div>
                <div className="date_time">
                  <div>Account Passed</div>
                  {/* <p>{nestedTableData?.pass_date?(formatDateTimeNew(nestedTableData?.pass_date || "-")):'-'}</p> */}
                  <p>{formatDateTimeNew(nestedTableData && nestedTableData?.pass_date) || "-"}</p>
                </div>
                {location.pathname === "/support/stage-2" && (
                  <>
                    <div>
                      <div>Stage 1 id</div>
                      <p>
                        <a
                          href={`/account-analysis/${record?.stage1_id}/${platform}/${record?.User_id?.id}`}
                          target="_blank"
                          style={{cursor: "pointer"}}
                          // onClick={() => navigate(`/account-analysis/${record?.stage1_id}/${platform}/${record?.User_id?.id}`)}
                        >
                          {record?.stage1_id || "-"}
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="nestedPayoutRow2">
                <div className="comment_box">
                  <div>
                    Comment{" "}
                    <img
                      width={"15px"}
                      src={addIcon}
                      alt=""
                      style={{cursor: "pointer"}}
                      onClick={() => openEditModal(record?.comment, record)}
                    />
                  </div>
                  <div
                    className="text"
                    onClick={() => copyToClipboard(record?.comment)}
                  >
                    {record?.comment || "-"}
                  </div>
                </div>
              </div>
              {/* <div>
                <div>
                  {" "}
                  Comment{" "}
                  <img
                    width={"15px"}
                    src={addIcon}
                    alt=""
                    style={{cursor: "pointer"}}
                    onClick={() => openEditModal(record?.comment, record)}
                  />
                </div>
                <p>{record?.comment || "-"}</p>
              </div> */}
            </div>
          )}

          {location.pathname === "/support/funded" && (
            <>
              {" "}
              <div className="expanded_detail_box">
                <div className="payoutNestedTable">
                  <div>
                    <div>Name</div>
                    <p>{record?.user_id?.name || "-"}</p>
                  </div>
                  <div>
                    <div>Martingle</div>
                    {/* <div>{nestedTableData?.contact}</div> */}
                    <button className={`${martingleStatus === "Success" ? "status_success" : "notButton"}`}>Success</button>
                  </div>
                  <div>
                    <div>Equity</div>
                    <p>{(nestedTableData && nestedTableData?.equity) || "-"}</p>
                  </div>
                  <div>
                    <div>Platform</div>
                    <p>{(nestedTableData && nestedTableData?.platform) || "-"}</p>
                  </div>
                  <div>
                    <strong>Country</strong>
                    <p onClick={() => copyToClipboard(nestedTableData?.user_id?.country)}>{(nestedTableData && nestedTableData?.user_id?.country) || "-"}</p>
                  </div>
                  <div>
                    <strong>Status</strong>
                    <p>{(nestedTableData && nestedTableData?.user_id?.status) || "-"}</p>
                  </div>
                  <div>
                    <div>Stage 1 id</div>
                    <p>
                      <a
                        href={`/account-analysis/${record?.stage1_id}/${platform}/${record?.user_id?.id}`}
                        target="_blank"
                        style={{cursor: "pointer"}}
                        // onClick={() => navigate(`/account-analysis/${record?.stage1_id}/${platform}/${record?.user_id?.id}`)}
                      >
                        {record?.stage1_id || "-"}
                      </a>
                    </p>
                  </div>
                  <div>
                    <div>Stage 2 id</div>
                    <p>
                      <a
                        href={`/account-analysis/${record?.stage2_id}/${platform}/${record?.user_id?.id}`}
                        target="_blank"
                        style={{cursor: "pointer"}}
                        // onClick={() => navigate(`/account-analysis/${record?.stage2_id}/${platform}/${record?.user_id?.id}`)}
                      >
                        {record?.stage2_id || "-"}
                      </a>
                    </p>
                  </div>
                  <div>
                    <div>Max Loss</div>
                    <p>{FormatUSD((nestedTableData && nestedTableData?.max_loss) ?? "-")}</p>
                  </div>
                  <div>
                    <div>Profit</div>
                    <p>{FormatUSD((nestedTableData && nestedTableData?.max_loss) ?? "-")}</p>
                  </div>
                  <div>
                    <div>Max Daily Loss</div>
                    <p>{FormatUSD((nestedTableData && nestedTableData?.max_daily_loss) ?? "-")}</p>
                  </div>
                  <div className="date_time">
                    <div>Date Joined</div>
                    <p>{moment(record?.user_id?.date_joined).format("MMMM Do YYYY, h:mm:ss a") || "-"}</p>
                  </div>
                  <div className="date_time">
                    <div>Date (Created at)</div>
                    <p>{moment(record?.start_date).format("MMMM Do YYYY, h:mm:ss a") || "-"}</p>
                  </div>
                </div>
              </div>
              <div className="nestedPayoutRow2">
                <div className="comment_box">
                  <div>
                    Comment{" "}
                    <img
                      width={"15px"}
                      src={addIcon}
                      alt=""
                      style={{cursor: "pointer"}}
                      onClick={() => openEditModal(record?.comment, record)}
                    />
                  </div>
                  <div className="text">{record?.comment || "-"}</div>
                </div>
                <div className="reason_container">
                  <strong>Reason</strong>
                  <div className="text">{(nestedTableData && nestedTableData?.reason) || "-"}</div>
                </div>
              </div>
            </>
          )}
          {location.pathname === "/support/payout" && (
            <>
              <div className="expanded_detail_box">
                <div className="payoutNestedTable">
                  <div>
                    <strong>Contract</strong>
                    {nestedTableData?.signature_request_id ? (
                      <div
                        onClick={async () => {
                          try {
                            const response = await handleDownloadContract(nestedTableData?.signature_request_id);
                            const blob = new Blob([response], {type: "application/pdf"});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `contract_${nestedTableData?.signature_request_id}.pdf`; // Customize the filename as needed
                            document.body.appendChild(a);
                            a.click();

                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error("Download failed:", error);
                            throw error;
                          }
                        }}
                      >
                        <div className="downloadIconClass">
                          <img
                            src={downloadIcon}
                            alt="downloadSvg"
                          />
                        </div>
                      </div>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                  <div>
                    <strong>Country</strong>
                    <p onClick={() => copyToClipboard(nestedTableData?.country)}>{(nestedTableData && nestedTableData?.country) || "-"}</p>
                  </div>
                  <div>
                    <strong>Contact</strong>
                    <p onClick={() => copyToClipboard(nestedTableData?.contact)}>{(nestedTableData && nestedTableData?.contact) || "-"}</p>
                  </div>

                  <div>
                    <strong>Type</strong>
                    <p onClick={() => copyToClipboard(nestedTableData?.type)}>{(nestedTableData && nestedTableData?.type) || "-"}</p>
                  </div>

                  {nestedTableData && nestedTableData?.type === "RISE" ? (
                    <>
                      <div>
                        <strong>Rise Email</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.rise_email)}>{nestedTableData?.rise_email || "-"}</p>
                      </div>
                      <div>
                        <strong>Is Rise Verified</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.is_rise_verified)}>{nestedTableData && nestedTableData?.is_rise_verified ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <div>Stage 1 id</div>
                        <p>
                          <a
                            href={`/account-analysis/${record?.stage1_id}/${platform}/${record?.user?.id}`}
                            target="_blank"
                            style={{cursor: "pointer"}}
                            // onClick={() => navigate(`/account-analysis/${record?.stage1_id}/${platform}/${record?.user?.id}`)}
                          >
                            {record?.stage1_id || "-"}
                          </a>
                        </p>
                      </div>
                      <div>
                        <div>Stage 2 id</div>
                        <p>
                          <a
                            href={`/account-analysis/${record?.stage2_id}/${platform}/${record?.user?.id}`}
                            target="_blank"
                            style={{cursor: "pointer"}}
                            // onClick={() => navigate(`/account-analysis/${record?.stage2_id}/${platform}/${record?.user?.id}`)}
                          >
                            {record?.stage2_id || "-"}
                          </a>
                        </p>
                      </div>
                    </>
                  ) : nestedTableData && nestedTableData?.type === "WISE" ? (
                    <>
                      <div>
                        <strong>Wise Email</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.wise_email)}>{nestedTableData?.wise_email || "-"}</p>
                      </div>
                      <div>
                        <strong>Is Wise Verified</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.is_wise_verified)}>{nestedTableData && nestedTableData?.is_wise_verified ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <div>Stage 1 id</div>
                        <p>
                          <a
                            href={`/account-analysis/${record?.stage1_id}/${platform}/${record?.user?.id}`}
                            target="_blank"
                            style={{cursor: "pointer"}}
                            // onClick={() => navigate(`/account-analysis/${record?.stage1_id}/${platform}/${record?.user?.id}`)}
                          >
                            {record?.stage1_id || "-"}
                          </a>
                        </p>
                      </div>
                      <div>
                        <div>Stage 2 id</div>
                        <p>
                          <a
                            href={`/account-analysis/${record?.stage2_id}/${platform}/${record?.user?.id}`}
                            target="_blank"
                            style={{cursor: "pointer"}}
                            // onClick={() => navigate(`/account-analysis/${record?.stage2_id}/${platform}/${record?.user?.id}`)}
                          >
                            {record?.stage2_id || "-"}
                          </a>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <strong>Verification Type</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.verification_type)}>{(nestedTableData && nestedTableData?.verification_type) || "-"}</p>
                      </div>
                      <div>
                        <strong>Account Name</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.account_name)}>{nestedTableData?.account_name || "-"}</p>
                      </div>
                      <div>
                        <strong>Account Number</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.account_number)}>{nestedTableData?.account_number || "-"}</p>
                      </div>
                      <div>
                        <strong>Account Type</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.account_type)}>{nestedTableData?.account_type || "-"}</p>
                      </div>
                      <div>
                        <strong>City</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.city)}>{nestedTableData?.city || "-"}</p>
                      </div>
                      <div>
                        <strong>Country</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.country)}>{nestedTableData?.country || "-"}</p>
                      </div>
                      <div>
                        <strong>Address</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.address)}>{nestedTableData?.address || "-"}</p>
                      </div>
                      <div>
                        <strong>Postal Code</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.postal_code)}>{nestedTableData?.postal_code || "-"}</p>
                      </div>
                      <div>
                        <strong>Contact</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.contact)}>{nestedTableData?.contact || "-"}</p>
                      </div>
                      <div>
                        <strong>Swift Bic Code</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.swift_bic_code)}>{nestedTableData?.swift_bic_code || "-"}</p>
                      </div>
                      <div>
                        <strong>Payment Verification Status</strong>
                        <p onClick={() => copyToClipboard(nestedTableData?.payment_verification_status)}>{nestedTableData?.payment_verification_status || "-"}</p>
                      </div>
                      <div>
                        <div>Stage 1 id</div>
                        <p>
                          <a
                            href={`/account-analysis/${record?.stage1_id}/${platform}/${record?.user?.id}`}
                            target="_blank"
                            style={{cursor: "pointer"}}
                            // onClick={() => navigate(`/account-analysis/${record?.stage1_id}/${platform}/${record?.user?.id}`)}
                          >
                            {record?.stage1_id || "-"}
                          </a>
                        </p>
                      </div>
                      <div>
                        <div>Stage 2 id</div>
                        <p>
                          <a
                            href={`/account-analysis/${record?.stage2_id}/${platform}/${record?.user?.id}`}
                            target="_blank"
                            style={{cursor: "pointer"}}
                            // onClick={() => navigate(`/account-analysis/${record?.stage2_id}/${platform}/${record?.user?.id}`)}
                          >
                            {record?.stage2_id || "-"}
                          </a>
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <div>Payout History</div>
                    <p>
                      {nestedTableData?.user_payouts ? (
                        <Button
                          className="view_settlements_btn standard_button"
                          // onClick={() => handlePayoutModal(record)}
                          onClick={() => handleModal("Payout")}
                        >
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <div>Evaluation History</div>
                    <p>
                      {nestedTableData?.evaluation_accounts ? (
                        <Button
                          className="view_settlements_btn standard_button"
                          // onClick={() => handleEvaluationModal(record)}
                          onClick={() => handleModal("Evaluation")}
                        >
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <div>Verification Accounts</div>
                    <p>
                      {nestedTableData?.verification_accounts ? (
                        <Button
                          className="view_settlements_btn standard_button"
                          // onClick={() => handleVerificationModal(record)}
                          onClick={() => handleModal("Verification")}
                        >
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <div>Funded History</div>
                    <p>
                      {nestedTableData?.funded_accounts ? (
                        <Button
                          className="view_settlements_btn standard_button"
                          // onClick={() => handleFundedModal(record)}
                          onClick={() => handleModal("Funded")}
                        >
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                </div>

                {/* <div className="nestedPayoutRow2">
                  <div className="reason_container">
                    <strong>{nestedTableData?.funded_accounts?.length > 0 ? "Previous Funded Accounts" : "Previous Funded Account"}</strong>
                    {nestedTableData?.funded_accounts?.map((item) => {
                      return (
                        <div
                          className="text"
                          style={{cursor: "pointer"}}
                          onClick={() => navigate(`/account-analysis/${item?.login_id}/${platform}/${record?.user?.id}`)}
                        >
                          {item?.login_id || "-"}
                        </div>
                      );
                    })}
                  </div>
                </div> */}
                <div className="nestedPayoutRow2">
                  <div className="comment_box">
                    <div>
                      Comment{" "}
                      <img
                        width={"15px"}
                        src={addIcon}
                        alt=""
                        style={{cursor: "pointer"}}
                        onClick={() => openEditModal(record?.comment, record)}
                      />
                    </div>
                    <div
                      className="text"
                      onClick={() => copyToClipboard(record?.comment)}
                    >
                      {record?.comment || "-"}
                    </div>
                  </div>
                  <div className="reason_container">
                    <strong>Reason</strong>
                    <div
                      className="text"
                      onClick={() => copyToClipboard(nestedTableData?.reason)}
                    >
                      {(nestedTableData && nestedTableData?.reason) || "-"}
                    </div>
                  </div>
                  <div className="reason_container">
                    <strong>Payment Reference</strong>
                    <div
                      className="text"
                      onClick={() => copyToClipboard(nestedTableData?.payment_reference)}
                    >
                      {(nestedTableData && nestedTableData?.payment_reference) || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Modal
            className="settlement_details"
            footer={[
              <Button
                key="ok"
                type="primary"
                className="go_back_btn"
                onClick={() => setModalVisible(false)}
              >
                Go Back
              </Button>,
            ]}
            title={<h3>{`${selectedButton === "Payout" ? "Payout" : selectedButton === "Evaluation" ? "Evaluation" : selectedButton === "Funded" ? "Funded" : "Verification Accounts"} History`}</h3>}
            open={modalVisible}
            onOk={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
            cancelButtonProps={false}
          >
            <div className="settlement_details_container">
              <AntTable
                columns={columns || []}
                data={
                  selectedButton === "Payout"
                    ? nestedTableData?.user_payouts
                    : selectedButton === "Evaluation"
                    ? nestedTableData?.evaluation_accounts
                    : selectedButton === "Funded"
                    ? nestedTableData?.funded_accounts
                    : nestedTableData?.verification_accounts
                }
                serverSide={false}
              />
            </div>
          </Modal>
          <Modal
            title={modalAction}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditCommentToUpdate(null);
              setuserToUpdate(null);
              setUpdatedContract(null);
            }}
            onOk={modalAction === "Edit" && handleEditComment}
            className="supportModel"
          >
            {modalAction === "Edit" ? (
              <Form.Item
                className="lableWhite"
                label="Edit Comment"
              >
                <Input.TextArea
                  style={{height: "120px"}}
                  value={editCommentToUpdate}
                  // onChange={(e) => setEditCommentToUpdate(e.target.value)}
                  onChange={(e) => {
                    if (e.target.value.length <= 255) {
                      setEditCommentToUpdate(e.target.value);
                      setShowWarning(false);
                    }
                    if (e.target.value.length === 255) {
                      console.log("warning....");
                      setShowWarning(true);
                    }
                    if (e.target.value.length === 256) {
                      console.log("warning....");
                      setMaxReasonChar(true);
                    }
                  }}
                  maxLength={255}
                  placeholder="Write your comment here.."
                />
                {showWarning && (
                  <Alert
                    message="Comment cannot exceed 255 characters."
                    type="warning"
                    showIcon
                    className="warning"
                  />
                )}
              </Form.Item>
            ) : (
              <Form.Item
                className="lableWhite"
                label="Comment"
                value={editCommentToUpdate}
                // onChange={(e) => setEditCommentToUpdate(e.target.value)}
                style={{color: "white"}}
              >
                <Input.TextArea
                  style={{height: "120px"}}
                  onChange={(e) => {
                    if (e.target.value.length <= 255) {
                      setEditCommentToUpdate(e.target.value);
                      setShowWarning(false);
                    }
                    if (e.target.value.length === 255) {
                      console.log("warning....");
                      setShowWarning(true);
                    }
                    if (e.target.value.length === 256) {
                      console.log("warning....");
                      setMaxReasonChar(true);
                    }
                  }}
                  maxLength={255}
                  placeholder="Write your comment here.."
                />
                {showWarning && (
                  <Alert
                    message="Comment cannot exceed 255 characters."
                    type="warning"
                    showIcon
                    className="warning"
                  />
                )}
              </Form.Item>
            )}
          </Modal>
        </div>
      )}
    </>
  );
}
