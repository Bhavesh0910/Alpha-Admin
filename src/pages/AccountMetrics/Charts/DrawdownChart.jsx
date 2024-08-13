import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { dollarUS } from "../../../utils/helpers/string";

const DrawdownChart = ({ drawdownData }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    plotOptions: {
      bar: {
        borderRadius: 5,
      },
    },
    fill: {
      opacity: [1, 0.5],
      type: ["solid"],
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    colors: ["#FF5733"], // Set color for the drawdown chart
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
      height: 350,
      type: "line",
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [4],
      curve: "smooth",
    },
    grid: {
      borderColor: "#415672",
      strokeDashArray: 8,
    },
    xaxis: {
      categories: (drawdownData && drawdownData?.date && drawdownData?.date.map(date_str => date_str.split('T')[0])) || [], // Format dates as YYYY-MM-DD
      tickAmount: 15, // Limit number of ticks to 15
      tooltip: {
        enabled: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        formatter: (value) => value, // Directly use formatted date string
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        formatter: (value) => dollarUS(value),
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontWeight: "700",
      },
 
    },
  });

  useEffect(() => {
    if (drawdownData) {
      const drawdowns = drawdownData?.draw_down || [];
      const dates = (drawdownData?.date || []).map(date_str => date_str.split('T')[0]); // Extract YYYY-MM-DD

      setSeries([
        {
          name: "Drawdown",
          type: "line",
          data: drawdowns,
        },
      ]);

      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: dates,
          tickAmount: 15, // Ensure x-axis shows a maximum of 15 ticks
        }
      }));
    }
  }, [drawdownData]);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        height={"100%"}
      />
    </div>
  );
};

export default DrawdownChart;
