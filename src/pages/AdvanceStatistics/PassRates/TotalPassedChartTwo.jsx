import React, {useState} from "react";
import {Button, Radio, Space} from "antd";
import Chart from "react-apexcharts";

const TotalPassesCharts = ({data}) => {
  const [charts, setCharts] = useState("D");

  const onChangeActive = (e) => {
    setCharts(e.target.value);
  };

  const totalFailed = data?.results.map((item) => item.total_failed);

  const chartData = Array.isArray(totalFailed) ? totalFailed : [400, 600, 550, 500, 700, 800, 1100, 1050];

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#F20000"], // Green color for the line
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#F20000"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      // categories: ["Aug 1", "Aug 2", "Aug 3", "Aug 4", "Aug 5", "Aug 6", "Aug 7", "Aug 8"],
      labels: {
        style: {
          colors: "#000",
        },
        rotate: 0,
        trim: true,
      },
    },
    yaxis: {
      min: 0,
      // max: 1200,
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

  const series = [
    {
      name: "Total Failed",
      data: chartData,
    },
  ];

  return (
    <div className="chart">
      <div className="chart_header">
        <h3 style={{marginBottom: "10px"}}>Total Failed</h3>
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group
            value={charts}
            onChange={onChangeActive}
          >
            <Radio.Button value="D">D</Radio.Button>
            <Radio.Button value="W">W</Radio.Button>
            <Radio.Button value="M">M</Radio.Button>
            <Radio.Button value="Y">Y</Radio.Button>
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
