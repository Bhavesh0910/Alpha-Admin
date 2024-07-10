import {colors} from "@mui/material";
import {grid} from "ldrs";
import React from "react";
import ReactApexCharts from "react-apexcharts";

function RoundedBarChart({data, color1, color2}) {
  const defaultData = {data: [], time: []};
  const chartData = data || defaultData;

  const options = {
    series: [
      {
        name: "Performance",
        data: chartData?.data,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
      // strokeDashArray: 4, // Optional: Add dashed grid lines
      strokeOpacity: 0, // Set the opacity of the grid lines here
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: color2,
            },
            {
              from: 0,
              to: Infinity,
              color: color1,
            },
          ],
        },
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      // title: {
      //   text: "Growth",
      // },
      labels: {
        formatter: function (y) {
          return y.toFixed(0) + "k";
        },
      },
    },
    xaxis: {
      type: "category",
      categories: chartData?.time,
      labels: {
        rotate: -90,
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#1E1E1E",
          borderWidth: 0.6,
          label: {
            borderColor: "#000",
            style: {
              color: "#1E1E1E",
              background: "#000",
            },
            text: "Center Line",
          },
        },
      ],
    },
  };

  return (
    <div className="chart-wrapper">
      <ReactApexCharts
        options={options}
        series={options.series}
        type="bar"
        height="100%"
      />
    </div>
  );
}

export default RoundedBarChart;
