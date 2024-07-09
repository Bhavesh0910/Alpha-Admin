import React from "react";
import "./style.scss";
import moment from "moment";
import { FormatUSD } from "../../../utils/helpers/string";

function AccountsData({ data }) {
  const newData = data?.account_metrics?.calculated_data;
  const accountData = [
    {
      title: "Daily Gain",
      customClass: true,
      value: newData?.daily_gain?.toFixed(2),
    },
    {
      title: "Abs Gain",
      customClass: true,
      value: newData?.absolute_gain?.toFixed(2),
    },
    // {
    //   title: "Daily Drawdown",
    //   customClass: true,
    //   value: newData?.daily_drawdown?.toFixed(2),
    // },
    // {
    //   title: "Start Date",
    //   customClass: false,
    //   value: moment(data?.start_date).format("DD-MM-YYYY"),
    // },

    // {
    //   title: "Max Drawdown",
    //   customClass: false,
    //   value: data?.account_metrics?.get_trading_accounts?.drawDownLimit,
    // },
    // {
    //   title: "Winrate",
    //   customClass: false,
    //   value: newData?.win_rate,
    // },
    // {
    //   title: "No. of trades",
    //   customClass: false,
    //   value: newData?.total_trades,
    // },
    // {
    //   title: "Contracts",
    //   customClass: false,
    //   value: newData?.lots,
    // },
    {
      title: "RRR",
      customClass: false,
      value: data?.account_metrics?.calculated_data?.rrr?.toFixed(2),
    },
    {
      title: "Expectancy",
      customClass: false,
      value: newData?.expectancy_ratio?.toFixed(2),
    },
  ];

  return (
    <div className="account-data box">
      <h2 className="component-heading">Account Data</h2>
      <div className="account-data-box-wrapper">
        {accountData.map((data, index) => (
          <AccountDataBox key={index} data={data} />
        ))}
      </div>
    </div>
  );
}

export default AccountsData;

const AccountDataBox = ({ data }) => {
  return (
    <div className="account-data-box">
      <div className="account-data-left">
        <p>{data.title}</p>
      </div>
      <div className="account-data-right">
        <p
          style={{
            color:
              data?.value > 0 ? "#7ad67a" : data?.value < 0 ? "#ff4343" : "",
          }}
        >
          {data?.title === "RRR" || data?.title === "Expectancy"
            ? data.value || "N/A"
            : data.value
            ? data.value + "%"
            : "N/A"}
        </p>
      </div>
    </div>
  );
};
