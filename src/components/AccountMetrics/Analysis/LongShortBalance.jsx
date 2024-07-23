import React, {useState} from "react";
import "./LongShortBalance.scss";
import TradesIcon from "../../../assets/icons/numoftrades.svg";
import {Radio} from "antd";
import LongBalanceChart from "./Charts/BalanceChart";
import NoOfTrades from "./Charts/NoOfTrades";
import BalanceChart from "./Charts/BalanceChart";
import resultIcon from "../../../assets/icons/resultIcon.svg";
import Winrate from "../../../assets/icons/Winrate.svg";
import averageProfit from "../../../assets/icons/averageProfit.svg";
import RRR from "../../../assets/icons/RRR.svg";

const dataBoxes = [
  {
    header: "No of Trades",
    icon: TradesIcon,
    data: {long: "$278368", short: "$278368"},
  },
  {
    header: "Results",
    icon: resultIcon,
    data: {long: "$500000", short: "$300000"},
  },
  {
    header: "Win Rate",
    icon: Winrate,
    data: {long: "$1000", short: "$800"},
  },
  {
    header: "Average Profit",
    icon: averageProfit,
    data: {long: "75%", short: "65%"},
  },
  {
    header: "RRR",
    icon: RRR,
    data: {long: "25%", short: "35%"},
  },
];

const LongShortBalance = () => {
  const [longChart, setlongChart] = useState("Balance");
  const [shortChart, shortshortChart] = useState("Balance");

  const LongTabChange = (e) => {
    setlongChart(e.target.value);
  };
  const ShortTabChange = (e) => {
    shortshortChart(e.target.value);
  };

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
          {longChart === "Balance" && <BalanceChart />}
          {longChart === "No Of Trades" && <NoOfTrades />}
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
          {shortChart === "Balance" && <BalanceChart />}
          {shortChart === "No Of Trades" && <NoOfTrades />}
        </div>
      </div>
    </div>
  );
};

export default LongShortBalance;

const DataBox = ({header, icon, data}) => {
  return (
    <div className="databox">
      <div className="db_header">
        <h3>{header}</h3>
        <img
          src={icon}
          alt=""
        />
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
