import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DatePicker, Button, Modal, notification, Menu, Dropdown, Slider, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { fetchFailData, fetchPassRate, fetchStageChart } from "../../../store/NewReducers/advanceStatistics";
import TotalPassedCharts from "./TotalPassedCharts";
import TotalFailedCharts from "./TotalFailedCharts";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import { exportDataReq } from "../../../store/NewReducers/exportSlice";
import { returnMessages } from "../../../store/reducers/message";
import { returnErrors } from "../../../store/reducers/error";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import ArrowDown from "../../../assets/icons/ArrowDown.svg";
import ArrowUp from "../../../assets/icons/ArrowUp.svg";
import ArrowUpBlack from "../../../assets/icons/ArrowUpBlack.svg";
import "./PassRates.scss";
import { Link } from "react-router-dom";
import { dollarUS } from "../../../utils/helpers/string";

const { RangePicker } = DatePicker;

const PassRates = () => {
  const [showChart, setShowChart] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [isExportModalVisible, setExportModalVisible] = useState(false);
  const [dates, setDates] = useState(null);
  const [exportDates, setExportDates] = useState([]);
  const [selectedStage, setSelectedStage] = useState("All");
  const [accountSizeRange, setAccountSizeRange] = useState([10000, 50000]);
  const [sliderVisible, setSliderVisible] = useState(false);

  const [passFilter, setPassFilter] = useState("day");
  const [failFilter, setFailFilter] = useState("day");

  const dispatch = useDispatch();
  const { passRate, isLoading } = useSelector((state) => state.advanceStatistics);
  const { idToken } = useSelector((state) => state.auth);
  const { stage1ChartData, stage2ChartData, stage1FailData, stage2FailData, isLoadingStage1: isChartsLoading } = useSelector((state) => state.advanceStatistics);
  const { isLoading: isExportLoading } = useSelector((state) => state.export);
  const [uniquePlanTypes, setUniquePlanTypes] = useState([]);
  const [selectedPlanType, setSelectedPlanType] = useState("All Plans");

  useEffect(() => {
    const fetchData = async () => {
      let query = `?page=${pageNo}&page_size=${pageSize}`;

      // if (selectedStage && selectedStage !== "All") {
      //   query += `&stage=${selectedStage}`;
      // }

      if (searchText) {
        query += `&search=${searchText}`;
      }

      if (dates && dates.length === 2) {
        const [startDate, endDate] = dates;
        query += `&start_date=${startDate}&end_date=${endDate}`;
      }

      const [minAccountSize, maxAccountSize] = accountSizeRange;
      if (minAccountSize !== null && maxAccountSize !== null) {
        query += `&min_account_size=${minAccountSize}&max_account_size=${maxAccountSize}`;
      }
      if (selectedPlanType && selectedPlanType !== "All Plans") {
        query += `&plan_type=${selectedPlanType.toLowerCase()}`;
      }

      dispatch(fetchPassRate({ idToken, query }));
    };

    fetchData();
  }, [dispatch, idToken, pageNo, pageSize, searchText, dates, selectedPlanType, accountSizeRange]);

  useEffect(() => {
    const [startDate, endDate] = dates || [];
    dispatch(
      fetchStageChart({
        idToken,
        stage: selectedStage === "All" ? 1 : selectedStage === "stage 1" ? 1 : 2,
        startDate: startDate || null,
        endDate: endDate || null,
        filter_type: passFilter || null,
      }),
    );
  }, [dispatch, dates, passFilter, selectedStage]);

  useEffect(() => {
    const [startDate, endDate] = dates || [];

    dispatch(
      fetchFailData({
        idToken,
        stage: selectedStage === "All" ? 1 : selectedStage === "stage 1" ? 1 : 2,
        startDate: startDate || null,
        endDate: endDate || null,
        filter_type: failFilter || null,
      }),
    );
  }, [dispatch, dates, failFilter, selectedStage]);

  const onChangePassFilter = (e) => {
    setPassFilter(e.target.value);
  };

  const onChangeFailFilter = (e) => {
    setFailFilter(e.target.value);
  };

  const handleOpenExportModal = () => setExportModalVisible(true);
  const handleCloseExportModal = () => setExportModalVisible(false);

  const handleExport = useCallback(() => {
    if (exportDates && exportDates?.length === 2) {
      const [startDate, endDate] = exportDates;
      const url = `pass-rates/export/?start_date=${startDate}&end_date=${endDate}`;

      dispatch(exportDataReq({ idToken, url }))
        .unwrap()
        .then((response) => {
          const { s3_file_url, filename } = response;
          const link = document.createElement("a");
          link.href = s3_file_url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          dispatch(returnMessages("Export Successful", 200));
          handleCloseExportModal();
        })
        .catch(() => dispatch(returnErrors("Export failed", 400)));
    } else {
      notification.warning({
        message: "Invalid Dates",
        description: "Please select a valid date range.",
      });
    }
  }, [exportDates, idToken, dispatch]);

  const updateExportDateRange = (dates) => {
    setPageNo(1);
    setExportDates(dates ? dates.map((date) => date.format("DD/MMM/YYYY")) : []);
  };

  const updateDateRange = (dates) => {
    setPageNo(1);
    setDates(dates ? dates.map((date) => date.format("DD MMM YYYY")) : []);
  };

  const handleMenuClick = (e) => setSelectedStage(e.key);


  useEffect(() => {
    if (passRate?.results) {
      // const planTypes = [...new Set(passRate.results.map(item => item.plan_type))];
      const planTypes = ["Alpha Pro Plus", "Alpha Pro ", "Swing"];
      setUniquePlanTypes(planTypes);
    }
  }, [passRate]);

  const handlePlanTypeClick = (e) => {
    setSelectedPlanType(e.key);
  };

  const planTypeMenu = (
    <Menu onClick={handlePlanTypeClick} className="custom-dropdown-menu">
      <Menu.Item key="All Plans">All Plans</Menu.Item>
      {uniquePlanTypes.map((plan) => (
        <Menu.Item key={plan}>{plan}</Menu.Item>
      ))}

    </Menu>
  );

  const menu = (
    <Menu
      onClick={handleMenuClick}
      className="custom-dropdown-menu"
    >
      <Menu.Item key="All">All</Menu.Item>
      <Menu.Item key="stage 1">Stage 1</Menu.Item>
      <Menu.Item key="stage 2">Stage 2</Menu.Item>
    </Menu>
  );

  const renderValue = (text, fallback = "N/A") => {
    return text !== null && text !== undefined ? text : fallback;
  };
  

  const stage1Columns = [
    {
      title: "Date",
      dataIndex: "month_year",
      key: "month_year",
      render: (text) => renderValue(text ? dayjs(text).format('DD/MMM/YYYY') : null),
      width: 100,
    },
    {
      title: "Challenge Name",
      dataIndex: "challenge_name",
      key: "challenge_name",
      render: (text) => renderValue(text),
    },
    {
      title: "Plan Type",
      dataIndex: "plan_type",
      key: "plan_type",
      render: (text) => renderValue(text),
      width: 150,
    },
    {
      title: "Account Balance",
      dataIndex: "account_balance",
      key: "account_balance",
      render: (text) => renderValue(text !== undefined && text !== null ? dollarUS(text) : null),
      width: 120,
    },
    {
      title: "Total Accounts",
      dataIndex: "total_accounts",
      key: "total_accounts",
      render: (text) => renderValue(text),
      width: 100,
    },
    {
      title: "Stage 1 Passed",
      dataIndex: "stage1_passed",
      key: "stage1_passed",
      render: (text) => renderValue(text),
      width: 120,
    },
    {
      title: "Stage 1 Failed",
      dataIndex: "stage1_failed",
      key: "stage1_failed",
      render: (text) => renderValue(text),
      width: 120,
    },
    {
      title: "Active Accounts",
      dataIndex: "active_accounts",
      key: "active_accounts",
      render: (text) => renderValue(text),
      width: 120,
    },
    {
      title: "Stage 1 Pass Rate (%)",
      dataIndex: "stage1_pass_rate",
      key: "stage1_pass_rate",
      render: (text) => renderValue(text ? `${text}%` : null),
      width: 120,
    },
    {
      title: "Stage 1 Fail Rate (%)",
      dataIndex: "stage1_fail_rate",
      key: "stage1_fail_rate",
      render: (text) => renderValue(text ? `${text}%` : null),
      width: 120,
    },
  ];
  
  const stage2Columns = [
    {
      title: "Date",
      dataIndex: "month_year",
      key: "month_year",
      render: (text) => renderValue(text ? dayjs(text).format('DD/MMM/YYYY') : null),
      width: 100,
    },
    {
      title: "Challenge Name",
      dataIndex: "challenge_name",
      key: "challenge_name",
      render: (text) => renderValue(text),
      width: 150,
    },
    {
      title: "Plan Type",
      dataIndex: "plan_type",
      key: "plan_type",
      render: (text) => renderValue(text),
      width: 150,
    },
    {
      title: "Account Balance",
      dataIndex: "account_balance",
      key: "account_balance",
      render: (text) => renderValue(text !== undefined && text !== null ? dollarUS(text) : null),
      width: 120,
    },
    {
      title: "Total Accounts",
      dataIndex: "total_accounts",
      key: "total_accounts",
      render: (text) => renderValue(text),
      width: 100,
    },
    {
      title: "Stage 2 Passed",
      dataIndex: "stage2_passed",
      key: "stage2_passed",
      render: (text) => renderValue(text),
      width: 120,
    },
    {
      title: "Stage 2 Failed",
      dataIndex: "stage2_failed",
      key: "stage2_failed",
      render: (text) => renderValue(text),
      width: 120,
    },
    {
      title: "Active Accounts",
      dataIndex: "active_accounts",
      key: "active_accounts",
      render: (text) => renderValue(text),
      width: 120,
    },
    {
      title: "Stage 2 Pass Rate (%)",
      dataIndex: "stage2_pass_rate",
      key: "stage2_pass_rate",
      render: (text) => renderValue(text ? `${text}%` : null),
      width: 120,
    },
    {
      title: "Stage 2 Fail Rate (%)",
      dataIndex: "stage2_fail_rate",
      key: "stage2_fail_rate",
      render: (text) => renderValue(text ? `${text}%` : null),
      width: 120,
    },
  ];
  
  const columns = useMemo(() => {
    const uniqueColumns = new Map();
  
    const addColumns = (columnsArray) => {
      columnsArray.forEach((column) => {
        uniqueColumns.set(column.key, column); 
      });
    };
  
    if (selectedStage === "stage 1") {
      addColumns(stage1Columns);
    } else if (selectedStage === "stage 2") {
      addColumns(stage2Columns);
    } else {
      addColumns(stage1Columns);
      addColumns(stage2Columns);
    }
  
    return Array.from(uniqueColumns.values()); 
  }, [selectedStage]);
  
  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter") setSearchText(e.target.value);
  };

  const triggerChange = (page, updatedPageSize) => {
    setPageNo(page);
    setPageSize(updatedPageSize);
  };


  const generateRowId = (record) => {
    return `${record.month_year}-${record.challenge_name}-${record.account_balance}`;
  };

  return (
    <>
      {/* {isExportLoading && <LoaderOverlay />} */}
      <div className="passRates_main">
        <div className="passRates_header">
          <div className="heading">
            <h2>Pass Rates</h2>
          </div>
          <div className="passRates_export_btn_wrapper">
            <div className="passRates_export_btn">
              <img
                src={exportIcon}
                alt="Export Icon"
              />
              <Button onClick={handleOpenExportModal}>Export</Button>
            </div>
            <Link to="/advance-statistics/export-history">
              <p>View Export History</p>
            </Link>
          </div>
        </div>

        <div className="passRates_section">
          <div className="show_hide_btn_wrapper">
            <Button
              className="show_hide_btn"
              onClick={() => setShowChart(!showChart)}
            >
              <img
                src={showChart ? ArrowUp : ArrowDown}
                alt={showChart ? "Hide Graph" : "Show Graph"}
              />
              <p>{showChart ? "Hide Graph" : "Show Graph"}</p>
            </Button>
          </div>

          <div className="chart_container">
            {showChart && (
              <>
                {isChartsLoading ? (
                  <LoaderOverlay />
                ) : (
                  <>
                    <div className="chart_div">
                      <TotalPassedCharts
                        passFilter={passFilter}
                        onChangePassFilter={onChangePassFilter}
                        data={selectedStage === "stage 1" ? stage1ChartData : stage2ChartData || stage1ChartData}
                      />
                    </div>
                    <div className="chart_div">
                      <TotalFailedCharts
                        failFilter={failFilter}
                        onChangeFailFilter={onChangeFailFilter}
                        data={selectedStage === "stage 1" ? stage1FailData : stage2FailData || stage1FailData}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="passRates_filters">
          <div className="date_picker">
            <RangePicker
              ranges={rangePresets.reduce((acc, curr) => ({ ...acc, [curr.label]: curr.value }), {})}
              onChange={updateDateRange}
              format="DD MMM YYYY"
            />
          </div>

          <div className="tabs_wrappers">
            <div className="tabs_inner">
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                className="dropdown"
              >
                <Button className="custom-dropdown-button">
                  {selectedStage}{" "}
                  <img
                    src={ArrowUpBlack}
                    alt="Dropdown Arrow"
                  />
                </Button>
              </Dropdown>
              <button
                className="tabs"
                onClick={() => setSliderVisible(!sliderVisible)}
              >
                <img
                  className={sliderVisible ? "arrow_up" : ""}
                  src={ArrowUpBlack}
                  alt="Account Size Arrow"
                />
                <p>Account Size</p>
              </button>
              {sliderVisible && (
                <div className="slider_container">
                  <div className="slider_labels">
                    <span className="min_value">Min: 10,000</span>
                    <span className="max_value">Max: 50,000</span>
                  </div>
                  <Tooltip title={`Account Size`}>
                    <Slider
                      className="slider"
                      range
                      defaultValue={[10000, 50000]}
                      value={accountSizeRange}
                      min={10000}
                      max={50000}
                      onChange={setAccountSizeRange}
                    />
                  </Tooltip>
                </div>
              )}
              <button className="tabs" style={{minWidth: '120px'}}>
                <Dropdown overlay={planTypeMenu} trigger={["click"]}
                  className="dropdown"
                >
                  <span style={{ cursor: "pointer" }}>
                    <p>{selectedPlanType || "Pro and Swing"}</p>
                    <img src={ArrowUpBlack} alt="Pro and Swing Arrow" />
                  </span>
                </Dropdown>
              </button>
            </div>
            {/* <div className="tabs_inner">
              <button className="tabs">
                <p>Disable Funded AC Report</p>
              </button>
              <button className="tabs">
                <p>Date Filter AC Report</p>
              </button>
              <button className="tabs">
                <p>Active AC by Periods</p>
              </button>
            </div> */}
          </div>
        </div>

        <div>
          {isLoading ? (
            <LoaderOverlay />
          ) : (
            <AntTable
              data={passRate?.results?.map(record => ({
                ...record,
                uniqueId: generateRowId(record), // Add a unique ID to each record
              })) || []} columns={columns}
              totalPages={Math.ceil(passRate?.count / pageSize)}
              totalItems={passRate?.count}
              pageSize={pageSize}
              CurrentPageNo={pageNo}
              setPageSize={setPageSize}
              triggerChange={triggerChange}
              isExpandable
              ExpandedComp={ExpandedRowRender}
              rowId="uniqueId"
              scrollY={420}
            />
          )}
        </div>
      </div>

      <Modal
        title="Export"
        visible={isExportModalVisible}
        onCancel={handleCloseExportModal}
        footer={null}
        className="export_modal"
      >
        <div className="export_modal_wrapper">
          <RangePicker
            onChange={updateExportDateRange}
            style={{ width: "100%" }}
          />
        </div>
        <p>File will contain information for the selected dates.</p>
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
    </>
  );
};

const ExpandedRowRender = ({ record }) => (
  <div className="expanded-row-content">
    {/* <p>
      <strong>Account Balance:</strong> {record.account_balance || "-"}
    </p> */}
    <p>
      <strong>Pro Funded Failed:</strong> {record.pro_funded_failed !== undefined ? record.pro_funded_failed : "N/A"}
    </p>
    <p>
      <strong>Pro plus Funded Failed:</strong> {record.proplus_funded_failed !== undefined ? record.proplus_funded_failed : "N/A"}
    </p>
    <p>
      <strong>Pro Funded Failed Rate:</strong> {record.proplus_funded_failed ? record.proplus_funded_failed : "N/A"}
    </p>
    <p>
      <strong>Pro plus Funded Failed Rate:</strong> {record.proplus_funded_failed_rate ? record.proplus_funded_failed_rate : "N/A"}
    </p>
  </div>
);

export default PassRates;
