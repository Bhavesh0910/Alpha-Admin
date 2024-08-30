import React, {useEffect, useState} from "react";
import ReactECharts from "echarts-for-react";
import "./Stage2Statistics.scss";
import {useSelector} from "react-redux";

const StageStatisticsChart = () => {
  const {stage2ChartData} = useSelector((state) => state.risk);
  const [data, setData] = useState({passed: [], failed: [], dates: []});

  useEffect(() => {
    if (stage2ChartData) {
      let dates = [];
      let passed = [];
      let failed = [];
      dates = Object.keys(stage2ChartData?.result);
      passed = dates?.map((date) => stage2ChartData?.result[date].passed);
      failed = dates?.map((date) => stage2ChartData?.result[date].failed);
      setData((prev) => ({passed: passed, failed: failed, dates: dates}));
    }
  }, [stage2ChartData]);

  const seriesDataPassed = {
    name: "Passed",
    type: "line",
    data: data?.passed,
    lineStyle: {
      color: "#54e346",
    },
    itemStyle: {
      color: "#54e346",
    },
    showSymbol: false,
  };

  const seriesDataFailed = {
    name: "Failed",
    type: "line",
    data: data?.failed,
    lineStyle: {
      color: "#e35446",
    },
    itemStyle: {
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
    series: [seriesDataPassed || [], seriesDataFailed || []],
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
      <h2>Stage 2 Statistics</h2>
      <ReactECharts
        option={option}
        style={{height: "400px", width: "100%"}}
      />
    </div>
  );
};

export default StageStatisticsChart;
