import React from "react";
import ReactECharts from "echarts-for-react";
import "./AccountProfitChart.scss";
const AccountProfitChart = () => {


  const seriesData1 = {
    name: "Data 1",
    type: "line",
    data: [],
    lineStyle: {
      color: "#54e346",
    },
    showSymbol: false,
  };

  const seriesData2 = {
    name: "Data 2",
    type: "line",
    data: [],
    lineStyle: {
      color: "#e35446",
    },
    showSymbol: false,
  };

  const option = {
    title: {
      left: "center",
      textStyle: {
        color: "#1E1E1E",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
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
    series: [seriesData1, seriesData2],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    backgroundColor: "#fff",
  };

  return (
    <div className="accountProfitChart_wrapper">
      <h2>Current Funding Account Profit</h2>
      <ReactECharts
        option={option}
        style={{height: "400px", width: "100%"}}
      />
    </div>
  );
};

export default AccountProfitChart;
