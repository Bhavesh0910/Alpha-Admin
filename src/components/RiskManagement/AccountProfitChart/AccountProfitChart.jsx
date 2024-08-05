import React, {useEffect, useState} from "react";
import ReactECharts from "echarts-for-react";
import "./AccountProfitChart.scss";
import {useSelector} from "react-redux";

const AccountProfitChart = () => {
  const {fundingChartData} = useSelector((state) => state.risk);
  const [data, setData] = useState({passed: [], failed: [], dates: []});

  useEffect(() => {
    if (fundingChartData) {
      let dates = [];
      let passed = [];
      let failed = [];
      dates = Object.keys(fundingChartData?.result);
      passed = dates?.map((date) => fundingChartData?.result[date].passed);
      failed = dates?.map((date) => fundingChartData?.result[date].failed);
      setData((prev) => ({passed: passed, failed: failed, dates: dates}));
    }
  }, [fundingChartData]);

  const seriesData1 = {
    name: "Data 1",
    type: "line",
    data: data?.passed,
    lineStyle: {
      color: "#54e346",
    },
    showSymbol: false,
  };

  const seriesData2 = {
    name: "Data 2",
    type: "line",
    data: data?.failed,
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
      data: data?.dates,
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
