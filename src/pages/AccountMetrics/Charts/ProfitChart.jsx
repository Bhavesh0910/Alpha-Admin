import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { dollarUS } from "../../../utils/helpers/string";

const ProfitChart = ({ ProfitData }) => {
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
    legend: {
      fontSize: "14px",
      fontWeight: 700,
      labels: {
        colors: "white",
      },
      markers: {
        width: 15,
        height: 15,
      },
    },
    colors: ["#FD504F"],
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
    labels: (ProfitData &&
      ProfitData.date &&
      ProfitData.date.map(date_str => date_str.split('T')[0])) || [], // Format dates as YYYY-MM-DD
    xaxis: {
      categories: (ProfitData &&
        ProfitData.date &&
        ProfitData.date.map(date_str => date_str.split('T')[0])) || [], // Format dates as YYYY-MM-DD
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
      min: 0 
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontWeight: "700",
      },

    },
  });

  useEffect(() => {
    if (ProfitData) {
      const profit = ProfitData.profit || [];
      const dates = (ProfitData.date || []).map(date_str => date_str.split('T')[0]); // Extract YYYY-MM-DD

      setSeries([
        {
          name: "Profit",
          type: "line",
          data: profit,
        },
      ]);

      setOptions(prevOptions => ({
        ...prevOptions,
        labels: dates,
        xaxis: {
          ...prevOptions.xaxis,
          categories: dates,
          tickAmount: 15, // Ensure x-axis shows a maximum of 15 ticks
        }
      }));
    }
  }, [ProfitData]);

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

export default ProfitChart;
