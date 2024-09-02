import React from "react";
import ReactEcharts from "echarts-for-react";
import './style.scss'
const TotalPayout = () => {
  const seriesData1 = {
    name: "Profit",
    type: "line",
    smooth:true,
    data: [0, 10, 15, 20, 25],
    lineStyle: {
      color: "#E92B37",
    },
    showSymbol: false,
  };

  const seriesData2 = {
    name: "Loss",
    type: "line",
    smooth:true,
    data: [0, 100, 150, 200, 250],
    lineStyle: {
      color: "#5F9D51",
    },
    showSymbol: false,
  };
  return (
    <div className="TotalPayoutChart_container">
      <h2>Total Payout</h2>
      <ReactEcharts
        style={{height: "200px", width: "100%"}}
        option={{
          xAxis: {
            type: "category",
            data: ["July, 22", "Aug, 22", "Sep, 22", "Oct, 22", "Nov, 22", "Dec, 22"],
          },
          yAxis: {
            type: "value",
          },
          grid: {
            top: "6%",
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          tooltip: {
            trigger: "axis",
          },
          series: [
            seriesData1,
            seriesData2,
          ],
        }}
      />
    </div>
  );
};

export default TotalPayout;
