import React from "react";
import { Radio } from "antd";
import Chart from "react-apexcharts";

const TotalFailedCharts = ({ data, failFilter, onChangeFailFilter }) => {

  const dates = data ? data.map(item => item.period_date) : [];
  const totalFailed = data ? data.map(item => item.failed_count) : [];

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#F20000"], 
    stroke: {
      curve: "smooth",
      width: 2,
    },
    // markers: {
    //   size: 4,
    //   colors: ["#F20000"],
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

  // Data series for the chart
  const series = [
    {
      name: "Total Failed",
      data: totalFailed,
    },
  ];

  return (
    <div className="chart">
      <div className="chart_header">
        <h3 style={{ marginBottom: "10px" }}>Total Failed</h3>
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group
            value={failFilter}
            onChange={onChangeFailFilter}
          >
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

export default TotalFailedCharts;
