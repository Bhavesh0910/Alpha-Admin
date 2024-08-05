import React, {useEffect, useState} from "react";
import ReactECharts from "echarts-for-react";
import "./StageStatisticsChart.scss";
import {useSelector} from "react-redux";

const StageStatisticsChart = () => {
  const {stage1ChartData} = useSelector((state) => state.risk);
  const [data, setData] = useState({passed: [], failed: [], dates: []});

  useEffect(() => {
    let passed = [];
    let failed = [];
    let dates = [];
    if (stage1ChartData) {
      dates = Object.keys(stage1ChartData?.result);
      passed = dates?.map((date) => stage1ChartData?.result[date].passed);
      failed = dates?.map((date) => stage1ChartData?.result[date].failed);

      setData((prev) => ({passed: passed, failed: failed, dates: dates}));
    }
  }, [stage1ChartData]);

  const seriesDataPassed = {
    name: "Passed",
    type: "line",
    data: data.passed,
    lineStyle: {
      color: "#54e346",
    },
    showSymbol: false,
  };

  const seriesDataFailed = {
    name: "Failed",
    type: "line",
    data: data.failed,
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
      <h2>Stage 1 Statistics</h2>
      <ReactECharts
        option={option}
        style={{height: "400px", width: "100%"}}
      />
    </div>
  );
};

export default StageStatisticsChart;
