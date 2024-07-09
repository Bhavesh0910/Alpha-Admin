import React from "react";
import "./style.scss";
import Table from "../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";

function CloseTrades({ data }) {
  // console.log(data, "account_metricsaccount_metrics");
  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbolId",
      key: "symbolId",
    },
    {
      title: "Symbol Name",
      dataIndex: "symbolName",
      key: "symbolName",
    },
    {
      title: "Entry Price",
      dataIndex: "entryPrice",
      key: "entryPrice",
    },
    {
      title: "Exit Price",
      dataIndex: "exitPrice",
      key: "exitPrice",
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
    },
    {
      title: "Trade Day",
      dataIndex: "tradeDay",
      key: "tradeDay",
      render: (value) => <div>{moment(value).format("DD-MM-YYYY")}</div>,
    },
    {
      title: "Profit/Loss",
      dataIndex: "pnL",
      key: "pnL",
      render: (value) => (
        <span className={value < 0 ? "negative-profit" : "positive-profit"}>
          {value < 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M13.0222 6.02222C13.2861 6.28609 13.2861 6.71391 13.0222 6.97778L7 13L0.97778 6.97778C0.71391 6.71391 0.713909 6.28609 0.97778 6.02222C1.24165 5.75835 1.66947 5.75835 1.93334 6.02222L7 11.0889L12.0667 6.02222C12.3305 5.75835 12.7583 5.75835 13.0222 6.02222Z"
                fill="#FF4343"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M13.0222 12.5227C13.2861 12.2588 13.2861 11.831 13.0222 11.5671L7 5.54492L0.97778 11.5671C0.71391 11.831 0.713909 12.2588 0.97778 12.5227C1.24165 12.7866 1.66947 12.7866 1.93334 12.5227L7 7.45606L12.0667 12.5227C12.3305 12.7866 12.7583 12.7866 13.0222 12.5227Z"
                fill="#7AD67A"
              />
            </svg>
          )}
          ${Math.abs(value)}
        </span>
      ),
    },
  ];
  

  return (
    <div className="close-trades">
      <h2 className="component-heading">Trade History</h2>
      <div className="db_table_container">
        <Table columns={columns} data={data || []} />
      </div>
    </div>
  );
}

export default CloseTrades;
