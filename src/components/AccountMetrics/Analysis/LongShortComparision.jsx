import React from "react";
import "./LongShortComparision.scss";
import BarChart from "./Charts/BarChart";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import ReactCountryFlag from "react-country-flag";

function LongShortComparision() {
  const categories = ["EURJPY.Imax", "EURJPY.Imax", "EURJPY.Imax", "EURJPY.Imax", "EURJPY.Imax", "EURJPY.Imax", "EURJPY.Imax"];
  const seriesData1 = [
    {
      name: "Result",
      data: [400, 800, -400, 1200, 400, 800, -400],
    },
  ];

  // Table data
  const columns = [
    {
      title: "Instruments",
      dataIndex: "instrument",
      key: "instrument",
      render: (text, record) => (
        <span>
          <ReactCountryFlag
            countryCode={record.country1}
            svg
            style={{marginRight: 8}}
          />
          {text}
          <ReactCountryFlag
            countryCode={record.country2}
            svg
            style={{marginLeft: 8}}
          />
        </span>
      ),
    },
    {
      title: "No. of Trades",
      dataIndex: "noOfTrades",
      key: "noOfTrades",
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (text) => <span style={{color: text.startsWith("-") ? "red" : "green"}}>{text}</span>,
    },
    {
      title: "Long Trades",
      children: [
        {
          title: "No. of Trades",
          dataIndex: "longNoOfTrades",
          key: "longNoOfTrades",
        },
        {
          title: "Result",
          dataIndex: "longResult",
          key: "longResult",
          render: (text) => <span style={{color: text.startsWith("-") ? "red" : "green"}}>{text}</span>,
        },
      ],
    },
    {
      title: "Short Trades",
      children: [
        {
          title: "No. of Trades",
          dataIndex: "shortNoOfTrades",
          key: "shortNoOfTrades",
        },
        {
          title: "Result",
          dataIndex: "shortResult",
          key: "shortResult",
          render: (text) => <span style={{color: text.startsWith("-") ? "red" : "green"}}>{text}</span>,
        },
      ],
    },
  ];

  const data = [
    {
      key: "1",
      instrument: "EUR / JPY",
      noOfTrades: "00",
      result: "-$0.16",
      longNoOfTrades: "00",
      longResult: "-$0.16",
      shortNoOfTrades: "00",
      shortResult: "-$135.31",
    },
    {
      key: "2",
      instrument: "EUR / USD",
      noOfTrades: "01",
      result: "-$201.23",
      longNoOfTrades: "01",
      longResult: "-$65.92",
      shortNoOfTrades: "01",
      shortResult: "$0.00",
    },
    {
      key: "3",
      instrument: "GBP / AUD",
      noOfTrades: "02",
      result: "-$75.66",
      longNoOfTrades: "02",
      longResult: "-$75.66",
      shortNoOfTrades: "02",
      shortResult: "$0.00",
    },
    {
      key: "4",
      instrument: "GBP / CAD",
      noOfTrades: "02",
      result: "$171.41",
      longNoOfTrades: "02",
      longResult: "-$0.24",
      shortNoOfTrades: "02",
      shortResult: "$0.00",
    },
    {
      key: "5",
      instrument: "GBP / JPY",
      noOfTrades: "01",
      result: "$140.52",
      longNoOfTrades: "01",
      longResult: "-$210.52",
      shortNoOfTrades: "01",
      shortResult: "$55.15",
    },
    {
      key: "6",
      instrument: "GBP / USD",
      noOfTrades: "00",
      result: "$946.08",
      longNoOfTrades: "00",
      longResult: "$171.41",
      shortNoOfTrades: "00",
      shortResult: "$65.06",
    },
    {
      key: "7",
      instrument: "NZD / USD",
      noOfTrades: "00",
      result: "-$0.24",
      longNoOfTrades: "00",
      longResult: "$85.37",
      shortNoOfTrades: "00",
      shortResult: "$0.00",
    },
    {
      key: "8",
      instrument: "USD / CAD",
      noOfTrades: "01",
      result: "$91.59",
      longNoOfTrades: "01",
      longResult: "$881.02",
      shortNoOfTrades: "01",
      shortResult: "$91.59",
    },
    {
      key: "9",
      instrument: "USD / CHF",
      noOfTrades: "00",
      result: "$122.96",
      longNoOfTrades: "00",
      longResult: "$0.00",
      shortNoOfTrades: "00",
      shortResult: "$122.96",
    },
    {
      key: "10",
      instrument: "XAU / USD",
      noOfTrades: "02",
      result: "-$186.25",
      longNoOfTrades: "02",
      longResult: "$0.00",
      shortNoOfTrades: "02",
      shortResult: "$24.27",
    },
  ];

  return (
    <div className="long_short_comparision">
      <div className="analysis_box">
        <h2 className="standard_heading">Long short Comparision</h2>

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
            data={data}
            pagination={{
              defaultPageSize: 10,
              total: 85,
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
