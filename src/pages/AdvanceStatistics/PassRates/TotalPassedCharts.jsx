import React from "react";
import { Radio } from "antd";
import Chart from "react-apexcharts";

const TotalPassesCharts = ({ data, passFilter, onChangePassFilter }) => {
  const dates = data ? data.map(item => item.period_date) : [];
  const totalPassed = data ? data.map(item => item.passed_count) : [];

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#008000"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    // markers: {
    //   size: 4,
    //   colors: ["#008000"],
    //   strokeColors: "#fff",
    //   strokeWidth: 2,
    //   hover: {
    //     size: 6,
    //   },
    // },
    xaxis: {
      categories: dates,
      labels: {
        style: {
          colors: "#000",
        },
        rotate: -45,
        trim: true,
      },
      tickAmount: Math.min(dates.length, 7),
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#e7e7e7",
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },
  };

  // Series data for the chart
  const series = [
    {
      name: "Total Passed",
      data: totalPassed,
    },
  ];

  return (
    <div className="chart">
      <div className="chart_header">
        <h3 style={{ marginBottom: "10px" }}>Total Passed</h3>
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group value={passFilter} onChange={onChangePassFilter}>
            <Radio.Button value="day">D</Radio.Button>
            <Radio.Button value="week">W</Radio.Button>
            <Radio.Button value="month">M</Radio.Button>
            <Radio.Button value="year">Y</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <Chart
        options={options}
        series={series}
        type="line"
        height={"100%"}
        width={"100%"}
      />
    </div>
  );
};

export default TotalPassesCharts;
