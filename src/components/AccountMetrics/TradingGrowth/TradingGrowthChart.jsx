// TradingGrowthChart.js

import { LTTB } from "downsample";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { FormatUSD } from "../../../utils/helpers/string";

function TradingGrowthChart({ balance_chart, maxLoss, profit }) {
  const balanceData = balance_chart?.map((entry) => entry.balance);
  const equityData = balance_chart?.map((entry) => entry.equity);
  const timeData = balance_chart?.map((entry) => entry.time);

  let combinedData = [];
  let separatedData = [];

  if (balanceData && equityData && timeData) {
    combinedData = balance_chart.map((entry) => ({
      balance: entry.balance,
      equity: entry.equity,
      time: entry.time,
    }));

    try {
      const dataToSmooth = combinedData.map((entry, index) => [
        index,
        entry.balance,
        entry.equity,
        entry.time,
      ]);

      const smooth = LTTB(dataToSmooth, 1500);

      separatedData = smooth.map((item) => ({
        balance: item[1],
        equity: item[2],
        time: item[3],
      }));
      // console.log(separatedData, "separatedData");
    } catch (error) {
      console.error("Error during LTTB smoothing:", error);
    }
  }

  // const equitySeries = separatedData.map((entry) => [
  //   new Date(entry.time).getTime(),
  //   entry.equity,
  // ]);
  const maxLossSeries = separatedData.map((entry) => [
    new Date(entry.time).getTime(),
    maxLoss,
  ]);
  const profitSeries = separatedData.map((entry) => [
    new Date(entry.time).getTime(),
    profit,
  ]);
  const balanceSeries = separatedData.map((entry) => [
    new Date(entry.time).getTime(),
    entry.balance,
  ]);
  const formattedDates = balance_chart?.map((entry) => {
    const date = new Date(entry?.time);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  });
  // console.log(formattedDates, "formattedDates");

  // const series = [
  //   {
  //     name: "Balance",
  //     data: balanceSeries,
  //   },
  //   {
  //     name: "Equity",
  //     data: equitySeries,
  //   },
  // ];
  // console.log(balanceSeries, "balanceSeriesbalanceSeries");
  const series = [
    {
      name: "Balance",
      data: balanceSeries,
    },
    {
      name: "Profit target",
      data: profitSeries,
    },
    {
      name: "Max loss limit",
      data: maxLossSeries,
    },
  ];

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#8BFB88", "#FFF27A", "#FF9898"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: formattedDates,
      labels: {
        style: {
          colors: "#FFF",
          fontSize: "10px",
          fontFamily: "var(--primary-font-family)",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          letterSpacing: "0.1px",
        },
        formatter: function (value, timestamp) {
          const date = new Date(timestamp);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
        },
      },
    },
    yaxis: {
      min: maxLoss - 5000,
      // labels: {
      //   style: {
      //     colors: "#FFF",
      //   },
      // },
      labels: {
        formatter: function (y) {
          return FormatUSD(y);
        },
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        formatter: function (value) {
          const date = new Date(value);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={360}
    />
  );
}

export default TradingGrowthChart;
