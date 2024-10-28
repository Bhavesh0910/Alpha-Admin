import {Breadcrumb, Radio, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import "./AccountOverview.scss";
import {Link} from "react-router-dom";
import profileIcon from "../../../../assets/icons/profileIcon.svg";
import BalanceChart from "../../Charts/BalanceChart";
import ProfitChart from "../../Charts/ProfitChart";
import {dollarUS, formatCurrency, formatDate, FormatUSD, formatValue} from "../../../../utils/helpers/string";
import DrawdownChart from "../../Charts/DrawdownChart";

const AccountOverview = ({overview, statistics, info, accountDetails, objectives, performanceChart}) => {
  console.log(overview);
  const [charts, setCharts] = useState("BalanceChart");
  const [pageNos, setPageNos] = useState(1);
  const onChangeActive = (e) => {
    setPageNos(1);
    setCharts(e.target.value);
  };

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toString());
  }, []);

  return (
    <div className="accountMetrics_wrapper">
      {/* 1st */}
      <div className="accountMetrics_wrapper_top">
        {/* Inner 1st */}
        <div className="top_left_div">
          <div className="top_left_div_upper">
            <div>
              <img
                src={profileIcon}
                alt="profileIcon"
              />
            </div>
            <div>
              <h2>{accountDetails?.name}</h2>
              <p>{accountDetails?.login_id}</p>
            </div>
          </div>
          <div className="top_left_div_buttons">
            <button>{accountDetails?.status}</button>
            <button className="in_progress">{accountDetails?.progress}</button>
            {/* <button>{accountDetails?.group}</button>
            <button>{accountDetails?.challenge?.name}</button> */}
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
            <div className="top_row_2">
              <div>
                <p>Group</p>
                <h3>{accountDetails?.group ? accountDetails?.group?.replace(/\\/g, " ") : "-"}</h3>
              </div>
              <div>
                <p>Challenge Name</p>
                <h3>{accountDetails?.challenge?.name ? accountDetails?.challenge?.name : "-"}</h3>
              </div>
            </div>
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
                <Radio.Button value="BalanceChart">Balance Chart</Radio.Button>
                <Radio.Button value="ProfitChart">Profit Chart</Radio.Button>
                <Radio.Button value="DrawdownChart">Drawdown Chart</Radio.Button>
              </Radio.Group>
            </div>

            <div className="charts_div">
              {charts === "BalanceChart" && <BalanceChart performanceChart={performanceChart ?? []} />}
              {charts === "ProfitChart" && <ProfitChart ProfitData={overview?.profit_chart ?? []} />}
              {charts === "DrawdownChart" && <DrawdownChart drawdownData={overview?.drawdown_chart ?? []} />}
            </div>
          </div>
          <div className="bottom_main_left_satistic">
            <div className="accountMetrics_wrapper_header">
              <h2>Statistic</h2>
            </div>
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
                  <h3 style={{color: "#009017"}}>
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
                  <p>Martingale Count</p>
                  <h3>{formatValue(accountDetails?.martingale_count, 0)}</h3>
                </div>
              </div>
            </div>
            <div className="bottom_main_left_satistic_lower">
              <h3>Last Updated:</h3>
              <p>{currentTime}</p>
            </div>
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
                    <h4>
                      Min Trading days - {objectives?.trading_days?.target} <span>{">"}</span>
                    </h4>
                    <p>Results : {objectives?.trading_days?.result ?? 0}</p>
                  </>
                )}
              </div>
              {objectives?.trading_days && (
                <button className={`${objectives?.trading_days?.status === "In Progress" ? "status_in_progress" : objectives?.trading_days?.status === "Success" ? "status_green" : "status_red"}`}>
                  {objectives?.trading_days?.status}
                </button>
              )}
            </div>

            <div className="bottom_main_right_inner_div">
              <div>
                <h4>
                  Profit {FormatUSD(objectives?.profit_target?.target)} <span>{">"}</span>
                </h4>
                <p>Results : {FormatUSD(objectives?.profit_target?.result)}</p>
              </div>
              <button className={`${objectives?.profit_target?.status === "In Progress" ? "status_in_progress" : objectives?.profit_target?.status === "Success" ? "status_green" : "status_red"}`}>
                {objectives?.profit_target?.status}
              </button>
            </div>

            <div className="bottom_main_right_inner_div">
              <div>
                <h4>
                  Max Loss {FormatUSD(objectives?.drawdown_result?.max_loss?.target ?? 0)} <span>{">"}</span>
                </h4>
                <p>Results : {FormatUSD(objectives?.drawdown_result?.max_loss?.result ?? 0)}</p>
              </div>
              <button
                className={`${
                  objectives?.drawdown_result?.max_loss?.status === "In Progress" ? "status_in_progress" : objectives?.drawdown_result?.max_loss?.status === "Success" ? "status_green" : "status_red"
                }`}
              >
                {objectives?.drawdown_result?.max_loss?.status}
              </button>
            </div>

            <div className="bottom_main_right_inner_div">
              <div>
                <h4>
                  Max Daily Loss {FormatUSD(objectives?.drawdown_result?.max_daily_loss?.target ?? 0)} <span>{">"}</span>
                </h4>
                <p>Remaining : {FormatUSD(objectives?.drawdown_result?.max_daily_loss?.remaining ?? 0)}</p>
              </div>
              <button
                className={`${
                  objectives?.drawdown_result?.max_daily_loss?.status === "In Progress"
                    ? "status_in_progress"
                    : objectives?.drawdown_result?.max_daily_loss?.status === "Success"
                    ? "status_green"
                    : "status_red"
                }`}
              >
                {objectives && objectives?.drawdown_result?.max_daily_loss?.status}
              </button>
            </div>

            {objectives?.drawdown_result?.mll?.target > 0 ? (
              <div className="bottom_main_right_inner_div">
                <div>
                  <h4>
                    MLL {FormatUSD(objectives?.drawdown_result?.mll?.target ?? 0)} <span>{">"}</span>
                  </h4>
                  <p>Remaining : {FormatUSD(objectives?.drawdown_result?.mll?.remaining ?? 0)}</p>
                </div>
                <button
                  className={`${
                    objectives?.drawdown_result?.mll?.status === "In Progress" ? "status_in_progress" : objectives?.drawdown_result?.mll?.status === "Success" ? "status_green" : "status_red"
                  }`}
                >
                  {objectives && objectives?.drawdown_result?.mll?.status}
                </button>
              </div>
            ) : (
              <></>
            )}

            {objectives?.consistency?.target > 0 ? (
              <div className="bottom_main_right_inner_div">
                <div>
                  <h4>
                    Consistency {FormatUSD(objectives?.consistency?.target)} <span>{">"}</span>
                  </h4>
                  <p>Results : {FormatUSD(objectives?.consistency?.result)}</p>
                </div>
                <button className={`${objectives?.consistency?.status === "In Progress" ? "status_in_progress" : objectives?.consistency?.status === "Success" ? "status_green" : "status_red"}`}>
                  {objectives?.consistency?.status}
                </button>
              </div>
            ) : (
              <></>
            )}
            {objectives?.min_profit_days?.target > 0 ? (
              <div className="bottom_main_right_inner_div">
                <div>
                  <h4>
                    Min Profit days - {objectives?.min_profit_days?.target} <span>{">"}</span>
                  </h4>
                  <p>Results : {objectives?.min_profit_days?.result ?? 0}</p>
                </div>
                {objectives?.min_profit_days && (
                  <button
                    className={`${objectives?.min_profit_days?.status === "In Progress" ? "status_in_progress" : objectives?.min_profit_days?.status === "Success" ? "status_green" : "status_red"}`}
                  >
                    {objectives?.min_profit_days?.status}
                  </button>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
