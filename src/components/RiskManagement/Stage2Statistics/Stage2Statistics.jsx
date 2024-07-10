import React from "react";
import ReactECharts from "echarts-for-react";
import "./Stage2Statistics.scss";

const Stage2Statistics = () => {
  const generateZigzagData = (data, amplitude, frequency) => {
    return data.map((value, index) => {
      return value + amplitude * Math.sin(frequency * index);
    });
  };

  const dailyData1 = generateZigzagData([400, 300, 200, 350, 400, 300, 200, 300, 450, 500, 450, 400], 50, 0.2);

  const dailyData2 = generateZigzagData([200, 150, 100, 250, 300, 200, 100, 150, 300, 350, 300, 250], 40, 0.15);

  const generateMonthRanges = (data) => {
    const monthRanges = [];
    let currentMonth = null;
    data.forEach((value, index) => {
      const date = new Date(2023, index, 1);
      const month = date.toLocaleString("default", {month: "short"});
      if (!currentMonth || currentMonth !== month) {
        monthRanges.push(month);
        currentMonth = month;
      }
    });
    return monthRanges;
  };

  const xAxisData = generateMonthRanges(dailyData1);

  const seriesData1 = {
    name: "Data 1",
    type: "line",
    data: dailyData1,
    lineStyle: {
      color: "#54e346",
    },
    showSymbol: false,
  };

  const seriesData2 = {
    name: "Data 2",
    type: "line",
    data: dailyData2,
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
      data: xAxisData,
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
    <div className="stageStatisticsChart_contianer">
      <h2>Stage 2 Statistics</h2>
      <ReactECharts
        option={option}
        style={{height: "400px", width: "100%"}}
      />
    </div>
  );
};

export default Stage2Statistics;
