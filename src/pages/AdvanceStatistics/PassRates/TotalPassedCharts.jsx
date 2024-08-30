import React, {useState} from "react";
import {Button, Radio, Space} from "antd";
import Chart from "react-apexcharts";

const TotalPassesCharts = ({data}) => {
  const [charts, setCharts] = useState("D");

  const dates = Object.keys(data);
  const totalPassed = dates.map(date => data[date].passed);

  const onChangeActive = (e) => {
    setCharts(e.target.value);
  };

  
  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#008000"], // Green color for the line
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#008000"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
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
      name: "Total Passed",
      data: totalPassed,
    },
  ];

  return (
    <div className="chart">
      <div className="chart_header">
        <h3 style={{marginBottom: "10px"}}>Total Passed</h3>
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
