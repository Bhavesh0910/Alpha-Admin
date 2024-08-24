import React, {useEffect, useRef, useState} from "react";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import ArrowDown from "../../../assets/icons/ArrowDown.svg";
import ArrowUp from "../../../assets/icons/ArrowUp.svg";
import ArrowUpBlack from "../../../assets/icons/ArrowUpBlack.svg";
import "./PassRates.scss";
import TotalPassedCharts from "./TotalPassedCharts";
import TotalPassedChartTwo from "./TotalPassedChartTwo";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import {fetchPassRate} from "../../../store/NewReducers/advanceStatistics";
import { fetchStageChart } from "../../../store/NewReducers/riskSlice";

const PassRates = () => {
  const [showChart, setShowChart] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const {passRate, isLoading} = useSelector((state) => state.advanceStatistics);
  const {idToken} = useSelector((state) => state.auth);

  // Fetch PassRates Data
  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&search=${searchText}`;
    }

    dispatch(fetchPassRate({idToken, query}));
  }, [dispatch, idToken, pageNo, pageSize, searchText]);

  console.log("passData", passRate);

  const searchRef = useRef();

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

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

  const handleRowClick = (affiliateId, email) => {
    const url = `/affiliate-marketing/code?email=${email}`;
    navigate(url);
  };

  const columns = [
    {
      title: 'Plan Type',
      dataIndex: 'plan_type',
      key: 'plan_type',
      render: text => text || '-',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      key: 'created_date',
      render: text => text || '-',
    },
    {
      title: 'Account Balance',
      dataIndex: 'account_balance',
      key: 'account_balance',
      render: text => text || '-',
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: text => text || '-',
    },
    {
      title: 'Passed',
      dataIndex: 'passed',
      key: 'passed',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Pass Rate (%)',
      dataIndex: 'pass_rate',
      key: 'pass_rate',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Pass Ratio',
      dataIndex: 'pass_ratio',
      key: 'pass_ratio',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Breached',
      dataIndex: 'breached',
      key: 'breached',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Fail Rate (%)',
      dataIndex: 'fail_rate',
      key: 'fail_rate',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Fail Ratio',
      dataIndex: 'fail_ratio',
      key: 'fail_ratio',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Total Accounts',
      dataIndex: 'total_accounts',
      key: 'total_accounts',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'Repeated',
      dataIndex: 'repeated',
      key: 'repeated',
      render: text => text !== undefined ? text : '-',
    },
    {
      title: 'New',
      dataIndex: 'new',
      key: 'new',
      render: text => text !== undefined ? text : '-',
    }
  ];

  const handleSearch = (e) => {
    console.log("search1", e.target.value);
    if (e.key === "Enter") {
      console.log(searchText, e.key);
      setSearchText(e.target.value);
    }
  };

  const handleClick = () => {
    setSearchText(searchRef.current.value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };
  return (
    <>
      <div className="passRates_main">
        {/* Header */}
        <div className="passRates_header">
          <div className="heading">
            <h2>Pass Rates</h2>
          </div>
          <div className="passRates_export_btn_wrapper">
            <div className="passRates_export_btn">
              <img
                src={exportIcon}
                alt="exportIcon"
              />
              <button>Export</button>
            </div>
            <Link to="/advance-statistics/export-history">
              <p>View Export History</p>
            </Link>
          </div>
        </div>

        {/* Main Page */}
        <div className="passRates_section">
          <div className="show_hide_btn_wrapper">
            {showChart ? (
              <button
                className="show_hide_btn"
                onClick={() => setShowChart(!showChart)}
              >
                <img
                  src={ArrowUp}
                  alt="ArrowUp"
                />
                <p>Hide Graph</p>
              </button>
            ) : (
              <button
                className="show_hide_btn"
                onClick={() => setShowChart(!showChart)}
              >
                <img
                  src={ArrowDown}
                  alt="ArrowDown"
                />
                <p>Show Graph</p>
              </button>
            )}
          </div>
          {showChart ? (
            <div className="chart_container">
              <div className="chart_div">
                {/* <TotalPassedCharts data={accountOverviewData?.stage1} /> */}
              </div>
              <div className="chart_div">
                {/* <TotalPassedChartTwo data={accountOverviewData?.stage1} /> */}
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="tabs_wrappers">
            <div className="tabs_inner">
              <button className="tabs">
                <img
                  src={ArrowUpBlack}
                  alt="ArrowUpBlack"
                />
                <p>Stage</p>
              </button>
              <button className="tabs">
                <img
                  src={ArrowUpBlack}
                  alt="ArrowUpBlack"
                />
                <p>Account Size</p>
              </button>
              <button className="tabs">
                <img
                  src={ArrowUpBlack}
                  alt="ArrowUpBlack"
                />
                <p>Pro and Swing</p>
              </button>
            </div>
            <div className="tabs_inner">
              <button className="tabs">
                <p>Disable Funded AC Report</p>
              </button>
              <button className="tabs">
                <p>Date Filter AC Report</p>
              </button>
              <button className="tabs">
                <p>Active AC by Periods</p>
              </button>
            </div>
          </div>

          <div>
            {isLoading ? (
              <LoaderOverlay />
            ) : (
              <AntTable
                data={passRate?.results || []}
                columns={columns}
                totalPages={Math.ceil(passRate?.count / pageSize)}
                totalItems={passRate?.count}
                pageSize={pageSize}
                CurrentPageNo={pageNo}
                setPageSize={setPageSize}
                triggerChange={triggerChange}
              />
            )}
          </div>

          {/* {showChart ? <TotalPassesCharts /> : <></>} */}
        </div>
      </div>
    </>
  );
};

export default PassRates;
