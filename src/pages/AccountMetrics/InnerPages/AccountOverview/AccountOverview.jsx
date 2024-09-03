import {Breadcrumb, Radio, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import "./AccountOverview.scss";
import {Link} from "react-router-dom";
import profileIcon from "../../../../assets/icons/profileIcon.svg";
import BalanceChart from "../../Charts/BalanceChart";
import ProfitChart from "../../Charts/ProfitChart";
import {dollarUS, formatCurrency, formatDate, FormatUSD} from "../../../../utils/helpers/string";
import DrawdownChart from "../../Charts/DrawdownChart";

const AccountOverview = ({overview, statistics , accountDetails, objectives , performanceChart}) => {

  console.log(overview)
  const [charts, setCharts] = useState("BalanceChart");
  const [pageNos, setPageNos] = useState(1);
  const onChangeActive = (e) => {
    setPageNos(1);
    setCharts(e.target.value);
  };

  console.log(objectives, "objectives");

  console.log(accountDetails)

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
          </div>

          <div className="top_left_div_lower">
            <div>
              <p>Start Date</p>
              <h3>{formatDate(accountDetails?.start_date)}</h3>
            </div>
            <div>
              <p>End Date</p>
              <h3>{formatDate(accountDetails?.expiry_date)}</h3>
            </div>
            <div>
              <p>Account Size</p>
              <h3> {accountDetails?.challenge?.account_balance ? dollarUS(accountDetails?.challenge?.account_balance) : "0"}</h3>
            </div>
            <div>
              <p>Equity</p>
              <h3>{accountDetails?.equity ? dollarUS(accountDetails?.equity) : "0"}</h3>
            </div>
            <div>
              <p>No. of Trades</p>
              <h3>-</h3>
            </div>
          </div>
        </div>

        <div className="top_right_div">
                    <div className="accountMetrics_wrapper_header">
                        <h2>Daily Summary</h2>
                    </div>
                    <div className="top_right_div_lower">
                        <div>
                            <p>Gain</p>
                            <h3>$00</h3>
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
                            <h3>$00</h3>
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
                </div>
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
              {charts === "BalanceChart" && <BalanceChart performanceChart={performanceChart} />}
              {charts === "ProfitChart" && <ProfitChart ProfitData={overview?.profit_chart}/>}
              {charts === "DrawdownChart" && <DrawdownChart drawdownData={overview?.drawdown_chart}/>}

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
                  <h3> {accountDetails?.challenge?.account_balance ? dollarUS(accountDetails?.challenge?.account_balance) : "0"}</h3>
                </div>
                <div>
                  <p>No. of trades</p>
                  <h3>-</h3>
                </div>
                <div>
                  <p>Lots</p>
                  <h3>-</h3>
                </div>
                <div>
                  <p>Win rate</p>
                  <h3>{statistics?.win_rate?.toFixed(2)}</h3>
                </div>
                <div>
                  <p>Highest</p>
                  <h3>-</h3>
                </div>
              </div>
              <div className="bottom_main_left_satistic_inner_two">
                <div>
                  <p>Average profit</p>
                  <h3>${statistics?.Average_profit?.toFixed(2)}</h3>
                </div>
                <div>
                  <p>Average loss</p>
                  <h3>${statistics?.Average_loss?.toFixed(2)}</h3>
                </div>
                <div>
                  <p>Average RRR</p>
                  <h3>{statistics?.RRR?.toFixed(2)}</h3>
                </div>
                {/* <div>
                  <p>Martingale Status</p>
                  <button>{accountDetails?.martingale}</button>
                </div> */}
                <div>
                  <p>Martingale Count</p>
                  <h3>{accountDetails?.martingale_count}</h3>
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
                <h4>
                  Minimum days - {objectives?.trading_days?.target} <span>{">"}</span>
                </h4>
                <p>Results : {objectives?.trading_days?.result || 0}</p>

              </div>
              <button className={`${objectives?.trading_days?.status === "In Progress" ? "status_in_progress" : objectives?.trading_days?.status === "Success" ? "status_succcess" : "status_failed"}`}>
                {objectives?.trading_days?.status}
              </button>
            </div>

            <div className="bottom_main_right_inner_div">
              <div>
                <h4>
                  Profit {FormatUSD(objectives?.profit_target?.target)} <span>{">"}</span>
                </h4>
                <p>Results : {FormatUSD(objectives?.profit_target?.result)}</p>
              </div>
              <button
                className={`${objectives?.profit_target?.status === "In Progress" ? "status_in_progress" : objectives?.profit_target?.status === "Success" ? "status_succcess" : "status_failed"}`}
              >
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
                  objectives?.drawdown_result?.max_loss?.status === "In Progress"
                    ? "status_in_progress"
                    : objectives?.drawdown_result?.max_loss?.status === "Success"
                    ? "status_succcess"
                    : "status_failed"
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
                    ? "status_succcess"
                    : "status_failed"
                }`}
              >
                { objectives && objectives?.drawdown_result?.max_daily_loss?.status}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
