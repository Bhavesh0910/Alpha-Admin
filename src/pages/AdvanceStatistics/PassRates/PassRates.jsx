import React, {useRef, useState} from "react";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import ArrowDown from "../../../assets/icons/ArrowDown.svg";
import ArrowUp from "../../../assets/icons/ArrowUp.svg";
import ArrowUpBlack from "../../../assets/icons/ArrowUpBlack.svg";
import "./PassRates.scss";
import TotalPassedCharts from "./TotalPassedCharts";
import TotalPassedChartTwo from "./TotalPassedChartTwo";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

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
      title: "Start Balance",
      dataIndex: "startBalance",
      key: "startBalance",
      render: (text) => text || "-",
    },
    {
      title: "Total Passed",
      dataIndex: "totalPassed",
      key: "totalPassed",
      render: (text) => text || "-",
    },
    {
      title: "Pass Rate",
      dataIndex: "passRate",
      key: "passRate",
      render: (text) => text || "-",
    },
    {
      title: "Total Failed",
      dataIndex: "totalFailed",
      key: "totalFailed",
      render: (text) => text || "-",
    },
    {
      title: "Failed Rate",
      dataIndex: "failedRate",
      key: "failedRate",
      render: (text) => text || "-",
    },
    {
      title: "Passed/Fail Ratio",
      dataIndex: "passedFailRatio",
      key: "passedFailRatio",
      render: (text) => text || "-",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => text || "-",
    },
    {
      title: "Account Active",
      dataIndex: "accountActive",
      key: "accountActive",
      render: (text) => text || "-",
    },
  ];

  const dummyData = [
    {
      key: "1",
      startBalance: "$100000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "2",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "3",
      startBalance: "$24200",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "4",
      startBalance: "$100000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "5",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "6",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "7",
      startBalance: "$100000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "8",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "9",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "10",
      startBalance: "$24200",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
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
                <TotalPassedCharts />
              </div>
              <div className="chart_div">
                <TotalPassedChartTwo />
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
            {false ? (
              <LoaderOverlay />
            ) : (
              <AntTable
                data={dummyData || []}
                columns={columns}
                // totalPages={Math.ceil(newCodeData?.count / pageSize)}
                // totalItems={newCodeData?.count}
                // pageSize={pageSize}
                // CurrentPageNo={pageNo}
                // setPageSize={setPageSize}
                // triggerChange={triggerChange}
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
