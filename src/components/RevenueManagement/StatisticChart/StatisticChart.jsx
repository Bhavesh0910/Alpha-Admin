import React from "react";
import "./StatisticChart.scss";
import ReactApexChart from "react-apexcharts";
import {Select} from "antd";

const StatisticChart = () => {
  const series = [
    {
      name: "Payout Requested",
      data: [100, 200, 150, 300, 200, 400, 500],
    },
    {
      name: "Total amount paid in profit share",
      data: [50, 250, 100, 200, 300, 350, 600],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      background: "#fff",
    },
    colors: ["#FF7F00", "#4CAF50"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2023-01-01T00:00:00.000Z",
        "2023-02-01T00:00:00.000Z",
        "2023-03-01T00:00:00.000Z",
        "2023-04-01T00:00:00.000Z",
        "2023-05-01T00:00:00.000Z",
        "2023-06-01T00:00:00.000Z",
        "2023-07-01T00:00:00.000Z",
      ],
      labels: {
        style: {
          colors: "#1E1E1E",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#1E1E1E",
        },
        formatter: (val) => `$${val}`,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
    legend: {
      labels: {
        colors: "#1E1E1E",
      },
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
  };

  return (
    <div className="statisticChart_wrapper">
      <div className="header_wrapper">
        <h3>Statistics</h3>
        <Select
          defaultValue={""}
          className="chart_filter"
          onChange={""}
          options={options}
        />
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={360}
      />
    </div>
  );
};

export default StatisticChart;
