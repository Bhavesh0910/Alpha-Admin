import React from "react";
import "./LongShortComparision.scss";
import BarChart from "./Charts/BarChart";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

function LongShortComparision({ data }) {
  const categories = data.map((item) => item[0]); 
  const seriesData1 = [
    {
      name: "Result",
      data: data.map((item) => item[1].results), 
    },
  ];

  const columns = [
    {
      title: "Instrument",
      dataIndex: "instrument",
      key: "instrument",
    },
    {
      title: "No. of Trades",
      dataIndex: "number_of_trade",
      key: "number_of_trade",
    },
    {
      title: "Result",
      dataIndex: "results",
      key: "results",
      render: (text) => <span style={{color: text < 0 ? "red" : "green"}}>${text.toFixed(2)}</span>,
    },
    {
      title: "Long Trades",
      children: [
        {
          title: "No. of Trades",
          dataIndex: "long_trade",
          key: "long_trade",
        },
        {
          title: "Result",
          dataIndex: "long_result",
          key: "long_result",
          render: (text) => <span style={{color: text < 0 ? "red" : "green"}}>${text.toFixed(2)}</span>,
        },
      ],
    },
    {
      title: "Short Trades",
      children: [
        {
          title: "No. of Trades",
          dataIndex: "short_trade",
          key: "short_trade",
        },
        {
          title: "Result",
          dataIndex: "short_result",
          key: "short_result",
          render: (text) => <span style={{color: text < 0 ? "red" : "green"}}>${text.toFixed(2)}</span>,
        },
      ],
    },
  ];

  const tableData = data.map((item, index) => ({
    key: index.toString(),
    instrument: item[0],
    number_of_trade: item[1].number_of_trade,
    results: item[1].results,
    long_trade: item[1].long_trade,
    long_result: item[1].long_result,
    short_trade: item[1].short_trade,
    short_result: item[1].short_result,
  }));

  return (
    <div className="long_short_comparision">
      <div className="analysis_box">
        <h2 className="standard_heading">Result by Instruments</h2>

        <div className="chart_wrapper">
          <BarChart
            seriesData={seriesData1}
            categories={categories}
          />
        </div>
      </div>

      <div className="analysis_box">
        <div>
          <h2 className="standard_heading">Results by Instruments</h2>
        </div>
        <div className="resultsBy_investment">
          <AntTable
            columns={columns}
            data={tableData}
            pagination={{
              defaultPageSize: 10,
              total: tableData.length,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30", "40"],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LongShortComparision;
