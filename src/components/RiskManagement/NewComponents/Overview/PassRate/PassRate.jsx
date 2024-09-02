import React from "react";
import ReactEcharts from "echarts-for-react";
import "./PassRate.scss";
const PassRateChart = () => {
  return (
    <div className="PassRateChart_container">
      <h2>Pass Rate</h2>
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
            top:'6%',
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          tooltip: {
            trigger: "axis",
          },
          series: [
            {
              data: [0, 10, 15, 20, 25],
              type: "line",
              lineStyle: {
                color: "#25f1f5",
                width: 5,
              },
              itemStyle: {
                borderWidth: 2,
                borderColor: "#a5b0af",
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default PassRateChart;
