import React, {useRef, useState} from "react";
import ApexCharts from "react-apexcharts";
import "./Stage2Chart.scss";
const Stage2Chart = () => {
  const chartRef = useRef(null);

  const options = {
    series: [1807, 8429],
    labels: ["Total Pass", "Total Fail"],
    colors: ["#A3EA93", "#F97F7F"],
    chart: {
      width: 380,
      type: "donut",
      offsetY: 0,
      offsetX: 0,
      labels: {
        show: true,
        name: "test",
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "35%",
        },
      },
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
  };

  return (
    <div className="pieChart_wrapper">
      <h2>Stage 02</h2>
      <div className="row1_wrapper">
        <div id="chart">
          <ApexCharts
            options={options}
            series={options.series}
            type="donut"
            width={350}
            height={150}
          />
        </div>
        <div className="labels_container">
          {options.labels.map((label, index) => (
            <div
              key={index}
              className="label_with_value"
            >
              <span className="value">{options.series[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage2Chart;
