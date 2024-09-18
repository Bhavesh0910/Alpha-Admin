import React, { useEffect, useMemo, useState } from "react";
import "./TraderOverview.scss";
import {
  Table,
  DatePicker,
  Button,
  Card,
  Radio,
  Select,
  Typography,
  Modal,
  Cascader,
  Tag,
  Dropdown,
  Menu,
  Form,
  Input,
  Alert,
  notification,
} from "antd";

import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {baseUrl, getAllTradersRequest} from "../../../utils/api/apis";
import {getAccountList, getAccountListSuccess} from "../../../store/reducers/accountSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import {
  setDefaultLoginId,
  accountList,
  changeAccountStatus,
  deleteAcount,
} from "../../../store/NewReducers/accountList";
import { clearPersistedData } from "../../../store/configureStore";
import dayjs from "dayjs";
import blockIcon from "../../../assets/icons/block.svg";
import unblockIcon from "../../../assets/icons/unblock.svg";
import deleteIcon from "../../../assets/icons/delete.svg";
import { formatDate } from "fullcalendar/index.js";
import ReactCountryFlag from "react-country-flag";
import { changeAccountStatusApi } from "../../../utils/apis/accountsApi";
import { fetchFundingDetails } from "../../../store/NewReducers/fundingSlice";
import { data } from "./../../../components/AffiliateMarketing/UserDetails/UserDetails";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  softBlockUser,
  updateFlagReq,
} from "../../../store/NewReducers/listSlice";
import { refreshTokenReq } from "../../../store/NewReducers/authSlice";
const { Title } = Typography;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

