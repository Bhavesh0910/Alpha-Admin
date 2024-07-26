import React from "react";
import ReactECharts from "echarts-for-react";
import "./StageStatisticsChart.scss";

const StageStatisticsChart = ({ data }) => {
  const dates = Object.keys(data?.result);
  const passed = dates.map(date => data?.result[date].passed);
  const failed = dates.map(date => data?.result[date].failed);

  const seriesDataPassed = {
    name: "Passed",
    type: "line",
    data: passed,
    lineStyle: {
      color: "#54e346",
    },
    showSymbol: false,
  };

  const seriesDataFailed = {
    name: "Failed",
    type: "line",
    data: failed,
    lineStyle: {
      color: "#e35446",
    },
    showSymbol: false,
  };

  const option = {

    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates,
      axisLabel: {
        color: "#1E1E1E",
      },
      axisLine: {
        lineStyle: {
          color: "#1E1E1E",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#1E1E1E",
      },
      axisLine: {
        lineStyle: {
          color: "#1E1E1E",
        },
      },
    },
    series: [seriesDataPassed, seriesDataFailed],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    backgroundColor: "#fff",
  };

  return (
    <div className="stageStatisticsChart_contianer">
      <h2>Stage Statistics</h2>
      <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default StageStatisticsChart;
