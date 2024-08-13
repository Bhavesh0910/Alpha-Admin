import React, { useEffect, useState } from "react";
import "./Insights.scss";
import { Radio, Spin } from "antd"; 
import { fetchAccountInsights } from "../../../../store/NewReducers/amSlice";
import { useDispatch, useSelector } from "react-redux";

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

  if (isLoading) {
    return <Spin size="large" className="spinner" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
      <div className="insights_main_container">
        <div className="insights_main_header">
          <h2>Advanced Statistics</h2>
        </div>

        <div className="insights_main_inner">
          <div className="insights_main_left">
            <div>
              <p>Total Trades</p>
              <p>{accountInsights?.total_trades}</p>
            </div>
            <div>
              <p>Long Trades</p>
              <p>{accountInsights?.Long_trade}</p>
            </div>
            <div>
              <p>Short Trades</p>
              <p>{accountInsights?.short_trade}</p>
            </div>
            <div>
              <p>Best Trade</p>
              <p>{accountInsights?.best_trade}</p>
            </div>
            <div>
              <p>Worst Trade</p>
              <p>{accountInsights?.worst_trade}</p>
            </div>
            <div>
              <p>Commission</p>
              <p>{accountInsights?.commission}</p>
            </div>
            <div>
              <p>Pips</p>
              <p>{accountInsights?.pips}</p>
            </div>
          </div>

          <div className="insights_main_right">
            <div>
              <p>Long Won</p>
              <p>{accountInsights?.long_won}</p>
            </div>
            <div>
              <p>Short Won</p>
              <p>{accountInsights?.short_won}</p>
            </div>
            <div>
              <p>Best Trade Pip</p>
              <p>{Number(accountInsights?.best_trade_pip)?.toFixed(2)}</p>
            </div>
            <div>
              <p>Worst Trade Pip</p>
              <p>{accountInsights?.worst_trade_pip?.toFixed(2)}</p>
            </div>
            <div>
              <p>Average Win</p>
              <p>{accountInsights?.average_win}</p>
            </div>
            <div>
              <p>Average Loss</p>
              <p>{accountInsights?.average_loss}</p>
            </div>
            <div>
              <p>Loss Ratio</p>
              <p>{Number(accountInsights?.loss_ratio)?.toFixed(2)}</p>
            </div>
            <div>
              <p>Profit</p>
              <p>{accountInsights?.Profit}</p>
            </div>
            <div>
              <p>Average Trade Length</p>
              <p>{accountInsights?.average_trade_length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