function TraderOverview() {
  const lookup = require("country-code-lookup");
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [platform, setPlatform] = useState("trader-accounts");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");

  const [showWarning, setShowWarning] = useState(false);

  const [maxReasonChar, setMaxReasonChar] = useState(false);
  const [phase, setPhase] = useState("");
  const { idToken, refreshToken, searchDates } = useSelector(
    (state) => state.auth
  );
  const { data, isLoading: accountsLoading, totalItems, refresh } = useSelector(
    (state) => state.accountList
  );
  const [Challenges, setChallenges] = useState(null);
  const [labels, setLabels] = useState([]);
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState(null);

  const [expandedGroup, setExpandedGroup] = useState(null);
  const [ChallengesOptions, setChallengesOptions] = useState([]);
  const { fundingData } = useSelector((state) => state.funding);

  const [dates, setDates] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);

  const [flagUser, setFlagUser] = useState(null);
  const [flagModal, setFlagModel] = useState(false);
  const [flagUpdatedValue, setFlagUpdatedValue] = useState(null);
  const [comment, setComment] = useState(null);

  const [blockType, setBlockType] = useState("hard");

  const { refetch } = useSelector((state) => state.list);

  const [defaultDates, setDefaultDates] = useState();

  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    dispatch(fetchFundingDetails(idToken));
  }, []);
  useEffect(() => {
    fetchTradersData(
      dates,
      pageNo,
      pageSize,
      searchText,
      status,
      phase,
      platform,
      Challenges
    );
  }, [
    idToken,
    dates,
    pageNo,
    pageSize,
    searchText,
    status,
    phase,
    platform,
    refresh,
    Challenges,
    refetch,
  ]);

  // useEffect(() => {
  //   if (fundingData) {
  //     const fundingEvu = Object.values(fundingData)
  //       .map((item, index) => item.map((item) => item.name))
  //       .flat()
  //       .map((item) => ({label: item, value: item}));
  //     console.log("fundingEvu ", fundingEvu);
  //     setChallengesOptions(fundingEvu);
  //   }
  // }, [fundingData]);

  useEffect(() => {
    console.log("reason :", reason);
  }, [reason]);

  const fetchTradersData = async (
    dates,
    pageNo,
    pageSize,
    searchText,
    status,
    phase,
    platform,
    Challenges
  ) => {
    setIsLoading(true);
    try {
      let query = `?page=${pageNo ? pageNo : 1}&page_size=${
        pageSize ? pageSize : ""
      }&is_active=${status === "active" ? 1 : status === "inactive" ? 0 : ""}`;

      if (searchText) {
        query = query + `&search=${searchText}`;
      }
      if (dates) {
        query =
          query +
          `&start_date=${dates[0].format(
            "DD/MMM/YYYY"
          )}&end_date=${dates[1].format("DD/MMM/YYYY")}`;
      }
      if (phase !== "") {
        let phaseQuery =
          phase === "Free Trail" ? "&free_trial=1" : `&status=${phase}`;
        query = query + phaseQuery;
      }
      if (Challenges) {
        let c = "";
        for (let i = 0; i < Challenges.length; i++) {
          c = c + `&challenge_name=${Challenges[i]}`;
        }
        query += `${c}`;
      }

      dispatch(
        accountList({
          idToken,
          platform,
          query,
          dispatch,
        })
      );
    } catch (error) {
      console.error("Error fetching traders data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const updateDateRange = (dates) => {
    setPageNo(1);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
        notification.error({
          message: "Invalid Date Range",
          description: `The selected date range (${startDate.format(
            "DD/MMM/YYYY"
          )} - ${endDate.format(
            "DD/MMM/YYYY"
          )}) contains future dates. Please select a valid range.`,
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
      setLastValidRange({ startDate, endDate });
      setDefaultDates(dates);
      setIsValidRange(true);
    } else {
      setDates(null);
      setDefaultDates(null);
    }
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const onChangeActive = (e) => {
    setPageNo(1);
    setStatus(e.target.value);
  };

  const onChangePhase = (e) => {
    setPageNo(1);
    setPhase(e.target.value);
  };

  useEffect(() => {
    const data =
      fundingData && typeof fundingData === "object" ? fundingData : {};

    const formattedOptions = Object.keys(data).map((key) => ({
      label: key,
      value: key,
      children: (data[key] || []).map((item) => ({
        label: item.name || "",
        value: item.name || "",
      })),
    }));

    setChallengesOptions(formattedOptions);
  }, [fundingData]);

  const handleChallengeChange = (value) => {
    setSelectedChallenges(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setShowChallenges(true);
  };

  const handlePlatformChange = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText("");
    setDates(null);
    setPhase("");
    const data =
      value === "MT5"
        ? "trader-accounts"
        : value === "C-traders"
        ? "ctrader-accounts"
        : "dxtraders";
    setPlatform(data);
  };

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const options = [
    {
      value: "MT5",
      label: "MT5",
    },
    {
      value: "C-traders",
      label: "C-traders",
    },
    {
      value: "DX",
      label: "DX",
    },
  ];

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
          )
        )}
      </>
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  function reset() {
    setFlagUser(null);
    setFlagUpdatedValue(null);
    setComment(null);
  }

  const openStatusUpdateModal = (updatedValue, record) => {
    setFlagModel(true);
    setFlagUser(record);
    setFlagUpdatedValue(updatedValue);
  };

  const statusMenu = (key, record) => {
    const { status } = record?.user_id;

    return (
      <Menu
        className="menuCard"
        onClick={(e) => openStatusUpdateModal(e.key, record)}
      >
        <Menu.Item
          key="Safe"
          style={{
            display:
              status !== "Warning" && status !== "Blacklisted" ? "none" : "",
          }}
        >
          Safe
        </Menu.Item>
        <Menu.Item
          key="Warning"
          style={{ display: status === "Warning" ? "none" : "" }}
        >
          Warning
        </Menu.Item>
        <Menu.Item
          key="Blacklisted"
          style={{ display: status === "Blacklisted" ? "none" : "" }}
        >
          Blacklisted
        </Menu.Item>
      </Menu>
    );
  };

  function handleUpdateFlag() {
    const formData = new FormData();
    formData.append("status", flagUpdatedValue);
    formData.append("notes", comment);
    dispatch(
      updateFlagReq({ idToken, body: formData, id: flagUser?.user_id?.id })
    );
    setFlagModel(false);
    reset();
  }

  const columns = useMemo(
    () => [
      {
        title: "Flag",
        dataIndex: "status",
        width: "80px",
        render: (text, record) => {
          const getStatusColor = (status) => {
            if (status === "Blacklisted") {
              return "Red";
            } else if (status === "Warning") {
              return "Yellow";
            } else {
              return "Green";
            }
          };
          return (
            <div className="flagContainer">
              <p
                className={`flag ${getStatusColor(record?.user_id?.status)}`}
              ></p>
              <Dropdown
                overlay={() => statusMenu(text, record)}
                trigger={["click"]}
              >
                <DownOutlined />
              </Dropdown>
            </div>
          );
        },
      },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        width: 200,
        render: (country, { record }) => {
          const countryName = (country !== "undefined" ? country : null) || "-";
          const countryCode = lookup.byCountry(countryName);
          return countryCode ? (
            <div className="country_name_wrapper">
              <ReactCountryFlag
                countryCode={
                  countryCode.internet === "UK" ? "GB" : countryCode.internet
                }
                svg={true}
                aria-label={countryName}
              />
              <span>{countryName}</span>
            </div>
          ) : (
            <span>{countryName}</span>
          );
        },
      },
      {
        title: "Account No.",
        dataIndex: "login_id",
        key: "login_id",
        width: 100,
        render: (text, record) =>
          text ? (
            <a href={`/account-analysis/${record?.login_id}/${platform}/${record.user_id?.id}`}
            target="_blank"
              style={{cursor: "pointer"}}
              // onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}/${record.user_id?.id}`)}
            >
              {text}
            </a>
          ) : (
            "-"
          ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 100,
        render: (text, record) =>
          text ? (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(
                  `/account-analysis/${record?.login_id}/${platform}/${record.user_id?.id}`
                )
              }
            >
              {text}
            </div>
          ) : (
            "-"
          ),
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "balance",
        width: 150,
        render: (startingBalance) => {
          return (
            <span>
              {startingBalance
                ? "$" + parseFloat(startingBalance).toFixed(2).toLocaleString()
                : "-"}
            </span>
          );
        },
      },
      // {
      //   title: "Equity",
      //   dataIndex: "equity",
      //   key: "equity",
      //   width: 150,
      //   render: (equity) => <span>{equity}</span>,
      // },
      {
        title: "Leverage",
        dataIndex: "leverage",
        key: "leverage",
        width: 100,
        render: (leverage) => <span>1:{leverage || "-"}</span>,
      },
      {
        title: "Start Date",
        dataIndex: "start_date",
        key: "start_date",
        width: 100,
        render: (startDate) => (
          <span>{startDate ? formatDate(startDate) : "-"}</span>
        ),
      },
      {
        title: "End Date",
        dataIndex: "expiry_date",
        key: "expiry_date",
        width: 100,
        render: (expiryDate) => (
          <span>{expiryDate ? formatDate(expiryDate) : "-"}</span>
        ),
      },
      {
        title: "Trader Type",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (text) => (
          <p
            className={`status_text ${
              text === "Evaluation" ? "evaluation" : "free_trial"
            }`}
          >
            {highlightText(text || "-", searchText)}
          </p>
        ),
      },
      {
        title: "Status",
        dataIndex: "user_is_active",
        key: "user_is_active",
        width: 100,
        render: (text) => (text ? "Unblocked" : "Blocked") || "-",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 100,
        render: (_, record) => (
          <div className="btn-wrapper">
            {record.user_is_active ? (
              <div
                style={{ cursor: "pointer" }}
                title="Block"
                onClick={() => handleAction("Block", record)}
              >
                <img src={blockIcon} alt="" />
              </div>
            ) : (
              <div
                style={{ cursor: "pointer" }}
                title="Unblock"
                onClick={() => handleAction("UnBlock", record)}
              >
                <img src={unblockIcon} alt="" />
              </div>
            )}
            <div
              style={{ cursor: "pointer" }}
              title="Delete"
              onClick={() => handleAction("Delete", record)}
              danger
            >
              <img src={deleteIcon} alt="" />
            </div>
          </div>
        ),
      },
    ],
    [navigate, platform, searchText]
  );

  function handleAction(action, record) {
    setAction(action);
    setSelectedTrader(record);
    setIsModalVisible(true);
    console.log(action, record, "here");
  }

  const handleBlock = () => {
    if (blockType === "hard") {
      dispatch(
        changeAccountStatus({
          idToken,
          body: { id: selectedTrader?.user_id?.id, note: reason },
          dispatch,
        })
      );
    } else {
      dispatch(
        softBlockUser({
          id: selectedTrader?.user_id?.id,
          note: reason,
          idToken,
        })
      );
    }
    setIsModalVisible(false);
    setReason("");
  };

  const handleUnBlock = () => {
    dispatch(
      changeAccountStatus({
        idToken,
        body: { id: selectedTrader?.user_id, note: reason },
        dispatch,
      })
    );
    setIsModalVisible(false);
    setReason("");
  };

  const handleDelete = () => {
    dispatch(
      deleteAcount({
        idToken,
        body: { login_id: selectedTrader?.login_id },
        platform,
        dispatch,
      })
    );
    setIsModalVisible(false);
    setReason("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setReason("");
    setComment("");
  };

  const handleChange = (value, options) => {
    setSelectedChallenges(value);
    const labels = options.map((option) => option.label);
  };

  const handleGroupClick = (groupValue) => {
    setExpandedGroup((prev) => (prev === groupValue ? null : groupValue));
  };

  return (
    <div className="trader-overview">
      <div className="mobile_headers">
        <h4>Trader Overview</h4>
      </div>
      <div className="trader-overview-header">
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group value={status} onChange={onChangeActive}>
            <Radio.Button value="">All</Radio.Button>
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="inactive">Inactive</Radio.Button>
          </Radio.Group>
          <Button
            onClick={() =>
              navigate(`/trader-overview/view-logs?platform=${platform}`)
            }
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button>
        </div>
        <div className="trader-overview-header-left">
          <div className="trader-overview-header-left_inner">
            <Title className="title" style={{ fontstatus: "14px" }} level={5}>
              Platform
            </Title>
            <Select
              // placeholder="Select Platform"
              defaultValue={options[0].value}
              showSearch={false}
              className="header-select"
              onChange={handlePlatformChange}
              options={options}
            />
          </div>

          <div className="trader-overview-header-left_inner">
            <Title className="title" style={{ fontSize: "14px" }} level={5}>
              Challenges
            </Title>

            <Select
              mode="multiple"
              tagRender={(props) => {
                const { label, value, closable, onClose } = props;
                return (
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    style={{
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {label}
                  </Tag>
                );
              }}
              placeholder="Select Challenge"
              // value={selectedChallenges}
              onChange={(value, c, ind) => {
                setChallenges(value);
                const labels = c.map((item) => item.label);
                setLabels(labels);
                if (c.length === 2) {
                  setMsg(<p>{`${labels[0]}` + `${labels[1]}`}...</p>);
                }
              }}
              className="header-select widthFitContent"
              style={{ width: 300 }}
            >
              {ChallengesOptions.map((option) => (
                <OptGroup
                  label={
                    <div
                      className="label"
                      onClick={() => handleGroupClick(option.value)}
                    >
                      {option.label}{" "}
                      {expandedGroup !== option.value ? (
                        <DownOutlined style={{ fontSize: "14px" }} />
                      ) : (
                        <UpOutlined style={{ fontSize: "14px" }} />
                      )}
                    </div>
                  }
                  key={option.value}
                >
                  {expandedGroup === option.value &&
                    option.children.map((child) => (
                      <Option
                        className="value"
                        value={child.value}
                        key={child.value}
                      >
                        {child.label}
                      </Option>
                    ))}
                </OptGroup>
              ))}
            </Select>
            {/* <Select
              mode="multiple"
              // value={Challenges}
              // defaultValue={ChallengesOptions[0]}
              placeholder="Select Challenge"
              className="header-select widthFitContent"
              onChange={(value, c, ind) => {
                setChallenges(value);
                const labels = c.map((item) => item.label);
                setLabels(labels);
                if (c.length === 2) {
                  setMsg(<p>{`${labels[0]}` + `${labels[1]}`}...</p>);
                }
              }}

              // options={ChallengesOptions || []}
              tagRender={(item) => {
                // if (msg) {
                //   if (count > 1) {
                //     console.log("Hereee");
                //     return;
                //   } else {
                //     setCount((prev) => prev + 1);
                //     console.log("Heree");
                //     return msg;
                //   }
                // } else {
                //   return <p>{labels[0]}</p>;
                // }
              }}
            >
              {ChallengesOptions.map((option) => (
                <OptGroup label={option.label} key={option.value}>
                  {option.children.map((child) => (
                    <Option value={child.value} key={child.value}>
                      {child.label}
                    </Option>
                  ))}
                </OptGroup>
              ))}

            </Select> */}
          </div>
        </div>
        {/* <div className="trader-overview-header-left"></div> */}
      </div>
      <div className="trader_overview_header_row2">
        <div className="trader_overview_row2_groupA">
          <div className="search_box_wrapper search_box_wrapper">
            <div className="left_side_box">
              {/* <Select
                className="category_dropdown"
                defaultValue="all"
                onChange={handlePlatformChange}
              >
                <Option value="all">All Categories</Option>
              </Select> */}
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
            </div>
            <div className="searchImg" onClick={() => handleSearch(search)}>
              <img src={searchIcon} alt="searchIcon" />
            </div>
          </div>{" "}
          <div>
            <RangePicker value={defaultDates} onChange={updateDateRange} />
          </div>
        </div>

        <div className="trader_overview_row2_groupB">
          <div className="phase_filters">
            <Radio.Group value={phase} onChange={onChangePhase}>
              <Radio.Button value="">All</Radio.Button>
              {/* <Radio.Button value="Evalution/Funded">Evalution/Funded</Radio.Button> */}
              <Radio.Button value="Funded">Funded</Radio.Button>
              <Radio.Button value="Verification">Verification</Radio.Button>
              <Radio.Button value="Evaluation">Evaluation</Radio.Button>
              <Radio.Button value="Free Trail">Free Trial</Radio.Button>
            </Radio.Group>
          </div>
          <div className="mobileFilter">
            <Select placeholder="Select a filter">
              <Option key={"all"} value={"all"}>
                All
              </Option>
              <Option key={"Funded"} value={"Funded"}>
                Funded
              </Option>
              <Option key={"Verification"} value={"Verification"}>
                Verification
              </Option>
              <Option key={"Evalution"} value={"Evalution"}>
                Funded
              </Option>
              <Option key={"Free Trial"} value={"Free Trial"}>
                Free Trial
              </Option>
            </Select>
          </div>
        </div>
      </div>

      {/* 
      <Title level={5}>Challenges</Title>
      <Cascader
        options={ChallengesOptions}
        onChange={(value, c, ind) => {
          setChallenges(value[1]);
          const labels = c.map((item) => item.label);
          setLabels(labels);
          console.log(Challenges, c, ind)
          if (c.length === 2) {
            setMsg(<p>{`${labels[0]}` + `${labels[1]}`}...</p>);
          }
        }}
        placeholder="Select Challenge"
        className="header-select widthFitContent"
      /> */}

      {/* <Select
        mode="multiple"
        placeholder="Select Challenges"
        value={selectedChallenges}
        onChange={(value, c, ind) => {
          setChallenges(value);
          const labels = c.map((item) => item.label);
          setLabels(labels);
          if (c.length === 2) {
            setMsg(<p>{`${labels[0]}` + `${labels[1]}`}...</p>);
          }
        }} style={{ width: 300 }}
      >
        {ChallengesOptions.map((option) => (
          <OptGroup label={option.label} key={option.value}>
            {option.children.map((child) => (
              <Option value={child.value} key={child.value}>
                {child.label}
              </Option>
            ))}
          </OptGroup>
        ))}
      </Select> */}

      <Card className="table-wrapper">
        {accountsLoading ? (
          <LoaderOverlay />
        ) : (
          <AntTable
            columns={columns}
            data={data || []}
            totalPages={Math.ceil(totalItems / pageSize)}
            totalItems={totalItems}
            pageSize={pageSize}
            CurrentPageNo={pageNo}
            setPageSize={setPageSize}
            triggerChange={triggerChange}
            isExpandable={true}
            ExpandedComp={ExpandableRow}
            rowId={"id"}
          />
        )}

        <Modal
          title={`${action} Account`}
          visible={isModalVisible}
          onCancel={handleCancel}
          centered
          className="table-modal"
          footer={[
            <div className="modal-btns-wrapper">
              <Button
                className="cancel-btn"
                key="cancel"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="standard_button block_btn"
                key="block"
                type="primary"
                danger
                onClick={
                  action === "Block"
                    ? handleBlock
                    : action === "UnBlock"
                    ? handleUnBlock
                    : handleDelete
                }
              >
                {action === "Block"
                  ? "Block"
                  : action === "UnBlock"
                  ? "UnBlock"
                  : "Delete"}
              </Button>
            </div>,
          ]}
        >
          <div className="modal-content">
            {action === "Block" && (
              <Select
                defaultValue="hard"
                onChange={(value) => setBlockType(value)}
              >
                <Option value="hard">Hard Block</Option>
                <Option value="soft">Soft Block</Option>
              </Select>
            )}

            <p className="modal-title">Write Your Reason</p>
            <textarea
              maxLength={255}
              value={reason}
              onChange={(e) => {
                // setReason(e.target.value);
                if (e.target.value.length <= 255) {
                  setReason(e.target.value);
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
              placeholder="Write your reason here.."
            ></textarea>
            {showWarning && (
              <Alert
                message="Comment cannot exceed 255 characters."
                type="warning"
                showIcon
                className="warning"
              />
            )}
          </div>
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
          <Form.Item label="Reason" value={comment} className="reset">
            <Input.TextArea
              value={comment}
              maxLength={255}
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
      </Card>
    </div>
  );
}

export default TraderOverview;

const ExpandableRow = ({ record }) => {
  return (
    <>
      <div className="NestedTable">
        <div>
          <div>Name</div>
          <p>{record?.name || "-"}</p>
        </div>
        {/* <div>
          <div>Start Date</div>
          <p>{record?.start_date ? dayjs(record?.start_date).format("YYYY-MM-DD") : "-"}</p>
        </div> */}
        {/* <div>
          <div>End Date</div>
          <p>{record?.expiry_date ? formatDate(record?.expiry_date)  : "-"}</p>
        </div> */}
        <div>
          <div>Equity</div>
          <p>{record?.equity ? `$${record?.equity}` : "-"}</p>
        </div>
        {/* <div>
          <div>Balance</div>
          <p>${record?.balance ? parseFloat(record?.balance || "0").toFixed(2) : "-"}</p>
        </div> */}
        {/* <div>
          <div>Timestamp</div>
          <p>{dayjs(record?.start_date).format('YYYY-MM-DD HH:mm:ss')}</p> 
        </div> */}
      </div>
    </>
  );
};
