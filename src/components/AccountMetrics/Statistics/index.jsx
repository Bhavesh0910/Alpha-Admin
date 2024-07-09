import React from "react";
import "./style.scss";
import contractIcon from "../../../assets/icons/contract.svg";
import bestTradeIcon from "../../../assets/icons/best-trade.svg";
import worstTradeIcon from "../../../assets/icons/worst-trade.svg";
import avgWinIcon from "../../../assets/icons/avg-win.svg";
import avgLossIcon from "../../../assets/icons/avg-loss.svg";
import noOfTradesIcon from "../../../assets/icons/no-of-trades.svg";
import winRateIcon from "../../../assets/icons/win-rate.svg";
import profitFactorIcon from "../../../assets/icons/profit-factor.svg";
import { FormatUSD } from "../../../utils/helpers/string";

function Statistics({ data }) {
  // console.log(data, "#FF9898#FF9898");
  const newData = data?.account_metrics?.calculated_data;
  const statisticsData = [
    {
      title: "Best Trade",
      value: newData?.highest,
      formatUsd: true,
      icon: bestTradeIcon,
    },
    {
      title: "Worst Trade",
      value: newData?.worst_trade,
      formatUsd: true,
      icon: worstTradeIcon,
    },
    {
      title: "Avg Win",
      value: newData?.average_profit,
      formatUsd: true,
      icon: avgWinIcon,
    },
    {
      title: "Avg Loss",
      value: newData?.average_loss,
      formatUsd: true,
      icon: avgLossIcon,
    },
    {
      title: "No of Trades",
      value: newData?.total_trades,
      icon: noOfTradesIcon,
      formatUsd: false,
    },
    {
      title: "Win Rate",
      value: newData?.win_rate + "%",
      icon: winRateIcon,
      formatUsd: false,
    },
    {
      title: "Contracts",
      value: newData?.lots,
      icon: contractIcon,
      formatUsd: false,
    },

    {
      title: "Profit Factor",
      value: newData?.profit_factor.toFixed(2),
      icon: profitFactorIcon,
      formatUsd: false,
    },
  ];

  return (
    <div className="statistics box">
      <h2 className="component-heading">Statistics</h2>
      <div className="statistics-box-wrapper">
        {statisticsData.map((data, index) => (
          <StatisticsBox key={index} data={data} />
        ))}
      </div>
    </div>
  );
}

export default Statistics;

const StatisticsBox = ({ data }) => {
  return (
    <div className="statistics-box">
      <img src={data.icon} alt="" />
      <div>
        <p>{data.title}</p>
        {data?.formatUsd === true ? (
          <span
            className={data?.value > 0 ? "positive_value" : "navative_value"}
          >
            {FormatUSD(data.value)}
          </span>
        ) : (
          <span>{data.value}</span>
        )}
      </div>
    </div>
  );
};
