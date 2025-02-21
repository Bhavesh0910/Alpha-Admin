import React, { useEffect, useState } from "react";
import "./Insights.scss";
import { Empty, Radio, Spin } from "antd";
import { fetchAccountInsights } from "../../../../store/NewReducers/amSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatValue } from "../../../../utils/helpers/string";
import RiskInsights from "./RiskInsights";

const Insights = ({ login_id, platform }) => {
  const [insightTab, setInsightTab] = useState("");
  const [pageNo, setPageNo] = useState(1);

  const onChangeActive = (e) => {
    setPageNo(1);
    setInsightTab(e.target.value);
  };

  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const { accountInsights, isLoading, error } = useSelector((state) => state.accountMetrics);

  useEffect(() => {
    dispatch(fetchAccountInsights({ login_id, platform, idToken }));
  }, [dispatch, login_id, platform, idToken]);




  return (
    <div className="insights_main">
      {/* Tabination */}
      <div className="trader-overview-header-right tabs_wrapper">
        <Radio.Group value={insightTab} onChange={onChangeActive}>
          <Radio.Button value="">Advanced Statistics</Radio.Button>
          <Radio.Button value="Insights">Risk Insights</Radio.Button>
        </Radio.Group>
      </div>

      {/* Main Container */}

      {insightTab === "Insights" ? <RiskInsights data={accountInsights} /> :

        <div className="insights_main_container">
          <div className="insights_main_header">
            <h2>Advanced Statistics</h2>
          </div>

          {!accountInsights ?
            <Empty className="no_data" description="No Data Available" />
            :


            <div className="insights_main_inner">
              <div className="insights_main_left">
                <div>
                  <p>Total Trades</p>
                  <p>{formatValue(accountInsights?.total_trades, 0)}</p>
                </div>
                <div>
                  <p>Long Trades</p>
                  <p>{formatValue(accountInsights?.Long_trade, 0)}</p>
                </div>
                <div>
                  <p>Short Trades</p>
                  <p>{formatValue(accountInsights?.short_trade, 0)}</p>
                </div>
                <div>
                  <p>Best Trade</p>
                  <p>{formatValue(accountInsights?.best_trade, 0)}</p>
                </div>
                <div>
                  <p>Worst Trade</p>
                  <p>{formatValue(accountInsights?.worst_trade, 0)}</p>
                </div>
                <div>
                  <p>Lots</p>
                  <p>{formatValue(accountInsights?.lots)}</p>
                </div>
                <div>
                  <p>Commission</p>
                  <p>{formatValue(accountInsights?.commission)}</p>
                </div>
                <div>
                  <p>Pips</p>
                  <p>{formatValue(accountInsights?.pips)}</p>
                </div>
              </div>

              <div className="insights_main_right">
                <div>
                  <p>Long Won</p>
                  <p>{formatValue(accountInsights?.long_won)}</p>
                </div>
                <div>
                  <p>Short Won</p>
                  <p>{formatValue(accountInsights?.short_won)}</p>
                </div>
                <div>
                  <p>Best Trade Pip</p>
                  <p>{formatValue(accountInsights?.best_trade_pip)}</p>
                </div>
                <div>
                  <p>Worst Trade Pip</p>
                  <p>{formatValue(accountInsights?.worst_trade_pip)}</p>
                </div>
                <div>
                  <p>Average Win</p>
                  <p>{formatValue(accountInsights?.average_win)}</p>
                </div>
                <div>
                  <p>Average Loss</p>
                  <p>{formatValue(accountInsights?.average_loss)}</p>
                </div>
                <div>
                  <p>Loss Ratio</p>
                  <p>{formatValue(accountInsights?.loss_ratio)}</p>
                </div>
                <div>
                  <p>Profit</p>
                  <p>{formatValue(accountInsights?.Profit)}</p>
                </div>
                <div>
                  <p>Average Trade Length</p>
                  <p>{formatValue(accountInsights?.average_trade_length)}</p>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default Insights;
