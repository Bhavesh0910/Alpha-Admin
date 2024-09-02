import React from "react";
import AntTable from "./../../../../../ReusableComponents/AntTable/AntTable";

export const Volume = () => {
  const columns = [
    {
      title: "Sr. no.",
      dataIndex: "sr_no",
      key: "sr_no",
      width: 150,
    },
    {
        title: "Symbol",
        dataIndex: "symbol",
        key: "symbol",
        width: 150,
      },
      {
        title: "No. of Trades",
        dataIndex: "no_of_trades",
        key: "no_of_trades",
        width: 150,
      },
      {
        title: "Traded Volume",
        dataIndex: "traded_volume",
        key: "traded_volume",
        width: 150,
      },
      {
        title: "Volume(24h)",
        dataIndex: "volume",
        key: "volume",
        width: 150,
      },
      {
        title: "Last 7 days",
        dataIndex: "last_7_days",
        key: "last_7_days",
        width: 150,
      },
      {
        title: "%1H",
        dataIndex: "%_1_hour",
        key: "%_1_hour",
        width: 150,
      },
      {
        title: "%7Days",
        dataIndex: "%_7_days",
        key: "%_7_days",
        width: 150,
      },
      {
        title: "%1Month",
        dataIndex: "%_1_month",
        key: "%_1_month",
        width: 150,
      },
  ];
  return (
    <div>
      <AntTable
      columns={columns}
      />
    </div>
  );
};
