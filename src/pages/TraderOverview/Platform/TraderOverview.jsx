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

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function TraderOverview() {
  const dispatch = useDispatch();
  const [tradersData, setTradersData] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const [phase, setPhase] = useState("");
  const { idToken, searchDates } = useSelector((state) => state.auth);
  const {
    data,
    isLoading: accountsLoading,
    totalItems,
  } = useSelector((state) => state.accountList);
  const accounts = useSelector((state) => state.accounts);
  const [dates, setDates] = useState(searchDates);
  const defaultDates = [dayjs().subtract(7, 'day'), dayjs()];

  useEffect(() => {
    fetchTradersData(dates, pageNo, pageSize, searchText, status, phase);
  }, [idToken, dates, pageNo, pageSize, searchText, status, phase]);

  useEffect(() => {
    setTradersData(data || []);
  }, [data]);

  const fetchTradersData = async (
    dates,
    pageNo,
    pageSize,
    searchText,
    status,
    phase
  ) => {
    setIsLoading(true);
    try {
      // clearPersistedData();
      dispatch(
        accountList({
          idToken,
          dates,
          pageNo,
          pageSize,
          searchText,
          status,
          phase,
          dispatch,
        })
      );
    } catch (error) {
      console.error("Error fetching traders data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTradersData = useMemo(() => {
    return tradersData?.filter((trader) => {
      if (status === "active") {
        return trader?.is_active;
      } else if (status === "inactive") {
        return !trader?.is_active;
      } else {
        return true;
      }
    });
  }, [status, tradersData]);

  useEffect(() => {
    setFilterData(filteredTradersData);
  }, [filteredTradersData]);

  const navigate = useNavigate();

  const onChangeActive = (e) => {
    setPageNo(1);
    setStatus(e.target.value);
  };
  const onChangePhase = (e) => {
    console.log("In phase change : ", e.target.value);
    setPhase(
      e.target.value === "assessment"
        ? "assessment"
        : e.target.value === "qualified"
        ? "qualified"
        : ""
    );
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const options = [
    {
      value: "AplhaTicks",
      label: "AlphaTicks",
    },
    // {
    //   value: "MT5",
    //   label: "MT5",
    // },
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
      title: "Account Name",
      dataIndex: "account_name",
      key: "account_name",
      width: 150,
      render: (text, record) => (
        <Link
          to="/account-analysis"
          className="info-btn new"
          onClick={() => {
            console.log("Loging ID : ",record)
            console.log("Loging ID : ",record?.account_name)
            dispatch(accountList({ idToken, searchText: record?.email }))
            dispatch(setDefaultLoginId(Number(record?.login_id)));
          }}
        >
          {highlightText(text, searchText)}
        </Link>
      ),
    },
    {
      title: "Account Type",
      dataIndex: "account_type",
      key: "account_type",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (isActive) => <span>{isActive ? "Active" : "Inactive"}</span>,
    },
    {
      title: "Disqualified",
      dataIndex: "is_disqualified",
      key: "is_disqualified",
      width: 120,
      render: (isDisqualified) => <span>{isDisqualified ? "Yes" : "No"}</span>,
    },
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
      width: 100,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Phase",
      dataIndex: "phase",
      key: "phase",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Starting Balance",
      dataIndex: "starting_balance",
      key: "starting_balance",
      width: 150,
      render: (startingBalance) => (
        <span>${parseFloat(startingBalance).toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Trading Platform",
      dataIndex: "trading_platform",
      key: "trading_platform",
      width: 150,
      render: (text) => highlightText(text, searchText),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <div className="btn-wrapper">
          <Button className="btn-block" onClick={() => handleBlock(record)}>
            Block
          </Button>
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
    setDates(dates.map((date) => date.format("YYYY-MM-DD")));
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
            onChange={handleCategoryChange}
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
            placeholder={dates}
            defaultValue={defaultDates}
            onChange={updateDateRange}
          />
        </div>
        <Radio.Group value={phase} onChange={onChangePhase}>
          <Radio.Button value="">All</Radio.Button>
          <Radio.Button value="qualified">Qualified</Radio.Button>
          <Radio.Button value="assessment">Assesment</Radio.Button>
        </Radio.Group>
      </div>
      <Card className="table-wrapper">
        {accountsLoading ? (
          <LoaderOverlay />
        ) : (
          <AntTable
            columns={columns}
            data={searchText || status !== "all" ? filterData : tradersData}
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
