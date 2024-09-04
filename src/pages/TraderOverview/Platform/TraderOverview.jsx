import React, { useEffect, useMemo, useState } from "react";
import "./TraderOverview.scss";
import { Table, DatePicker, Button, Card, Radio, Select, Typography, Modal, Cascader, Tag } from "antd";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllTradersRequest } from "../../../utils/api/apis";
import { getAccountList, getAccountListSuccess } from "../../../store/reducers/accountSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import { setDefaultLoginId, accountList, changeAccountStatus, deleteAcount } from "../../../store/NewReducers/accountList";
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

  const [phase, setPhase] = useState("");
  const { idToken, searchDates } = useSelector((state) => state.auth);
  const { data, isLoading: accountsLoading, totalItems, refresh } = useSelector((state) => state.accountList);
  const [Challenges, setChallenges] = useState(null);
  const [labels, setLabels] = useState([]);
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState(null);

  const [expandedGroup, setExpandedGroup] = useState(null);
  const [ChallengesOptions, setChallengesOptions] = useState([]);
  const { fundingData } = useSelector((state) => state.funding);

  const [dates, setDates] = useState(null);
  const defaultDates = [dayjs().subtract(7, "day"), dayjs()];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);

  useEffect(() => {
    dispatch(fetchFundingDetails(idToken));
  }, []);
  useEffect(() => {
    fetchTradersData(dates, pageNo, pageSize, searchText, status, phase, platform, Challenges);
  }, [idToken, dates, pageNo, pageSize, searchText, status, phase, platform, refresh, Challenges]);

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

  console.log(ChallengesOptions)

  const fetchTradersData = async (dates, pageNo, pageSize, searchText, status, phase, platform, Challenges) => {
    setIsLoading(true);
    try {
      let query = `?page=${pageNo ? pageNo : 1}&page_size=${pageSize ? pageSize : ""}&is_active=${status === "active" ? 1 : status === "inactive" ? 0 : ""}`;

      if (searchText) {
        query = query + `&search=${searchText}`;
      }
      if (dates) {
        query = query + `&start_date=${dates[0]}&end_date=${dates[1]}`;
      }
      if (phase !== "") {
        let phaseQuery = phase === "Free Trail" ? "&free_trial=1" : `&trading_type=${phase}`;
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
        }),
      );
    } catch (error) {
      console.error("Error fetching traders data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  function updateDateRange(dates) {
    setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates(null);
    }
  }

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
    const data = fundingData && typeof fundingData === 'object' ? fundingData : {};

    const formattedOptions = Object.keys(data).map(key => ({
      label: key,
      value: key,
      children: (data[key] || []).map(item => ({
        label: item.name || '',
        value: item.name || '',
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
    const data = value === "MT5" ? "trader-accounts" : value === "C-traders" ? "ctrader-accounts" : "dxtraders";
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
            <span
              key={index}
              className="highlight"
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);

  const columns = useMemo(
    () => [
      // {
      //   title: "Name",
      //   dataIndex: "name",
      //   key: "name",
      //   width: 150,
      //   render: (value, record) => {
      //     return (
      //       <p
      //         style={{cursor: "pointer"}}
      //         onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}`)}
      //       >
      //         {value || "-"}
      //       </p>
      //     );
      //   },
      // },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        width: "15%",
        render: (country, { record }) => {
          const countryName = (country !== "undefined" ? country : null) || "-";
          const countryCode = lookup.byCountry(countryName);
          return countryCode ? (
            <div className="country_name_wrapper">
              <ReactCountryFlag
                countryCode={countryCode.internet === "UK" ? "GB" : countryCode.internet}
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
        title: "Account Number",
        dataIndex: "login_id",
        key: "login_id",
        width: "15%",
        render: (text, record) => (text ? <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}`)}>{text}</div> : "-"),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "15%",
        render: (text, record) => (text ? <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/account-analysis/${record?.login_id}/${platform}`)}>{text}</div> : "-"),
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "balance",
        width: 150,
        render: (startingBalance) => <span>{startingBalance ? "$" + parseFloat(startingBalance).toFixed(2).toLocaleString() : "-"}</span>,
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
        width: "15%",
        render: (leverage) => <span>1:{leverage || "-"}</span>,
      },
      // {
      //   title: "Start Date",
      //   dataIndex: "start_date",
      //   key: "start_date",
      //   width: 150,
      //   render: (startDate) => <span>{startDate ? formatDate(startDate) : "-"}</span>,
      // },
      // {
      //   title: "End Date",
      //   dataIndex: "expiry_date",
      //   key: "expiry_date",
      //   width: 150,
      //   render: (expiryDate) => <span>{expiryDate ? formatDate(expiryDate) : "-"}</span>,
      // },
      {
        title: "Trader Type",
        dataIndex: "status",
        key: "status",
        width: "15%",
        render: (text) => <p className={`status_text ${text === "Evaluation" ? "evaluation" : "free_trial"}`}>{highlightText(text || "-", searchText)}</p>,
      },
      {
        title: "Status",
        dataIndex: "user_is_active",
        key: "user_is_active",
        width: "15%",
        render: (text) => (text ? "Unblocked" : "Blocked") || "-",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: "25%",
        render: (_, record) => (
          <div className="btn-wrapper">
            {record.user_is_active ? (
              <div style={{ cursor: 'pointer' }} title="Block" onClick={() => handleAction("Block", record)}>
                <img
                  src={blockIcon}
                  alt=""
                />
              </div>
            ) : (
              <div style={{ cursor: 'pointer' }} title="Unblock" onClick={() => handleAction("UnBlock", record)}>
                <img
                  src={unblockIcon}
                  alt=""
                />
              </div>
            )}
            <div style={{ cursor: 'pointer' }} title="Delete"
              onClick={() => handleAction("Delete", record)}
              danger
            >
              <img
                src={deleteIcon}
                alt=""
              />
            </div>
          </div>
        ),
      },
    ],
    [navigate, platform, searchText],
  );

  function handleAction(action, record) {
    setAction(action);
    setSelectedTrader(record);
    setIsModalVisible(true);
    console.log(action, record, "here");
  }

  const handleBlock = () => {
    dispatch(changeAccountStatus({ idToken, body: { id: selectedTrader?.user_id, note: reason }, dispatch }));
    setIsModalVisible(false);
  };

  const handleUnBlock = () => {
    dispatch(changeAccountStatus({ idToken, body: { id: selectedTrader?.user_id, note: reason }, dispatch }));
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    console.log("handleDelete");
    console.log(platform, "plaform");
    dispatch(deleteAcount({ idToken, body: { login_id: selectedTrader?.login_id }, platform, dispatch }));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const handleChange = (value, options) => {
    setSelectedChallenges(value);
    const labels = options.map(option => option.label);
    console.log('Selected values:', value);
    console.log('Selected labels:', labels);
  };

  const handleGroupClick = (groupValue) => {
    setExpandedGroup(prev => (prev === groupValue ? null : groupValue));
  };


  console.log(ChallengesOptions)
  // const CustomOption = (props) => {
  //   return (
  //     <components.Option {...props} className="custom-option">
  //       {props.data.label}
  //     </components.Option>
  //   );
  // };

  // const CustomMultiValueLabel = (props) => {
  //   return (
  //     <components.MultiValueLabel {...props} className="custom-multi-value-label">
  //       {props.data.label}
  //     </components.MultiValueLabel>
  //   );
  // };
  console.log(`Trader Overview:`, data);
  return (
    <div className="trader-overview">
      <div className="mobile_headers">
        <h4>Trader Overview</h4>
      </div>
      <div className="trader-overview-header">
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group
            value={status}
            onChange={onChangeActive}
          >
            <Radio.Button value="">All</Radio.Button>
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="inactive">Inactive</Radio.Button>
          </Radio.Group>
          <Button
            onClick={() => navigate(`/trader-overview/view-logs?platform=${platform}`)}
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button>
        </div>
        <div className="trader-overview-header-left">
          <div className="trader-overview-header-left_inner">
            <Title
              className="title"
              style={{ fontstatus: "14px" }}
              level={5}
            >
              Platform
            </Title>
            <Select
              // placeholder="Select Platform"
              defaultValue={options[0].value}
              className="header-select"
              onChange={handlePlatformChange}
              options={options}
            />
          </div>



          <div className="trader-overview-header-left_inner">
            <Title
              className="title"
              style={{ fontSize: "14px" }}
              level={5}
            >
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
                      maxWidth: '150px', 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
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
              }} className="header-select widthFitContent"
              style={{ width: 300 }}
            >
              {ChallengesOptions.map(option => (
                <OptGroup
                  label={
                    <div className="label" onClick={() => handleGroupClick(option.value)}>
                      {option.label} {expandedGroup !== option.value ? <DownOutlined style={{ fontSize: '14px' }} />
                        : <UpOutlined style={{ fontSize: "14px" }} />}
                    </div>
                  }
                  key={option.value}
                >
                  {expandedGroup === option.value &&
                    option.children.map(child => (
                      <Option className='value' value={child.value} key={child.value}>
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
        </div>


        <div className="trader_overview_row2_groupB">
          <div>
            <RangePicker
              // placeholder={['Start Date', 'End Date']}
              // defaultValue={defaultDates}
              onChange={updateDateRange}
            />
          </div>
          <div>
            <Radio.Group
              value={phase}
              onChange={onChangePhase}
            >
              <Radio.Button value="">All</Radio.Button>
              {/* <Radio.Button value="Evalution/Funded">Evalution/Funded</Radio.Button> */}
              <Radio.Button value="Funded">Funded</Radio.Button>
              <Radio.Button value="Verification">Verification</Radio.Button>
              <Radio.Button value="Evalution">Evalution</Radio.Button>
              <Radio.Button value="Free Trail">Free Trial</Radio.Button>
            </Radio.Group>
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
                onClick={action === "Block" ? handleBlock : action === "UnBlock" ? handleUnBlock : handleDelete}
              >
                {action === "Block" ? "Block" : action === "UnBlock" ? "UnBlock" : "Delete"}
              </Button>
            </div>,
          ]}
        >
          <div className="modal-content">
            <p className="modal-title">Write Your Reason</p>
            <textarea
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder="Write your reason here.."
            ></textarea>
          </div>
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
        <div>
          <div>Start Date</div>
          <p>{record?.start_date ? dayjs(record?.start_date).format("YYYY-MM-DD") : "-"}</p>
        </div>
        <div>
          <div>End Date</div>
          <p>{record?.expiry_date ? dayjs(record?.expiry_date).format("YYYY-MM-DD") : "-"}</p>
        </div>
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
