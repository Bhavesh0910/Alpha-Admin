import React, {useState} from 'react';
import './Analysis.scss'
import { Radio } from 'antd';
import LongShortBalance from '../../../../components/AccountMetrics/Analysis/LongShortBalance';
import ResultByDays from '../../../../components/AccountMetrics/Analysis/ResultByDays';
import LongShortComparision from '../../../../components/AccountMetrics/Analysis/LongShortComparision';
import ResultByPositionSize from '../../../../components/AccountMetrics/Analysis/ResultByPositionSize';
import TradeDayAnalysis from '../../../../components/AccountMetrics/Analysis/TradeDayAnalysis';
import ResultByTradeDuration from '../../../../components/AccountMetrics/Analysis/ResultByTradeDuration';
import ResultByOpenHour from '../../../../components/AccountMetrics/Analysis/ResultByOpenHour';

const Analysis = () => {
  const [selectedView, setSelectedView] = useState('longShortBalance');

  const handleRadioChange = (e) => {
    setSelectedView(e.target.value);
  };

  return (
    <div className='account_metrics_analysis'>
      <Radio.Group onChange={handleRadioChange} value={selectedView}>
        <Radio.Button value="longShortBalance">Long/Short Balance</Radio.Button>
        <Radio.Button value="resultByDays">Result by Days</Radio.Button>
        <Radio.Button value="longShortComparison">Long/Short Comparison</Radio.Button>
        <Radio.Button value="tradingDaysAnalysis">Trading Days Analysis</Radio.Button>
        <Radio.Button value="resultByPositionSize">Result by Position Size</Radio.Button>
        <Radio.Button value="resultByTradeDuration">Result by Trade Duration</Radio.Button>
        <Radio.Button value="resultByOpenHour">Result by Open Hour</Radio.Button>
      </Radio.Group>

       {selectedView === "longShortBalance" && <LongShortBalance />}
      {selectedView === "resultByDays" && <ResultByDays />}
       {selectedView === "longShortComparison" && <LongShortComparision />}
       {selectedView === "resultByPositionSize" && <ResultByPositionSize />}
      {selectedView === "tradingDaysAnalysis" && <TradeDayAnalysis />}
      {selectedView === "resultByTradeDuration" && <ResultByTradeDuration />}
      {selectedView === "resultByOpenHour" && <ResultByOpenHour />}  
    </div>
  );
};

export default Analysis;
