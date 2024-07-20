import {Breadcrumb, Radio, Tabs} from "antd";
import React, {useState} from "react";
import "./AccountOverview.scss";
import {Link} from "react-router-dom";
import profileIcon from "../../../../assets/icons/profileIcon.svg";
import BalanceChart from "../../Charts/BalanceChart";
import ProfitChart from "../../Charts/ProfitChart";

const AccountOverview = () => {
  const [charts, setCharts] = useState("BalanceChart");
  const [pageNos, setPageNos] = useState(1);
  const onChangeActive = (e) => {
    setPageNos(1);
    setCharts(e.target.value);
  };

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
              <h2>Alpha Capital Group - Alpha pro Stage 1 - Shaquille Boreland</h2>
              <p>1640105</p>
            </div>
          </div>
          <div className="top_left_div_buttons">
            <button>Evaluation</button>
            <button>In Progress</button>
          </div>

          <div className="top_left_div_lower">
            <div>
              <p>Start Date</p>
              <h3>18 Jul 2024</h3>
            </div>
            <div>
              <p>End Date</p>
              <h3>N/A</h3>
            </div>
            <div>
              <p>Account Size</p>
              <h3>$100,000</h3>
            </div>
            <div>
              <p>Equity</p>
              <h3>$100,000</h3>
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
              <p>Gain</p>
              <h3>$00</h3>
            </div>
            <div>
              <p>Gain</p>
              <h3>$00</h3>
            </div>
            <div>
              <p>Gain</p>
              <h3>$00</h3>
            </div>
            <div>
              <p>Gain</p>
              <h3>$00</h3>
            </div>
            <div>
              <p>Gain</p>
              <h3>$00</h3>
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
              </Radio.Group>
            </div>

            <div className="charts_div">
              {/* {charts === "" && (
                <>
                  <BalanceChart />
                </>
              )} */}
              {charts === "BalanceChart" && <BalanceChart />}
              {charts === "ProfitChart" && <ProfitChart />}
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
                  <h3>100000</h3>
                </div>
                <div>
                  <p>Balance</p>
                  <h3>100000</h3>
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
                  <h3>-</h3>
                </div>
                <div>
                  <p>Highest</p>
                  <h3>-</h3>
                </div>
              </div>
              <div className="bottom_main_left_satistic_inner_two">
                <div>
                  <p>Average profit</p>
                  <h3>$0</h3>
                </div>
                <div>
                  <p>Average loss</p>
                  <h3>$0</h3>
                </div>
                <div>
                  <p>Average RRR</p>
                  <h3>0.00</h3>
                </div>
                <div>
                  <p>Martingale Status</p>
                  <button>Success</button>
                </div>
                <div>
                  <p>Martingale Count</p>
                  <h3>0</h3>
                </div>
              </div>
            </div>
            <div className="bottom_main_left_satistic_lower">
              <h3>Last Updated:</h3>
              <p>Thu Jul 18 GMT+0530 (India Standard Time)</p>
            </div>
          </div>
        </div>
        <div className="bottom_main_right">
          <div className="accountMetrics_wrapper_header">
            <h2>Trading Objective</h2>
          </div>

          <div className="bottom_main_right_inner">
            <div>
              <div>
                <h4>
                  Minimum days - 3 <span>{">"}</span>
                </h4>
              </div>
              <button>In Progress</button>
            </div>
            <div>
              <div>
                <h4>
                  Profit $8,000 <span>{">"}</span>
                </h4>
                <p>Results : $0</p>
              </div>
              <button>In Progress</button>
            </div>

            <div>
              <div>
                <h4>
                  Max Loss $10,000 <span>{">"}</span>
                </h4>
                <p>Results : $0</p>
              </div>
              <button>In Progress</button>
            </div>

            <div>
              <div>
                <h4>
                  Max Daily Loss $5,000 <span>{">"}</span>
                </h4>
                <p>Remaining : 5000.00</p>
              </div>
              <button>In Progress</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
