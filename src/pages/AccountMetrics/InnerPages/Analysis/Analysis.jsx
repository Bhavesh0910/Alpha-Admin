import React, {useEffect, useState} from "react";
import "./Analysis.scss";
import {Radio} from "antd";
import LongShortBalance from "../../../../components/AccountMetrics/Analysis/LongShortBalance";
import ResultByDays from "../../../../components/AccountMetrics/Analysis/ResultByDays";
import LongShortComparision from "../../../../components/AccountMetrics/Analysis/LongShortComparision";
import ResultByPositionSize from "../../../../components/AccountMetrics/Analysis/ResultByPositionSize";
import TradeDayAnalysis from "../../../../components/AccountMetrics/Analysis/TradeDayAnalysis";
import ResultByTradeDuration from "../../../../components/AccountMetrics/Analysis/ResultByTradeDuration";
import ResultByOpenHour from "../../../../components/AccountMetrics/Analysis/ResultByOpenHour";
import {useDispatch, useSelector} from "react-redux";
import {fetchAccountAnalysis, fetchAccountInsights} from "../../../../store/NewReducers/amSlice";

const Analysis = ({login_id, platform}) => {
  const [selectedView, setSelectedView] = useState("longShortBalance");

  const handleRadioChange = (e) => {
    setSelectedView(e.target.value);
  };

  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const {accountInsights, accountAnalysis, isLoading, error} = useSelector((state) => state.accountMetrics);

  console.log(accountAnalysis);
  return (
    <div className="account_metrics_analysis">
      <Radio.Group
        onChange={handleRadioChange}
        value={selectedView}
      >
        <Radio.Button value="longShortBalance">Long/Short Balance</Radio.Button>
        <Radio.Button value="resultByDays">Result by Days</Radio.Button>
        <Radio.Button value="longShortComparison">Long/Short Comparison</Radio.Button>
        <Radio.Button value="tradingDaysAnalysis">Trading Days Analysis</Radio.Button>
        <Radio.Button value="resultByPositionSize">Result by Position Size</Radio.Button>
        <Radio.Button value="resultByTradeDuration">Result by Trade Duration</Radio.Button>
        <Radio.Button value="resultByOpenHour">Result by Open Hour</Radio.Button>
      </Radio.Group>

      {selectedView === "longShortBalance" && <LongShortBalance data={accountAnalysis?.long_short_comp} />}
      {selectedView === "resultByDays" && <ResultByDays data={accountAnalysis?.day_wise_data} />}
      {selectedView === "longShortComparison" && <LongShortComparision data={accountAnalysis?.result_by_instruments} />}
      {selectedView === "resultByPositionSize" && <ResultByPositionSize data={accountAnalysis?.results_by_lots} />}
      {selectedView === "tradingDaysAnalysis" && <TradeDayAnalysis data={accountAnalysis?.trading_days_analysis} />}
      {selectedView === "resultByTradeDuration" && <ResultByTradeDuration data={accountAnalysis?.result_by_trade_duration} />}
      {selectedView === "resultByOpenHour" && <ResultByOpenHour data={accountAnalysis?.result_by_open_hour} />}
    </div>
  );
};

export default Analysis;
