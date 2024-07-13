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
} from "antd";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllTradersRequest } from "../../../utils/api/apis";
import {
  getAccountList,
  getAccountListSuccess,
} from "../../../store/reducers/accountSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import {
  setDefaultLoginId,
  accountList,
} from "../../../store/NewReducers/accountList";
import { clearPersistedData } from "../../../store/configureStore";
import dayjs from "dayjs";
import { formatDate } from "fullcalendar/index.js";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function TraderOverview() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [platform, setPlatform] = useState("trader-accounts");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const [phase, setPhase] = useState("");
  const { idToken, searchDates } = useSelector((state) => state.auth);
  const {
    data,
    isLoading: accountsLoading,
    totalItems,
  } = useSelector((state) => state.accountList);

  const [dates, setDates] = useState(null);
  const defaultDates = [dayjs().subtract(7, 'day'), dayjs()];

  useEffect(() => {
    fetchTradersData(dates, pageNo, pageSize, searchText, status, phase, platform);
  }, [idToken, dates, pageNo, pageSize, searchText, status, phase, platform]);

  ;

  const fetchTradersData = async (
    dates,
    pageNo,
    pageSize,
    searchText,
    status,
    phase,
    platform
  ) => {
    setIsLoading(true);
    try {

      let query = `?page=${pageNo ? pageNo : 1}&page_size=${pageSize ? pageSize : ""}&is_active=${status === "active" ? 1 : status === "inactive" ? 0 : ""}`

      if (searchText) {
        query = query + `&search=${searchText}`
      }
      if (dates) {
        query = query + `&start_date=${dates[0]}&end_date=${dates[1]}`
      }
      if (phase !== "") {
        let phaseQuery = phase === "Free Trail" ? "&free_trail=1" : "&status=Funded&status=Evalution"
        query = query + phaseQuery;
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

  const onChangeActive = (e) => {
    setPageNo(1);
    setStatus(e.target.value);
  };

  const onChangePhase = (e) => {
    setPhase(e.target.value);
  };

  const handlePlatformChange = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText("");
    setDates(null);
    setPhase("");
    const data = value === "MT5" ? "trader-accounts" : value === "C-traders" ? "ctrader-accounts" : "dxtraders"
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Account Number",
      dataIndex: "login_id",
      key: "login_id",
      width: 100,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (startingBalance) => (
        <span>${parseFloat(startingBalance).toLocaleString()}</span>
      ),
    },
    {
      title: "Equity",
      dataIndex: "equity",
      key: "equity",
      width: 150,
      render: (equity) => <span>{equity}</span>,
    },
    {
      title: "Leverage",
      dataIndex: "leverage",
      key: "leverage",
      width: 150,
      render: (leverage) => <span>1:{leverage}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: 150,
      render: (startDate) => <span>{formatDate(startDate)}</span>,
    },
    {
      title: "End Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 150,
      render: (expiryDate) => <span>{expiryDate ? formatDate(expiryDate) : "-"}</span>,
    },
    {
      title: "Trader Type",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Status",
      dataIndex: "user_is_active",
      key: "user_is_active",
      width: 150,
      render: (text) => text ? "UnBlocked" : "Blocked",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <div className="btn-wrapper">
          {record.user_is_active ?

            <Button className="btn-block" onClick={() => handleBlock(record)}>
              Block
            </Button>
            :
            <Button className="btn-unblock" onClick={() => handleBlock(record)}>
              Unblock
            </Button>

            //UNCOMMENT THIS AND COMMENT UPPER PART ONLY TO CHECK CSS OF UNBLOCK BUTTON AFTER THAT REVERT TO NORMAL
            // <Button className="btn-unblock" onClick={() => handleBlock(record)}>
            //   Unblock
            // </Button>
            // :
            // <Button className="btn-block" onClick={() => handleBlock(record)}>
            //   Block
            // </Button>
          }
          <Button className="btn-delete" danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];


  const handleBlock = (record) => {
    setSelectedTrader(record);
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function updateDateRange(dates) {
    setPageNo(1);
    setPageSize(20);
    setDates(dates.map((date) => date.format("DD MMM YYYY")));
  }

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className="trader-overview">
      <div className="mobile_headers">
        <h4>Trader Overview</h4>
      </div>
      <div className="trader-overview-header">
        <div className="trader-overview-header-left">
          <Title className="title" style={{ fontstatus: "14px" }} level={5}>
            Platform
          </Title>
          <Select
            defaultValue={options[0].value}
            className="header-select"
            onChange={handlePlatformChange}
            options={options}
          />
        </div>
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group value={status} onChange={onChangeActive}>
            <Radio.Button value="">All</Radio.Button>
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="inactive">Inactive</Radio.Button>
          </Radio.Group>

          {/* <Button
            // onClick={() => navigate("view-logs")}
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button> */}
        </div>
      </div>
      <div className="trader_overview_header_row2">
        <div className="trader_overview_row2_groupA">
          <div className="search_box_wrapper search_box_wrapper">
            <div className="left_side_box">
              <Select
                className="category_dropdown"
                defaultValue="all"
                onChange={handlePlatformChange}
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
                  console.log("e : ", e.key === "Enter")
                  if (e.key === "Enter") {
                    console.log("Searching.....")
                    handleSearch(e.target.value)
                  }
                }}
              />
            </div>
            <div className="searchImg" onClick={() => handleSearch(search)}>
              <img src={searchIcon} alt="searchIcon" />
            </div>
          </div>
          <RangePicker
            // placeholder={['Start Date', 'End Date']}
            // defaultValue={defaultDates}
            onChange={updateDateRange}
          />
        </div>
        <Radio.Group value={phase} onChange={onChangePhase}>
          <Radio.Button value="">All</Radio.Button>
          <Radio.Button value="Evalution/Funded">Evalution/Funded</Radio.Button>
          <Radio.Button value="Free Trail">Free Trail</Radio.Button>
        </Radio.Group>
      </div>
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
          />
        )}

        <Modal
          title={`Block Account`}
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
                onClick={handleCancel}
              >
                Block
              </Button>
            </div>,
          ]}
        >
          <div className="modal-content">
            <p className="modal-title">Write Your Reason</p>
            <textarea placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></textarea>
          </div>
        </Modal>
      </Card>
    </div>
  );
}

export default TraderOverview;
