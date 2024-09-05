import React, { useState } from "react";
import "./LongShortBalance.scss";
import TradesIcon from "../../../assets/icons/numoftrades.svg";
import { Radio } from "antd";
import BalanceChart from "./Charts/BalanceChart";
import NoOfTrades from "./Charts/NoOfTrades";
import resultIcon from "../../../assets/icons/resultIcon.svg";
import Winrate from "../../../assets/icons/Winrate.svg";
import averageProfit from "../../../assets/icons/averageProfit.svg";
import RRR from "../../../assets/icons/RRR.svg";
import { formatValue } from "../../../utils/helpers/string";

const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '-';
  const formattedValue = value.toFixed(2);
  return formattedValue.startsWith('-') ? `-$${formattedValue.slice(1)}` : `$${formattedValue}`;
};


const LongShortBalance = ({ data }) => {
  const [longChart, setLongChart] = useState("Balance");
  const [shortChart, setShortChart] = useState("Balance");

  const LongTabChange = (e) => {
    setLongChart(e.target.value);
  };

  const ShortTabChange = (e) => {
    setShortChart(e.target.value);
  };



  const dataBoxes = [
    {
      header: "No of Trades",
      icon: TradesIcon,
      data: {
        long: formatValue(data?.number_of_long_trade , 0),
        short: formatValue(data?.number_of_Short_trade , 0)
      }
    },
    {
      header: "Results",
      icon: resultIcon,
      data: {
        long: formatValue(formatCurrency(data?.long_profit)),
        short: formatValue(formatCurrency(data?.short_profit))
      }
    },
    {
      header: "Win Rate",
      icon: Winrate,
      data: {
        long: formatValue(formatPercentage(data?.long_win_rate)),
        short: formatValue(formatPercentage(data?.short_win_rate))
      }
    },
    {
      header: "Average Profit",
      icon: averageProfit,
      data: {
        long: formatValue(formatCurrency(data?.long_avg_profit)),
        short: formatValue(formatCurrency(data?.short_avg_profit))
      }
    },
    {
      header: "RRR",
      icon: RRR,
      data: {
        long: formatValue(formatPercentage(data?.long_rrr)),
        short: formatValue(formatPercentage(data?.short_rrr))
      }
    }
  ];
  
 

  return (
    <div className="long_short_balance">
      <div className="analysis_box">
        <h2 className="standard_heading">Long/Short Balance</h2>
        <div className="databox_wrapper">
          {dataBoxes.map((box, index) => (
            <DataBox
              key={index}
              header={box.header}
              icon={box.icon}
              data={box.data}
            />
          ))}
        </div>
      </div>
      <div className="long_short_balance_charts">
        <div className="long_balance_chart">
          <div className="long_balance_chart_header_tabs">
            <div className="long_balance_chart_header">
              <h2>Long Balance</h2>
            </div>
            <div className="trader-overview-header-right tabs_wrapper">
              <Radio.Group
                value={longChart}
                onChange={LongTabChange}
              >
                <Radio.Button value="Balance">Balance</Radio.Button>
                <Radio.Button value="No Of Trades">No Of Trades</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          {longChart === "Balance" && <BalanceChart data={data?.Long_chart?.balance} />}
          {longChart === "No Of Trades" && <NoOfTrades data={data?.Long_chart?.number_of_trades} />}
        </div>

        <div className="short_balance_chart">
          <div className="short_balance_chart_header_tabs">
            <div className="short_balance_chart_header">
              <h2>Short Balance</h2>
            </div>
            <div className="trader-overview-header-right tabs_wrapper">
              <Radio.Group
                value={shortChart}
                onChange={ShortTabChange}
              >
                <Radio.Button value="Balance">Balance</Radio.Button>
                <Radio.Button value="No Of Trades">No Of Trades</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          {shortChart === "Balance" && <BalanceChart data={data?.short_chart?.balance} />}
          {shortChart === "No Of Trades" && <NoOfTrades data={data?.short_chart?.number_of_trades} />}
        </div>
      </div>
    </div>
  );
};

export default LongShortBalance;

const DataBox = ({ header, icon, data }) => {
  return (
    <div className="databox">
      <div className="db_header">
        <h3>{header}</h3>
        <img src={icon} alt="" />
      </div>
      <div className="data_wrapper">
        <h2 className="title long">Long</h2>
        <p className="value">{data.long}</p>
      </div>
      <div className="data_wrapper">
        <h2 className="title short">Short</h2>
        <p className="value">{data.short}</p>
      </div>
    </div>
  );
};
