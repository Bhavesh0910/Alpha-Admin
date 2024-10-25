import {Breadcrumb, Button, Radio, Select} from "antd";
import React, {useEffect, useState} from "react";
import profileIcon from "../../../assets/icons/profileIcon.svg";
import {ReactComponent as DropdownIcon} from "../../../assets/icons/dropdownIconWhite.svg";
import {dollarUS, formatDate, FormatUSD, formatValue} from "../../../utils/helpers/string.js";
import BalanceChart from "./Charts/BalanceChart";
import DrawdownChart from "./Charts/DrawdownChart";
import ProfitChart from "./Charts/ProfitChart";
import "./PayoutReview.scss";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {
  fetchAccountAnalysis,
  fetchAccountDetails,
  fetchAccountInsights,
  fetchCertificatesDetails,
  fetchObjectives,
  fetchPerformanceChart,
  fetchTradeJournal,
  fetchTradingAccountOverview,
} from "../../../store/NewReducers/amSlice";
import AntTable from "../../../ReusableComponents/AntTable/AntTable.jsx";
import UserNotesTable from "./UserNotesTable/UserNotesTable.jsx";

const {Option} = Select;

const PayoutReview = ({overview, statistics, info, accountDetails, objectives, performanceChart}) => {
  console.log(overview);
  const [status, setStatus] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [charts, setCharts] = useState("BalanceChart");
  const [pageNos, setPageNos] = useState(1);
  const onChangeActive = (e) => {
    setPageNos(1);
    setCharts(e.target.value);
  };

  const [currentTime, setCurrentTime] = useState("");

  const handleMobileFilters = (e) => {
    setPageNo(1);
    setStatus(e);
  };

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toString());
  }, []);

  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();

  const {login_id, platform, user_id} = useParams();

  useEffect(() => {
    dispatch(fetchTradingAccountOverview({login_id, platform, idToken}));
    dispatch(fetchAccountDetails({login_id, platform, idToken}));
    dispatch(fetchObjectives({login_id, platform, idToken}));
    dispatch(fetchPerformanceChart({login_id, platform, idToken}));

    dispatch(fetchAccountAnalysis({login_id, platform, idToken}));

    // dispatch(fetchAccountInsights({ login_id , platform ,idToken }));
    // dispatch(fetchTradeJournal({ login_id , platform , idToken  }));
  }, [dispatch, login_id, platform, idToken]);

  const riskTriggerData = [
    {
      latency_trading: 0,
      reverse_trading: 0,
      cid_mt5_only: 1,
      max_lots: 1,
      copy_group_trading: 0,
      spamming_order_book: 10,
      high_frequency: 1,
      high_impact_news_trading: 0,
      trade_duration: 0,
      martingale: 10,
      gambling: 1,
    },
  ];

  const [riskTriggerVisibility, setRiskTriggerVisibility] = useState(false);
  const [userNotesVisibility, setUserNotesVisibility] = useState(false);
  const [userDetailsVisibility, setUserDetailsVisibility] = useState(false);

  return (
    <div className="payoutReviewContainer">
      <div className="payoutReviewContent">
        <div className="payoutReviewHeader">
          <div className="header_left_div">
            <Breadcrumb
              separator=">"
              items={[
                {
                  title: (
                    <Link
                      className="page_header"
                      to="/"
                    >
                      Payout
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link
                      className="breadcrumb"
                      to=""
                    >
                      <Select
                        className="payoutUserId"
                        value={login_id}
                      />
                    </Link>
                  ),
                },
              ]}
            />
          </div>
          <div className="header_right_div">
            <Button className="accept_btn">Accept</Button>
            <Button className="reject_btn">Reject</Button>
            <Button className="review_btn">Review</Button>
          </div>
        </div>
        <div className={`riskTriggerContent ${riskTriggerVisibility === true ? "closeRT" : "openRT"}`}>
          <div className="riskHeader_left_top">
            <h5 className="contentHeaders">Risk Triggers</h5>
            <Button onClick={() => setRiskTriggerVisibility((prev) => !prev)}>
              {riskTriggerVisibility === true ? "Show" : "Hide"} <DropdownIcon />
            </Button>
          </div>
          <div className="riskTriggerData">
            {riskTriggerData?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="dataBox"
                >
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div
                        key={key}
                        className="dataRow"
                      >
                        <span className="dataKey">{key.replace(/_/g, " ")}</span>
                        <span className="dataValue">{value}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`userNotesContent ${userNotesVisibility === true ? "closeUN" : "openUN"}`}>
          <div className="userHeader_left_top">
            <h5 className="contentHeaders">User Notes</h5>{" "}
            <Button onClick={() => setUserNotesVisibility((prev) => !prev)}>
              {userNotesVisibility === true ? "Show" : "Hide"} <DropdownIcon />
            </Button>
          </div>
          <div className="userNotesData">
            <UserNotesTable />
          </div>
        </div>
      </div>
      <div className="accountMetrics_wrapper">
        {/* 1st */}
        <div className="accountMetrics_wrapper_top">
          {/* Inner 1st */}
          <div className="header_div">
            <div className="StatusFilters">
              <Radio.Group
                value={status}
                onChange={onChangeActive}
              >
                <Radio.Button value="">Account Metrics</Radio.Button>
                <Radio.Button value="Trader_Journal">Trade History</Radio.Button>
                <Radio.Button value="all">Other Details</Radio.Button>
              </Radio.Group>
            </div>
            <div className="mobileFilters">
              <Select
                value={status}
                onChange={handleMobileFilters}
                placeholder="Select a filter"
              >
                <Option
                  key={""}
                  value={""}
                >
                  Account Metrics
                </Option>

                <Option
                  key="Trader_Journal"
                  value={"Trader_Journal"}
                >
                  Trade History
                </Option>

                <Option
                  key="Other_Details"
                  value={"all"}
                >
                  Other Details
                </Option>
              </Select>
            </div>
          </div>
          <div className="top_left_div">
            <div className="first_row_div">
              <div className="top_left_div_upper">
                <div>
                  <img
                    src={profileIcon}
                    alt="profileIcon"
                  />
                </div>
                <div>
                  {/* <h2>{accountDetails?.name}</h2>
                <p>{accountDetails?.login_id}</p> */}
                  <h2>{accountDetails?.name || "Alpha Capital Group - Alpha pro Stage 1 - Shaquille Boreland"}</h2>
                  <p>{accountDetails?.login_id || "1640105"}</p>
                </div>
              </div>
              <div className="top_left_div_buttons">
                <button>{accountDetails?.status}</button>
                <button className="in_progress">{accountDetails?.progress}</button>
                {/* <button>{accountDetails?.group}</button>
            <button>{accountDetails?.challenge?.name}</button> */}
              </div>
            </div>

            <div className="top_left_div_lower">
              <div>
                <p>Start Date</p>
                <h3>{accountDetails?.start_date ? formatDate(accountDetails?.start_date) : "-"}</h3>
              </div>
              <div>
                <p>End Date</p>
                <h3>{accountDetails?.expiry_date ? formatDate(accountDetails?.expiry_date) : "-"}</h3>
              </div>
              <div>
                <p>Account Size</p>
                <h3>{formatValue(accountDetails?.challenge?.account_balance) ? dollarUS(accountDetails?.challenge?.account_balance) : "0"}</h3>
              </div>
              <div>
                <p>Equity</p>
                <h3>{formatValue(accountDetails?.equity) ? dollarUS(accountDetails?.equity) : "0"}</h3>
              </div>
              <div>
                <p>No. of Trades</p>
                <h3>{formatValue(overview?.calculated_data?.trades)}</h3>
              </div>
              {/* <div className="top_row_2">
                <div>
                  <p>Group</p>
                  <h3>{accountDetails?.group ? accountDetails?.group?.replace(/\\/g, " ") : "-"}</h3>
                </div>
                <div>
                  <p>Challenge Name</p>
                  <h3>{accountDetails?.challenge?.name ? accountDetails?.challenge?.name : "-"}</h3>
                </div>
              </div> */}
            </div>
          </div>
          {/* 
        <div className="top_right_div">
          <div className="accountMetrics_wrapper_header">
            <h2>Daily Summary</h2>
          </div>
          <div className="top_right_div_lower">
            <div>
              <p>Gain</p>
              <h3>{overview?.calculated_data?.absolute_gain ? formatCurrency(overview?.calculated_data?.absolute_gain) : "$0.00"}</h3>
            </div>
            <div>
              <p>Daily</p>
              <h3>{overview?.calculated_data?.daily_gain ? formatCurrency(overview?.calculated_data?.daily_gain) : "$0.00"}</h3>
            </div>
            <div>
              <p>Leverage</p>
              <h3>1:{accountDetails?.challenge?.Leverage}</h3>
            </div>
            <div>
              <p>Abs Gain</p>
              <h3>{overview?.calculated_data?.absolute_gain ? formatCurrency(overview?.calculated_data?.absolute_gain) : '-'}</h3>
            </div>
            <div>
              <p>Monthly</p>
              <h3>{overview?.calculated_data?.monthly_gain ? formatCurrency(overview?.calculated_data?.monthly_gain) : "$0.00"}</h3>
            </div>
            <div>
              <p>Drawdown</p>
              <h3>{overview?.calculated_data?.draw_down ? formatCurrency(overview?.calculated_data?.draw_down) : "$0.00"}</h3>
            </div>
          </div>
        </div> */}
        </div>
        <div className="accountMetrics_wrapper_bottom">
          <div className="bottom_main_left">
            <div className="bottom_main_left_charts">
              <div
                className="trader-overview-header-right tabs_wrapper"
                style={{width: "100%"}}
              >
                <Radio.Group
                  value={charts}
                  onChange={onChangeActive}
                >
                  <Radio.Button value="GrowthChart">Growth</Radio.Button>
                  <Radio.Button value="BalanceChart">Balance</Radio.Button>
                  <Radio.Button value="ProfitChart">Profit</Radio.Button>
                  <Radio.Button value="DrawdownChart">Drawdown</Radio.Button>
                </Radio.Group>
              </div>

              <div className="charts_div">
                {charts === "BalanceChart" && <BalanceChart performanceChart={performanceChart ?? []} />}
                {charts === "ProfitChart" && <ProfitChart ProfitData={overview?.profit_chart ?? []} />}
                {charts === "DrawdownChart" && <DrawdownChart drawdownData={overview?.drawdown_chart ?? []} />}
              </div>
            </div>
            <div className="bottom_main_right">
              <div className="accountMetrics_wrapper_header">
                <h2>Trading Objective</h2>
              </div>

              <div className="bottom_main_right_inner">
                <div className="bottom_main_right_inner_div">
                  <div>
                    {objectives && objectives?.payout_dates ? (
                      <>
                        <h4>
                          Withdrawal Dates - <span>{`${objectives?.payout_dates[0]} &  ${objectives?.payout_dates[1]}`} </span>
                        </h4>
                      </>
                    ) : (
                      <>
                        <h4>Min Trading days - {objectives?.trading_days?.target}</h4>
                        <p>Results : {objectives?.trading_days?.result ?? 0}</p>
                      </>
                    )}
                  </div>
                  {objectives?.trading_days && (
                    <button
                      className={`${objectives?.trading_days?.status === "In Progress" ? "status_in_progress" : objectives?.trading_days?.status === "Success" ? "status_success" : "status_failed"}`}
                    >
                      {objectives?.trading_days?.status}
                    </button>
                  )}
                </div>

                {/* <div className="bottom_main_right_inner_div">
                  <div>
                    <h4>
                      Profit {FormatUSD(objectives?.profit_target?.target)} <span>{">"}</span>
                    </h4>
                    <p>Results : {FormatUSD(objectives?.profit_target?.result)}</p>
                  </div>
                  <button className={`${objectives?.profit_target?.status === "In Progress" ? "status_in_progress" : objectives?.profit_target?.status === "Success" ? "status_green" : "status_red"}`}>
                    {objectives?.profit_target?.status}
                  </button>
                </div> */}

                <div className="bottom_main_right_inner_div">
                  <div>
                    <h4>Max Loss - {FormatUSD(objectives?.drawdown_result?.max_loss?.target ?? 0)}</h4>
                    <p>Results : {FormatUSD(objectives?.drawdown_result?.max_loss?.result ?? 0)}</p>
                  </div>
                  <button
                    className={`${
                      objectives?.drawdown_result?.max_loss?.status === "In Progress"
                        ? "status_in_progress"
                        : objectives?.drawdown_result?.max_loss?.status === "Success"
                        ? "status_success"
                        : "status_failed"
                    }`}
                  >
                    {objectives?.drawdown_result?.max_loss?.status}
                  </button>
                </div>

                <div
                  className="bottom_main_right_inner_div"
                  style={{flexDirection: "column", maxHeight: "100%"}}
                >
                  <div className="tradObjDataBox">
                    <div>
                      <h4>Max Daily Loss - {FormatUSD(objectives?.drawdown_result?.max_daily_loss?.target ?? 0)}</h4>
                      <p>Remaining : {FormatUSD(objectives?.drawdown_result?.max_daily_loss?.remaining ?? 0)}</p>
                    </div>
                    <button
                      className={`${
                        objectives?.drawdown_result?.max_daily_loss?.status === "In Progress"
                          ? "status_in_progress"
                          : objectives?.drawdown_result?.max_daily_loss?.status === "Success"
                          ? "status_success"
                          : "status_failed"
                      }`}
                    >
                      {objectives && objectives?.drawdown_result?.max_daily_loss?.status}
                    </button>
                  </div>
                  <div className="slider-container">
                    <div className="sliderMaxValue">
                      <span className="initialValue">$480.46</span>
                      <span className="maxValue">$2500</span>
                    </div>
                    {/* <div
                      className="sliderMaxValue"
                      style={{textAlign: "start"}}
                    ></div> */}
                    <div className="sliderBase">
                      <div
                        style={{
                          width: "20%",
                        }}
                        className="in_Progress sliderActive"
                      >
                        <div className="sliderCircle">
                          <div className="sliderCircleInner"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom_main_left_satistic">
            {/* <div className="accountMetrics_wrapper_header">
              <h2>Statistic</h2>
            </div> */}
            <div className="bottom_main_left_satistic_inner">
              <div className="bottom_main_left_satistic_inner_one">
                <div>
                  <p>Equity</p>
                  <h3>{accountDetails?.equity ? dollarUS(accountDetails?.equity) : "0"}</h3>
                </div>
                <div>
                  <p>Balance</p>
                  <h3>{accountDetails?.balance ? dollarUS(accountDetails?.balance) : "0"}</h3>
                </div>
                <div>
                  <p>No. of trades</p>
                  <h3>{formatValue(overview?.calculated_data?.trades, 0)}</h3>
                </div>
                <div>
                  <p>Lots</p>
                  <h3>{formatValue(overview?.calculated_data?.lots)}</h3>
                </div>
                <div>
                  <p>Win rate</p>
                  <h3>{formatValue(overview?.calculated_data?.win_ratio)}</h3>
                </div>
                <div>
                  <p>Highest</p>
                  <h3>{formatValue(overview?.calculated_data?.highest, 0)}</h3>
                </div>
              </div>
              <div className="bottom_main_left_satistic_inner_two">
                <div>
                  <p>Average profit</p>
                  <h3 style={{color: "#0D56EB"}}>
                    {" "}
                    {overview?.calculated_data?.average_profit !== null && overview?.calculated_data?.average_profit !== undefined
                      ? dollarUS(overview?.calculated_data?.average_profit?.toFixed(2))
                      : "-"}
                  </h3>
                </div>
                <div>
                  <p>Average loss</p>
                  <h3 style={{color: "#F20000"}}>{dollarUS(overview?.calculated_data?.average_loss?.toFixed(2)) ?? "N/A"}</h3>
                </div>
                <div>
                  <p>Average RRR</p>
                  <h3> {overview?.calculated_data ? formatValue(overview?.calculated_data["rrr "]) : "-"}</h3>
                </div>
                {/* <div>
          <p>Martingale Status</p>
          <button>{accountDetails?.martingale}</button>
        </div> */}
                <div>
                  <p>Expectancy</p>
                  <h3>{formatValue(accountDetails?.expectancy, 0)}</h3>
                </div>
                <div>
                  <p>Profit factor</p>
                  <h3>{formatValue(accountDetails?.profit_factor, 0)}</h3>
                </div>
                <div>
                  <p>Interest</p>
                  <h3>{formatValue(accountDetails?.interest, 0)}</h3>
                </div>
              </div>
            </div>
            <div className="bottom_main_left_satistic_lower">
              <div className="leftSection">
                <h3>Timezone:</h3>
                {/* <p>{currentTime}</p> */}
              </div>
              <div className="rightSection">
                <h3>Last Updated:</h3>
                <p>{currentTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutReview;
